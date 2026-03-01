import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import multer from "multer";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

// Node 18+ has fetch globally.
const db = new Database("machines.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS machines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    image_urls TEXT NOT NULL,
    short_description TEXT NOT NULL,
    specifications_md TEXT NOT NULL,
    slug TEXT
  )
`);

// Create unique index separately to be safe across SQLite versions
db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_machines_slug ON machines(slug)");

// Robust Migrations
try {
  const tableInfo = db.prepare("PRAGMA table_info(machines)").all() as any[];
  
  // 1. Handle image_url -> image_urls rename
  const hasImageUrl = tableInfo.some(col => col.name === 'image_url');
  const hasImageUrls = tableInfo.some(col => col.name === 'image_urls');
  if (hasImageUrl && !hasImageUrls) {
    console.log("Renaming image_url to image_urls...");
    db.exec("ALTER TABLE machines RENAME COLUMN image_url TO image_urls");
  }

  // 2. Handle slug column addition
  const hasSlug = tableInfo.some(col => col.name === 'slug');
  if (!hasSlug) {
    console.log("Adding slug column...");
    try {
      // Add without UNIQUE first, then index
      db.exec("ALTER TABLE machines ADD COLUMN slug TEXT");
      db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_machines_slug ON machines(slug)");
    } catch (e) {
      console.error("Failed to add slug column via ALTER TABLE:", e);
    }
  }

  // 3. Backfill slugs for existing machines
  const machinesWithoutSlug = db.prepare("SELECT id, name FROM machines WHERE slug IS NULL").all() as any[];
  if (machinesWithoutSlug.length > 0) {
    console.log(`Backfilling ${machinesWithoutSlug.length} slugs...`);
    const updateSlug = db.prepare("UPDATE machines SET slug = ? WHERE id = ?");
    for (const m of machinesWithoutSlug) {
      const baseSlug = m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      let slug = baseSlug;
      let counter = 1;
      // Ensure uniqueness
      while (db.prepare("SELECT id FROM machines WHERE slug = ? AND id != ?").get(slug, m.id)) {
        slug = `${baseSlug}-${counter++}`;
      }
      updateSlug.run(slug, m.id);
    }
  }
} catch (e) {
  console.error("Migration error:", e);
}

// Insert some sample data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM machines").get() as { count: number };
console.log(`Current machine count in database: ${count.count}`);
if (count.count === 0) {
  console.log("Database is empty, inserting sample data...");
  const insert = db.prepare(`
    INSERT INTO machines (name, category, image_urls, short_description, specifications_md, slug)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  insert.run(
    "Heidelberg Speedmaster XL 106",
    "Printing",
    JSON.stringify(["https://picsum.photos/seed/heidelberg/800/600", "https://picsum.photos/seed/heidelberg2/800/600"]),
    "High-performance offset printing press for commercial and packaging printing.",
    "## Specifications\n\n- **Max. sheet size:** 750 x 1,060 mm\n- **Min. sheet size:** 340 x 480 mm\n- **Max. print format:** 740 x 1,050 mm\n- **Thickness:** 0.03 - 1.05 mm\n- **Max. printing speed:** 18,000 sheets/hour\n\n### Features\n- Push to Stop technology\n- Intellistart 3\n- AutoPlate Pro",
    "heidelberg-speedmaster-xl-106"
  );
  
  insert.run(
    "Bobst Novacut 106 ER",
    "Cutting",
    JSON.stringify(["https://picsum.photos/seed/bobst/800/600"]),
    "Die-cutter with in-line blanking, delivering perfectly stacked blanks.",
    "## Specifications\n\n- **Sheet size max:** 1,060 x 760 mm\n- **Sheet size min:** 400 x 350 mm\n- **Production speed:** Up to 8,000 sheets/hour\n- **Cutting force:** 2.6 MN\n\n### Advantages\n- Seamless blanking\n- High productivity\n- Easy job changeover",
    "bobst-novacut-106-er"
  );
  console.log("Sample data inserted.");
}

