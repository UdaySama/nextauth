# React + Next.js Authentication System

A production-ready authentication system built with **Next.js** and **Asgardeo** (WSO2 Identity Platform). Implements JWT-based auth, OAuth/OIDC, MFA, social login, role-based access control (RBAC), protected routes, and secured APIs.

Based on the [RoadsideCoder React Authentication crash course](https://www.youtube.com/watch?v=GcxYbhGhO7Q).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Authentication Flow](#authentication-flow)
- [Protected Routes](#protected-routes)
- [Asgardeo Setup](#asgardeo-setup)
- [Available Scripts](#available-scripts)
- [Concepts Covered](#concepts-covered)
- [Resources](#resources)
- [License](#license)

---

## Features

- 🔐 **Authentication** with Asgardeo / WSO2 Identity Platform
- 🛡️ **Authorization** with Role-Based Access Control (RBAC)
- 🔑 **JWT** (JSON Web Tokens) with HS256 / RS256 support
- ♻️ **Access & Refresh Tokens** with automatic renewal
- 🌐 **OAuth 2.0 / OIDC** compliant authentication
- 📱 **Multi-Factor Authentication (MFA)**
- 🔗 **Social Login** (Google, and more)
- 🚧 **Protected Routes** via Next.js middleware
- 🔒 **Protected APIs** (`/api` and `/trpc` routes)
- 📝 **Password Validation, Recovery & Expiration** flows
- 👤 **App Header with User Dropdown**
- ⚡ **Next.js App Router** with middleware-based route protection
- 🎨 **Tailwind CSS** for styling

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Auth Provider | [Asgardeo / WSO2 Identity Platform](https://wso2.com/identity-platform/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Runtime | [Node.js](https://nodejs.org/) |
| Package Manager | npm / pnpm / yarn |

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** `v18.x` or higher
- **npm**, **pnpm**, or **yarn**
- A free **Asgardeo account** — [Sign up here](https://wso2.com/identity-platform/)
- **Git**

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Set up environment variables

Copy the example env file and fill in your Asgardeo credentials:

```bash
cp .env.example .env.local
```

See [Environment Variables](#environment-variables) for the full list.

### 4. Run the development server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the root of your project with the following:

```env
# Asgardeo Configuration
ASGARDEO_CLIENT_ID=your_client_id
ASGARDEO_CLIENT_SECRET=your_client_secret
ASGARDEO_BASE_URL=https://api.asgardeo.io/t/your_org_name
ASGARDEO_SCOPES=openid profile email

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Never commit `.env.local`** — it is already included in `.gitignore`.

---

## Project Structure

```
.
├── app/
│   ├── (auth)/
│   │   ├── signin/page.tsx       # Sign-in page
│   │   └── signup/page.tsx       # Sign-up page
│   ├── dashboard/page.tsx        # Protected dashboard
│   ├── profile/page.tsx          # Protected profile
│   ├── admin/page.tsx            # Protected admin (RBAC)
│   ├── api/                      # Protected API routes
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AppHeader.tsx             # Header with user dropdown
│   ├── SignInForm.tsx
│   ├── SignUpForm.tsx
│   └── UserDropdown.tsx
├── lib/
│   └── auth.ts                   # Auth helpers
├── middleware.ts                 # Route protection middleware
├── public/
├── styles/
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Authentication Flow

1. **User visits a protected route** (e.g. `/dashboard`)
2. **Middleware runs** — `asgardeoMiddleware` intercepts the request
3. **Route matcher check** — `isProtectedRoutes(req)` determines if auth is required
4. **If unauthenticated** — user is redirected to Asgardeo login
5. **After login** — Asgardeo redirects back with an authorization code
6. **Token exchange** — access token + refresh token + ID token issued
7. **Session created** — user can now access protected routes
8. **Token refresh** — refresh token silently renews access tokens

---

## Protected Routes

Route protection is handled in `middleware.ts`:

```ts
import {
  asgardeoMiddleware,
  createRouteMatcher,
} from "@asgardeo/nextjs/middleware";

const isProtectedRoutes = createRouteMatcher([
  "/dashboard",
  "/profile",
  "/admin",
]);

export const proxy = asgardeoMiddleware(async (asgardeo, req) => {
  if (isProtectedRoutes(req)) {
    return await asgardeo.protectRoute();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

**How it works:**

- `createRouteMatcher` defines which paths need authentication
- `asgardeoMiddleware` wraps the request and provides `protectRoute()`
- The `matcher` config excludes static assets (`_next`, images, fonts, etc.) while still covering `/api` and `/trpc` routes

To add more protected routes, simply add the path to the `createRouteMatcher` array:

```ts
const isProtectedRoutes = createRouteMatcher([
  "/dashboard",
  "/profile",
  "/admin",
  "/settings",   // new
  "/billing",    // new
]);
```

---

## Asgardeo Setup

1. **Create an account** at [wso2.com/identity-platform](https://wso2.com/identity-platform/)
2. **Create a new application** in the Asgardeo console
3. **Configure the redirect URLs**:
   - Authorized redirect URL: `http://localhost:3000/api/auth/callback`
   - Allowed origins: `http://localhost:3000`
4. **Enable sign-in options** you want (Google, MFA, etc.)
5. **Copy the Client ID and Client Secret** into `.env.local`

For detailed setup, refer to the official docs:
- [WSO2 Next.js Quickstart](https://wso2.com/identity-platform/docs/guides/nextjs/)
- [WSO2 Next.js Docs](https://wso2.com/identity-platform/docs/)

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

---

## Concepts Covered

This project demonstrates the following authentication concepts:

- **Authentication vs Authorization** — who you are vs what you can do
- **RBAC vs ABAC vs REBAC** — role-based, attribute-based, relationship-based access control
- **Sessions vs Tokens** — stateful vs stateless auth
- **Access Token vs Refresh Token** — short-lived access, long-lived refresh
- **JWT (JSON Web Tokens)** — structure and use cases
- **HS256 vs RS256** — symmetric vs asymmetric signing
- **OAuth 2.0 vs OIDC** — authorization vs identity layer
- **PKCE** — Proof Key for Code Exchange
- **MFA** — Multi-Factor Authentication
- **Social Login** — Google, GitHub, etc.
- **Protected Routes** — route-level auth enforcement
- **Protected APIs** — API-level auth enforcement

---

## Resources

- 📺 [Learn React Authentication in 50 Minutes (Full Course)](https://www.youtube.com/watch?v=GcxYbhGhO7Q)
- 📝 [WSO2 Identity Platform Docs](https://wso2.com/identity-platform/docs/)
- 🔗 [WSO2 Next.js Quickstart](https://wso2.com/identity-platform/docs/guides/nextjs/)
- 💻 [RoadsideCoder Channel](https://www.youtube.com/@RoadsideCoder)
- 🐙 [Original Source Code](https://github.com/piyush-eon/react-auth)

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- Tutorial by **RoadsideCoder (Piyush Garg)**
- Auth powered by **WSO2 Asgardeo**
- Built with **Next.js** and **TypeScript**

---

⭐ If you found this project helpful, please consider giving it a star!