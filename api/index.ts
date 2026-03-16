import express from "express";
import multer from "multer";
import { Pool } from "pg";
import { put, del } from "@vercel/blob";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

// Memory storage for Vercel Blob
const upload = multer({ storage: multer.memoryStorage() });

let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    if (!process.env.POSTGRES_URL) {
      throw new Error("POSTGRES_URL is not set.");
    }
    
    let connectionString = process.env.POSTGRES_URL;
    try {
      // Safely remove sslmode if present so it doesn't conflict with our ssl config
      const url = new URL(connectionString);
      url.searchParams.delete('sslmode');
      connectionString = url.toString();
    } catch (e) {
      console.warn("Could not parse POSTGRES_URL as URL");
    }
    
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "admin123";
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${ADMIN_SECRET_KEY}`) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

let dbInitialized = false;
async function ensureDb() {
  if (dbInitialized) return;
  if (!process.env.POSTGRES_URL) {
    console.warn("POSTGRES_URL is not set. Database operations will fail.");
    return;
  }
  try {
    await getPool().query(`
      CREATE TABLE IF NOT EXISTS machines (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        image_urls TEXT NOT NULL,
        short_description TEXT NOT NULL,
        specifications_md TEXT NOT NULL,
        slug TEXT UNIQUE
      )
    `);
    const countRes = await getPool().query('SELECT COUNT(*) as count FROM machines');
    if (parseInt(countRes.rows[0].count) === 0) {
      await getPool().query(`
        INSERT INTO machines (name, category, image_urls, short_description, specifications_md, slug)
        VALUES (
          'Heidelberg Speedmaster XL 106',
          'Printing',
          '["https://picsum.photos/seed/heidelberg/800/600", "https://picsum.photos/seed/heidelberg2/800/600"]',
          'High-performance offset printing press for commercial and packaging printing.',
          '## Specifications\n\n- **Max. sheet size:** 750 x 1,060 mm\n- **Min. sheet size:** 340 x 480 mm\n- **Max. print format:** 740 x 1,050 mm\n- **Thickness:** 0.03 - 1.05 mm\n- **Max. printing speed:** 18,000 sheets/hour\n\n### Features\n- Push to Stop technology\n- Intellistart 3\n- AutoPlate Pro',
          'heidelberg-speedmaster-xl-106'
        )
      `);
      await getPool().query(`
        INSERT INTO machines (name, category, image_urls, short_description, specifications_md, slug)
        VALUES (
          'Bobst Novacut 106 ER',
          'Die Cutting',
          '["https://picsum.photos/seed/bobst/800/600"]',
          'Die-cutter with in-line blanking, delivering perfectly stacked blanks.',
          '## Specifications\n\n- **Sheet size max:** 1,060 x 760 mm\n- **Sheet size min:** 400 x 350 mm\n- **Production speed:** Up to 8,000 sheets/hour\n- **Cutting force:** 2.6 MN\n\n### Advantages\n- Seamless blanking\n- High productivity\n- Easy job changeover',
          'bobst-novacut-106-er'
        )
      `);
    }

    // Migrate old categories to new ones
    await getPool().query(`
      UPDATE machines 
      SET category = CASE 
        WHEN category = 'Printing Machines' THEN 'Printing'
        WHEN category = 'Cutting' THEN 'Die Cutting'
        WHEN category = 'Moulding' THEN 'Injection Moulding'
        WHEN category = 'Graphic' THEN 'Finishing'
        WHEN category = 'Packaging Machines' THEN 'Packaging'
        WHEN category = 'Die Cutting Machines' THEN 'Die Cutting'
        WHEN category = 'Binding Machines' THEN 'Binding'
        WHEN category = 'Finishing Machines' THEN 'Finishing'
        WHEN category = 'Injection Moulding Machines' THEN 'Injection Moulding'
        WHEN category = 'Metalworking Machines' THEN 'Metalworking'
        ELSE category
      END
    `);
    dbInitialized = true;
  } catch (e) {
    console.error("DB Init error:", e);
  }
}

app.get("/sitemap.xml", async (req, res) => {
  try {
    await ensureDb();
    const pool = getPool();
    const result = await pool.query("SELECT slug, id FROM machines");
    const machines = result.rows;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bmimachinery.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://bmimachinery.com/catalogue</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://bmimachinery.com/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

    for (const machine of machines) {
      const path = machine.slug ? machine.slug : machine.id;
      xml += `
  <url>
    <loc>https://bmimachinery.com/machine/${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    xml += `\n</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