// Multer setup for file uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Simple Auth Middleware
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "admin123";
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${ADMIN_SECRET_KEY}`) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static("uploads"));

  // Auth Route
  app.post("/api/auth/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_SECRET_KEY) {
      res.json({ success: true, token: ADMIN_SECRET_KEY });
    } else {
      res.status(401).json({ error: "Invalid Admin Key" });
    }
  });

  // Debug Route
  app.get("/api/debug/db", (req, res) => {
    try {
      const machines = db.prepare("SELECT * FROM machines").all();
      const tableInfo = db.prepare("PRAGMA table_info(machines)").all();
      res.json({ machines, tableInfo });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API Routes
  app.post("/api/contact", async (req, res) => {
    const { name, email, phone, company, message, captchaToken } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    // CAPTCHA Validation
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      if (!captchaToken) {
        return res.status(400).json({ error: "CAPTCHA token is missing" });
      }
      try {
        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: captchaToken,
          }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          return res.status(400).json({ error: "CAPTCHA verification failed" });
        }
      } catch (error) {
        console.error("CAPTCHA verification error:", error);
        return res.status(500).json({ error: "Failed to verify CAPTCHA" });
      }
    } else {
      console.warn("TURNSTILE_SECRET_KEY missing. Skipping CAPTCHA validation.");
    }

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramToken && telegramChatId) {
      const text = `
🆕 *New Contact Form Submission*

👤 *Name:* ${name}
📧 *Email:* ${email}
📞 *Phone:* ${phone}
🏢 *Company:* ${company || "N/A"}

