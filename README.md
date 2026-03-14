# BMI Machinery - Official Website & Inventory Management

A modern, full-stack web application built for BMI Machinery, an industrial machinery import business. This platform features a public-facing catalog for customers to browse available machinery, a secure contact form, and a protected admin dashboard for seamless inventory management.

## 🚀 Features

- **Dynamic Machinery Catalog:** Customers can browse and view detailed specifications of available industrial machinery.
- **Secure Admin Dashboard:** Protected by a custom One-Time Password (OTP) authentication system sent via email. Includes session inactivity timeouts for enhanced security.
- **Inventory Management:** Admins can add, edit, and remove machinery listings in real-time.
- **AI-Powered Content Generation:** Integrated with the Google Gemini API to automatically generate rich, professional descriptions for new machinery based on basic inputs.
- **Spam-Protected Contact Form:** Utilizes Cloudflare Turnstile CAPTCHA and Nodemailer to securely route customer inquiries to the sales team.
- **Responsive Design:** Fully optimized for desktop, tablet, and mobile devices using Tailwind CSS.

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (Icons)
- Vite (Build Tool)

**Backend:**
- Node.js
- Express.js

**Database & Storage:**
- PostgreSQL

**Security & Integrations:**
- Nodemailer (Email Notifications & OTP)
- Cloudflare Turnstile (CAPTCHA)
- Google Gemini API (AI Content Generation)

## ⚙️ Environment Variables

To run this project locally, create a `.env` file in the root directory and add the following variables:

```env
# Database
POSTGRES_URL=your_postgresql_connection_string

# Authentication
ADMIN_SECRET_KEY=your_admin_master_password

# Email Configuration (Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# Security
TURNSTILE_SECRET_KEY=your_cloudflare_turnstile_secret

# AI Integration
GEMINI_API_KEY=your_google_gemini_api_key
```

## 💻 Run Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