app.get("/api/debug-db", async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.query('SELECT NOW()');
    
    let tableExists = false;
    let machineCount = 0;
    try {
      const countRes = await pool.query('SELECT COUNT(*) as count FROM machines');
      tableExists = true;
      machineCount = parseInt(countRes.rows[0].count);
    } catch (e) {
      tableExists = false;
    }

    res.json({ 
      status: "ok", 
      time: result.rows[0].now, 
      env_set: !!process.env.POSTGRES_URL,
      tableExists,
      machineCount
    });
  } catch (e: any) {
    res.status(500).json({ 
      error: e.message, 
      stack: e.stack, 
      env_set: !!process.env.POSTGRES_URL 
    });
  }
});

let currentOtp: string | null = null;
let otpExpiry: number | null = null;
let otpAttempts = 0;
let lastOtpAttempt = 0;
let otpBlockUntil = 0;

app.post("/api/auth/login", async (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_SECRET_KEY) {
    const now = Date.now();
    
    if (now < otpBlockUntil) {
      const remainingMins = Math.ceil((otpBlockUntil - now) / 60000);
      return res.status(429).json({ error: `Too many attempts. Please try again in ${remainingMins} minutes.` });
    }
    
    if (now - lastOtpAttempt < 30000 && otpAttempts > 0) {
      return res.status(429).json({ error: "Please wait 30 seconds before requesting another OTP." });
    }

    otpAttempts++;
    lastOtpAttempt = now;

    if (otpAttempts >= 10) {
      otpBlockUntil = now + 10 * 60 * 1000; // 10 minutes
      otpAttempts = 0; // reset for after the block
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    currentOtp = otp;
    otpExpiry = now + 10 * 60 * 1000; // 10 minutes

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort),
          secure: parseInt(smtpPort) === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP';
        const city = req.headers['x-vercel-ip-city'] || 'Unknown City';
        const country = req.headers['x-vercel-ip-country'] || 'Unknown Country';
        const location = city !== 'Unknown City' ? `${city}, ${country}` : 'Unknown Location';
        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', timeZoneName: 'short' });

        await transporter.sendMail({
          from: `"BMI Machinery Security" <${smtpUser}>`,
          to: "bmimachinery@gmail.com, chetan@bmimachinery.com, krish@bmimachinery.com, notifications@bmimachinery.com",
          subject: "Admin Login OTP - BMI Machinery",
          text: `Your OTP for admin login is: ${otp}\n\nThis code will expire in 10 minutes.\n\nRequested At: ${timestamp}\nIP Address: ${ip}\nEstimated Location: ${location}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Admin Login OTP</h2>
              <p style="font-size: 16px;">Your one-time password for BMI Machinery admin access is:</p>
              <div style="background-color: #f3f4f6; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1d4ed8;">${otp}</span>
              </div>
              <p style="color: #4b5563; font-size: 14px;">This code will expire in 10 minutes.</p>
              
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
                <p style="margin: 4px 0;"><strong>Requested At:</strong> ${timestamp}</p>
                <p style="margin: 4px 0;"><strong>IP Address:</strong> ${ip}</p>
                <p style="margin: 4px 0;"><strong>Estimated Location:</strong> ${location}</p>
              </div>
            </div>
          `,
        });
      } catch (error) {
        console.error("Failed to send OTP email:", error);
        return res.status(500).json({ error: "Failed to send OTP email" });
      }
    } else {
      console.warn("SMTP credentials are not fully configured. OTP email skipped, logging in directly.");
      return res.json({ success: true, token: ADMIN_SECRET_KEY });
    }

    res.json({ success: true, requireOtp: true });
  } else {
    res.status(401).json({ error: "Invalid Admin Key" });
  }
});