📝 *Message:*
${message}
      `;

      try {
        const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: text,
            parse_mode: "Markdown",
          }),
        });

        if (!response.ok) {
          console.error("Telegram API error:", await response.text());
        }
      } catch (error) {
        console.error("Failed to send Telegram notification:", error);
      }
    } else {
      console.warn("Telegram credentials missing. Skipping notification.");
    }

    res.json({ success: true });
  });

  app.get("/api/machines", (req, res) => {
    try {
      const { category } = req.query;
      let query = "SELECT * FROM machines";
      let params: any[] = [];
      
      if (category && category !== "All") {
        query += " WHERE category = ?";
        params.push(category);
      }
      
      const machines = db.prepare(query).all(...params) as any[];
      // Parse image_urls JSON
      const formattedMachines = machines.map(m => {
        try {
          let urls = [];
          if (typeof m.image_urls === 'string') {
            if (m.image_urls.startsWith('[') || m.image_urls.startsWith('{')) {
              urls = JSON.parse(m.image_urls);
            } else if (m.image_urls.startsWith('http')) {
              // Handle raw URL string
              urls = [m.image_urls];
            }
          } else if (Array.isArray(m.image_urls)) {
            urls = m.image_urls;
          }
          return {
            ...m,
            image_urls: Array.isArray(urls) ? urls : []
          };
        } catch (e) {
          console.error(`Error parsing image_urls for machine ${m.id}:`, e);
          return { ...m, image_urls: [] };
        }
      });
      res.json(formattedMachines);
    } catch (error) {
      console.error("GET /api/machines error:", error);
      res.status(500).json({ error: "Failed to fetch machines" });
    }
  });

  app.get("/api/machines/:idOrSlug", (req, res) => {
    try {
      const { idOrSlug } = req.params;
      let machine;
      
      // Try to find by ID first if it's a number, otherwise by slug
      if (!isNaN(Number(idOrSlug))) {
        machine = db.prepare("SELECT * FROM machines WHERE id = ?").get(idOrSlug) as any;
      }
      
      if (!machine) {
        machine = db.prepare("SELECT * FROM machines WHERE slug = ?").get(idOrSlug) as any;
      }

      if (machine) {
        try {
          let urls = [];
          if (typeof machine.image_urls === 'string') {
            if (machine.image_urls.startsWith('[') || machine.image_urls.startsWith('{')) {
              urls = JSON.parse(machine.image_urls);
            } else if (machine.image_urls.startsWith('http')) {
              urls = [machine.image_urls];
            }
          } else if (Array.isArray(machine.image_urls)) {
            urls = machine.image_urls;
          }
          machine.image_urls = Array.isArray(urls) ? urls : [];
        } catch (e) {
          console.error(`Error parsing image_urls for machine ${machine.id}:`, e);
          machine.image_urls = [];
        }
        res.json(machine);
      } else {
        res.status(404).json({ error: "Machine not found" });
      }
    } catch (error) {
      console.error("GET /api/machines/:idOrSlug error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/upload", authMiddleware, upload.array("images", 10), (req, res) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const urls = files.map(file => `/uploads/${file.filename}`);
    res.json({ urls });
  });

  app.post("/api/machines", authMiddleware, (req, res) => {
    const { name, category, image_urls, short_description, specifications_md, slug } = req.body;
    
    console.log("Adding machine:", { name, category, slug });

    if (name === undefined || category === undefined || image_urls === undefined || short_description === undefined || specifications_md === undefined || slug === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    try {
      const info = db.prepare(`
        INSERT INTO machines (name, category, image_urls, short_description, specifications_md, slug)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(name, category, JSON.stringify(image_urls), short_description, specifications_md, slug);
      
      res.status(201).json({ id: info.lastInsertRowid });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: "A machine with this slug already exists." });
      }
      res.status(500).json({ error: "Failed to add machine: " + error.message });
    }
  });

  app.put("/api/machines/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    const { name, category, image_urls, short_description, specifications_md, slug } = req.body;

    if (name === undefined || category === undefined || image_urls === undefined || short_description === undefined || specifications_md === undefined || slug === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const result = db.prepare(`
        UPDATE machines 
        SET name = ?, category = ?, image_urls = ?, short_description = ?, specifications_md = ?, slug = ?
        WHERE id = ?
      `).run(name, category, JSON.stringify(image_urls), short_description, specifications_md, slug, id);

      if (result.changes > 0) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Machine not found" });
      }
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: "A machine with this slug already exists." });
      }
      res.status(500).json({ error: "Failed to update machine: " + error.message });
    }
  });

  app.post("/api/ai/refine", authMiddleware, async (req, res) => {
    const { name, short_description, specifications_md } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key not configured on server. Please set GEMINI_API_KEY in the Secrets panel." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are a product copywriter for an industrial machinery company called BMI Machinery.
        Refine the following machine details to be more professional, elaborate, and well-formatted.
        
        Machine Name: ${name}
        Short Description: ${short_description}
        Specifications (Markdown): ${specifications_md}
        
        Please return a JSON object with the following fields:
        - refinedName: Properly capitalized and formatted machine name.
        - refinedShortDescription: A more professional and engaging short description.
        - refinedSpecifications: Elaborated and beautified markdown specifications.
        
        Ensure the markdown is clean and uses professional terminology.`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error: any) {
      console.error("AI Refinement error:", error);
      res.status(500).json({ error: "AI refinement failed: " + error.message });
    }
  });

  app.delete("/api/machines/:id", authMiddleware, (req, res) => {
    const { id } = req.params;
    try {
      // Get machine first to find images to delete
      const machine = db.prepare("SELECT image_urls FROM machines WHERE id = ?").get(id) as any;
      if (!machine) {
        return res.status(404).json({ error: "Machine not found" });
      }

      // Delete from DB
      db.prepare("DELETE FROM machines WHERE id = ?").run(id);

      // Try to delete local image files
      try {
        const urls = JSON.parse(machine.image_urls);
        urls.forEach((url: string) => {
          if (url.startsWith("/uploads/")) {
            const filePath = path.join(process.cwd(), url);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
        });
      } catch (e) {
        console.error("Error deleting image files:", e);
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("DELETE /api/machines/:id error:", error);
      res.status(500).json({ error: "Failed to delete machine" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
