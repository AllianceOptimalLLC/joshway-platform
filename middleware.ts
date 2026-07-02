import { next } from "@vercel/functions";

const COOKIE_NAME = "joshway_site_gate";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

async function gateToken(secret: string): Promise<string> {
  const data = new TextEncoder().encode(`${secret}:joshway-platform-gate-v1`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie") ?? "";
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function gatePage(error = false): Response {
  const errorBlock = error
    ? `<p style="margin:0 0 16px;padding:12px 14px;border-radius:12px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.25);color:#fca5a5;font-size:14px;">Incorrect password. Try again.</p>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>JOSHWAY Platform — Preview Access</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      font-family: "Plus Jakarta Sans", system-ui, sans-serif;
      color: #f3f4f6;
      background: #08090d;
      background-image:
        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(66, 198, 238, 0.15), transparent),
        radial-gradient(ellipse 60% 40% at 100% 100%, rgba(118, 135, 243, 0.12), transparent);
    }
    .card {
      width: 100%;
      max-width: 420px;
      padding: 32px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(15, 17, 24, 0.85);
      backdrop-filter: blur(8px);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
    }
    .logo {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      margin: 0 auto 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 800;
      color: #08090d;
      background: linear-gradient(135deg, #42c6ee, #7687f3);
      box-shadow: 0 0 32px rgba(66, 198, 238, 0.25);
    }
    h1 {
      margin: 0 0 8px;
      text-align: center;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    p.sub {
      margin: 0 0 24px;
      text-align: center;
      color: #9ca3af;
      font-size: 14px;
      line-height: 1.5;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #d1d5db;
    }
    input[type="password"] {
      width: 100%;
      padding: 14px 16px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.04);
      color: #fff;
      font-size: 15px;
      font-family: inherit;
      outline: none;
    }
    input[type="password"]:focus {
      border-color: rgba(66, 198, 238, 0.5);
      box-shadow: 0 0 0 3px rgba(66, 198, 238, 0.15);
    }
    button {
      width: 100%;
      margin-top: 16px;
      padding: 14px 16px;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      color: #08090d;
      background: linear-gradient(90deg, #42c6ee, #3ab8de);
      box-shadow: 0 8px 24px rgba(66, 198, 238, 0.2);
    }
    button:hover { filter: brightness(1.08); }
    .note {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">J</div>
    <h1>Preview access</h1>
    <p class="sub">JOSHWAY Platform is password-protected while in preview. Enter the site password to continue.</p>
    ${errorBlock}
    <form method="POST" action="/">
      <label for="password">Site password</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required autofocus />
      <button type="submit">Enter platform</button>
    </form>
    <p class="note">After this gate you will still choose a demo persona to explore modules.</p>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: error ? 401 : 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export default async function middleware(request: Request) {
  const secret = process.env.SITE_PASSWORD;
  if (!secret) return next();

  const token = await gateToken(secret);
  if (getCookie(request, COOKIE_NAME) === token) return next();

  if (request.method === "POST") {
    const contentType = request.headers.get("content-type") ?? "";
    let password = "";

    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await request.formData();
      password = String(form.get("password") ?? "");
    }

    if (password === secret) {
      const url = new URL(request.url);
      return new Response(null, {
        status: 302,
        headers: {
          Location: url.pathname + url.search || "/",
          "Set-Cookie": `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
        },
      });
    }

    return gatePage(true);
  }

  return gatePage(false);
}

export const config = {
  matcher: ["/((?!assets/|favicon\\.svg).*)"],
};