app.post("/api/auth/verify-otp", (req, res) => {
  const { otp } = req.body;
  if (!currentOtp || !otpExpiry) {
    return res.status(400).json({ error: "No OTP requested or OTP expired" });
  }
  if (Date.now() > otpExpiry) {
    currentOtp = null;
    otpExpiry = null;
    return res.status(400).json({ error: "OTP has expired" });
  }
  if (otp === currentOtp) {
    currentOtp = null;
    otpExpiry = null;
    res.json({ success: true, token: ADMIN_SECRET_KEY });
  } else {
    res.status(401).json({ error: "Invalid OTP" });
  }
});

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, company, message, captchaToken } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

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
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: parseInt(smtpPort) === 465, // true for 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        tls: {
          // Do not fail on invalid certs (common with shared hosting like Namecheap)
          rejectUnauthorized: false
        }
      });

      const mailOptions = {
        from: `"BMI Machinery Notifications" <${smtpUser}>`, // sender address
        to: "chetan@bmimachinery.com, info@bmimachinery.com, bmimachinery@gmail.com, krish@bmimachinery.com", // receivers
        replyTo: email,
        subject: `New Contact Form Submission from ${name}`, // Subject line
        text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company || "N/A"}

Message:
${message}
        `, // plain text body
        html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone}</p>
<p><strong>Company:</strong> ${company || "N/A"}</p>
<br/>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br/>')}</p>
        `, // html body
      };

      const userMailOptions = {
        from: `"BMI Machinery" <${smtpUser}>`, // sender address
        to: email, // user's email
        subject: `Thank you for contacting BMI Machinery`, // Subject line
        text: `
Hi ${name},

Thank you for reaching out to BMI Machinery. We have received your message and somwone from our team will get back to you within 48 hours.

Here is a copy of your message:
--------------------------------------------------
${message}
--------------------------------------------------

Best regards,
The BMI Machinery Team
        `, // plain text body
        html: `
<p>Hi ${name},</p>
<p>Thank you for reaching out to BMI Machinery. We have received your message and our team will get back to you within 48 hours.</p>
<p>Here is a copy of your message:</p>
<hr/>
<p>${message.replace(/\n/g, '<br/>')}</p>
<hr/>
<p>Best regards,<br/>The BMI Machinery Team</p>
        `, // html body
      };

      await Promise.all([
        transporter.sendMail(mailOptions),
        transporter.sendMail(userMailOptions)
      ]);
    } catch (error) {
      console.error("Failed to send Email notification:", error);
    }
  } else {
    console.warn("SMTP credentials are not fully configured. Email notification skipped.");
  }

  res.json({ success: true });
});

app.get("/api/machines", async (req, res) => {
  await ensureDb();
  try {
    const { category } = req.query;
    let machines;
    if (category && category !== "All") {
      machines = (await getPool().query('SELECT * FROM machines WHERE category = $1 ORDER BY id DESC', [category as string])).rows;
    } else {
      machines = (await getPool().query('SELECT * FROM machines ORDER BY id DESC')).rows;
    }
    
    const formattedMachines = machines.map(m => {
      let urls = [];
      try {
        urls = JSON.parse(m.image_urls);
      } catch (e) {
        urls = [];
      }
      return { ...m, image_urls: urls };
    });
    res.json(formattedMachines);
  } catch (error: any) {
    let errorMessage = "Failed to fetch machines";
    let details = error.message;
    
    if (error.message.includes("ENOTFOUND") && error.message.includes("supabase.co")) {
      errorMessage = "Supabase IPv6 Connection Error";
      details = "Vercel does not support Supabase's direct IPv6 connection. Please go to your Supabase dashboard, enable 'Connection Pooling', and use the Pooler URL (usually ending in pooler.supabase.com:6543) as your POSTGRES_URL.";
    }

    console.error("GET /api/machines error:", error);
    res.status(500).json({ error: errorMessage, details });
  }
});

