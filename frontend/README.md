# UBOS MVP Plan

## 1. Objective

Build a minimum viable product of UBOS that enables users to create and deploy a simple AI Agent with a seamless, LinkedIn-style onboarding flow:

- Authenticate via email or OAuth.
- Choose a bot name and subdomain.
- Provision and launch in one click.

## 2. Key Features

### Onboarding Flow

- [ ] Email/OAuth signup with social providers.
- [ ] Bot naming form with real-time domain availability check.
- [ ] One-click provisioning that allocates subdomain, container, and TPU-sec credit.
- [ ] Success screen with direct link to chat and dashboard.
- [x] Basic onboarding UI with multi-step flow (implemented in `Onboarding.jsx`)

### Default Agent Page

- [x] Automatic landing page styled with Tailwind CSS, similar to a LinkedIn company page.
- [ ] Pre-configured chat UI for end-user interactions.
- [ ] Public API endpoint for A2A/MCP integrations.

### Chat Interface

- [ ] Responsive web page with a lightweight chat widget.
- [ ] Real‑time messaging over WebSocket; fallback to REST polling.
- [ ] Message history persisted per session.
- [ ] Typing indicators and basic error handling.
- [x] Basic chat UI structure (implemented in `Chat.jsx`)

### Admin Dashboard

- [x] Dashboard UI with light/dark mode toggle (implemented in `Dashboard.jsx`)
- [x] Bot management interface with CRUD operations (implemented in `MyBots.jsx`)
- [x] Bot statistics overview showing total bots, active bots, and categories
- [ ] Usage overview: current TPU-sec balance, monthly consumption chart.
- [ ] Content management: upload Q&A pairs, knowledge snippets, or CSV imports.
- [ ] Chat-driven configuration: adjust bot behavior directly in chat.
- [ ] Pro mode: advanced settings for developers and API integrations.
- [ ] Bot control: start, stop, or freeze the container.
- [ ] Logs view: recent conversations and system events.

### Usage & Billing Tracking

- [ ] Allocate 2,592,000 free TPU‑seconds per bot per month.
- [ ] Meter consumption at the message-block level (e.g., tokens × model factor).
- [ ] Visual gauge of remaining credits with low‑balance alerts in dashboard.
- [ ] Stubbed invoice generator for end‑of‑month summary (no payment processing).

### Domain Provisioning & DNS Setup

- [ ] Automatic creation of yourbot.ubos.site subdomain on first deploy.
- [ ] Copy‑paste CNAME instructions for custom domains (e.g., chat.yourcompany.com).

### Notifications & Alerts

- [ ] Email/SMS placeholder integrations for critical usage thresholds.
- [ ] Webhook support for external billing or monitoring systems.

### Security & Permissions

- [ ] Basic API key generation for external integrations.
- [ ] Role‑based access in admin panel (owner vs. team member).
- [ ] HTTPS enforced on all endpoints.

## 3. Current Progress

### Completed
- [x] Project setup with React, Vite, and Tailwind CSS
- [x] Light/dark mode theme implementation
- [x] Basic navigation with React Router
- [x] Dashboard UI with bot statistics
- [x] My Bots page with CRUD operations
- [x] Sidebar navigation with Dashboard and My Bots links
- [x] Local storage for bot data management
- [x] Responsive design with Tailwind CSS and Preline UI components

### In Progress
- [ ] Authentication system
- [ ] Real-time chat functionality
- [ ] Usage tracking and visualization
- [ ] Domain provisioning system

### Next Steps
1. Implement authentication flow
2. Build the chat interface with real-time messaging
3. Create the domain provisioning system
4. Develop usage tracking and billing features