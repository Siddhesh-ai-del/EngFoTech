import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The database path is overridable so tests can use an isolated (or in-memory) DB.
const DB_PATH = process.env.DATABASE_PATH || "engfotech.db";
export const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profiles (
    user_id INTEGER PRIMARY KEY,
    university TEXT,
    college TEXT,
    branch TEXT,
    year TEXT,
    cgpa TEXT,
    tier TEXT,
    skills TEXT,
    interests TEXT,
    constraints TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS roadmaps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Migration: Add university column if it doesn't exist
try {
  db.prepare("ALTER TABLE profiles ADD COLUMN university TEXT").run();
} catch (e: any) {
  // Ignore error if column already exists
  if (!e.message.includes("duplicate column name")) {
    console.log("Migration info:", e.message);
  }
}

// Migration: Add college column if it doesn't exist
try {
  db.prepare("ALTER TABLE profiles ADD COLUMN college TEXT").run();
} catch (e: any) {
  // Ignore error if column already exists
  if (!e.message.includes("duplicate column name")) {
    console.log("Migration info:", e.message);
  }
}

export async function createApp() {
  const app = express();
  app.use(express.json());

  // --- API Routes ---

  // Register
  app.post("/api/auth/register", (req, res) => {
    const { email, password, name } = req.body;

    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "A valid email is required" });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    try {
      const fallbackName = email.split("@")[0];
      const result = db
        .prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)")
        .run(email, password, name || fallbackName);
      const user = { id: result.lastInsertRowid, email, name: name || fallbackName };
      res.json({ user });
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed")) {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Login
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  });

  // Google OAuth URL
  app.get("/api/auth/google/url", (req, res) => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
      redirect_uri: `${process.env.APP_URL}/api/auth/google/callback`,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };

    const qs = new URLSearchParams(options);
    res.json({ url: `${rootUrl}?${qs.toString()}` });
  });

  // Google OAuth Callback
  app.get("/api/auth/google/callback", async (req, res) => {
    const code = req.query.code as string;
    const rootUrl = "https://oauth2.googleapis.com/token";
    const options = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.APP_URL}/api/auth/google/callback`,
      grant_type: "authorization_code",
    };

    try {
      const tokenRes = await fetch(rootUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(options).toString(),
      });
      const { id_token, access_token } = await tokenRes.json();

      const userRes = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: { Authorization: `Bearer ${id_token}` },
        }
      );
      const googleUser = await userRes.json();

      if (!googleUser.verified_email) {
        return res.status(403).send("Google account not verified");
      }

      // Upsert user
      let user = db.prepare("SELECT * FROM users WHERE email = ?").get(googleUser.email) as any;
      if (!user) {
        const result = db.prepare("INSERT INTO users (email, name) VALUES (?, ?)").run(googleUser.email, googleUser.name);
        user = { id: result.lastInsertRowid, email: googleUser.email, name: googleUser.name };
      }

      // Send success message to parent window and close popup
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user: ${JSON.stringify(user)} }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Google OAuth Error", error);
      res.status(500).send("Authentication failed");
    }
  });

  // Profile
  app.post("/api/profile", (req, res) => {
    try {
      const { userId, university, college, branch, year, cgpa, tier, skills, interests, constraints } = req.body;
      
      // Verify user exists to avoid foreign key violation
      const user = db.prepare("SELECT 1 FROM users WHERE id = ?").get(userId);
      if (!user) {
        return res.status(401).json({ error: "User session invalid. Please log in again." });
      }

      db.prepare(`
        INSERT OR REPLACE INTO profiles (user_id, university, college, branch, year, cgpa, tier, skills, interests, constraints)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(userId, university, college, branch, year, cgpa, tier, JSON.stringify(skills), JSON.stringify(interests), JSON.stringify(constraints));
      res.json({ success: true });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  app.get("/api/profile/:userId", (req, res) => {
    try {
      const profile = db.prepare("SELECT * FROM profiles WHERE user_id = ?").get(req.params.userId);
      if (profile) {
        res.json({
          ...profile,
          skills: JSON.parse((profile as any).skills),
          interests: JSON.parse((profile as any).interests),
          constraints: JSON.parse((profile as any).constraints)
        });
      } else {
        res.status(404).json({ error: "Profile not found" });
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Roadmap
  app.post("/api/roadmap", (req, res) => {
    try {
      const { userId, content } = req.body;
      
      // Verify user exists to avoid foreign key violation
      const user = db.prepare("SELECT 1 FROM users WHERE id = ?").get(userId);
      if (!user) {
        return res.status(401).json({ error: "User session invalid. Please log in again." });
      }

      db.prepare("INSERT INTO roadmaps (user_id, content) VALUES (?, ?)").run(userId, JSON.stringify(content));
      res.json({ success: true });
    } catch (error) {
      console.error("Roadmap save error:", error);
      res.status(500).json({ error: "Failed to save roadmap" });
    }
  });

  app.get("/api/roadmap/:userId", (req, res) => {
    try {
      const roadmap = db.prepare("SELECT * FROM roadmaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1").get(req.params.userId);
      res.json(roadmap ? JSON.parse((roadmap as any).content) : null);
    } catch (error) {
      console.error("Roadmap fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for local development, static files in production, neither in tests.
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === "production") {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  } else if (nodeEnv !== "test") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  return app;
}

const isDirectRun = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isDirectRun) {
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${process.env.PORT}`);
  }
  createApp().then((app) => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  });
}