app.get("/api/machines/:idOrSlug", async (req, res) => {
  await ensureDb();
  try {
    const { idOrSlug } = req.params;
    let machine;
    
    if (!isNaN(Number(idOrSlug))) {
      const resDb = await getPool().query('SELECT * FROM machines WHERE id = $1', [Number(idOrSlug)]);
      machine = resDb.rows[0];
    }
    
    if (!machine) {
      const resDb = await getPool().query('SELECT * FROM machines WHERE slug = $1', [idOrSlug]);
      machine = resDb.rows[0];
    }

    if (machine) {
      try {
        machine.image_urls = JSON.parse(machine.image_urls);
      } catch (e) {
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

app.post("/api/upload", authMiddleware, upload.array("images", 10), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ error: "Vercel Blob token not configured" });
  }
  try {
    const urls = [];
    for (const file of files) {
      const blob = await put(`machines/${Date.now()}-${file.originalname}`, file.buffer, {
        access: 'public',
      });
      urls.push(blob.url);
    }
    res.json({ urls });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
});

app.post("/api/machines", authMiddleware, async (req, res) => {
  await ensureDb();
  const { name, category, image_urls, short_description, specifications_md, slug } = req.body;
  
  if (!name || !category || !image_urls || !short_description || !specifications_md || !slug) {
    return res.status(400).json({ error: "All fields are required" });
  }
  
  try {
    const result = await getPool().query(
      `INSERT INTO machines (name, category, image_urls, short_description, specifications_md, slug)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [name, category, JSON.stringify(image_urls), short_description, specifications_md, slug]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (error: any) {
    if (error.message.includes('unique constraint')) {
      return res.status(400).json({ error: "A machine with this slug already exists." });
    }
    
    if (error.message.includes("ENOTFOUND") && error.message.includes("supabase.co")) {
      return res.status(500).json({ 
        error: "Supabase IPv6 Connection Error. Vercel does not support Supabase's direct IPv6 connection. Please go to your Supabase dashboard, enable 'Connection Pooling', and use the Pooler URL (usually ending in pooler.supabase.com:6543) as your POSTGRES_URL." 
      });
    }

    res.status(500).json({ error: "Failed to add machine: " + error.message });
  }
});

app.put("/api/machines/:id", authMiddleware, async (req, res) => {
  await ensureDb();
  const { id } = req.params;
  const { name, category, image_urls, short_description, specifications_md, slug } = req.body;

  if (!name || !category || !image_urls || !short_description || !specifications_md || !slug) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await getPool().query(
      `UPDATE machines 
       SET name = $1, category = $2, image_urls = $3, short_description = $4, specifications_md = $5, slug = $6
       WHERE id = $7
       RETURNING id`,
      [name, category, JSON.stringify(image_urls), short_description, specifications_md, slug, id]
    );

    if (result.rowCount && result.rowCount > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Machine not found" });
    }
  } catch (error: any) {
    if (error.message.includes('unique constraint')) {
      return res.status(400).json({ error: "A machine with this slug already exists." });
    }
    res.status(500).json({ error: "Failed to update machine: " + error.message });
  }
});

app.delete("/api/machines/:id", authMiddleware, async (req, res) => {
  await ensureDb();
  const { id } = req.params;
  try {
    const machineRes = await getPool().query('SELECT image_urls FROM machines WHERE id = $1', [id]);
    if (machineRes.rowCount === 0) {
      return res.status(404).json({ error: "Machine not found" });
    }

    await getPool().query('DELETE FROM machines WHERE id = $1', [id]);

    try {
      const urls = JSON.parse(machineRes.rows[0].image_urls);
      for (const url of urls) {
        if (url.includes('public.blob.vercel-storage.com')) {
          await del(url);
        }
      }
    } catch (e) {
      console.error("Error deleting image files from blob:", e);
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /api/machines/:id error:", error);
    res.status(500).json({ error: "Failed to delete machine" });
  }
});

export default app;
