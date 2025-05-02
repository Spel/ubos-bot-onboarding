# UBOS MVP Plan

## 1. Objective

Build a minimum viable product of UBOS that enables users to create and deploy a simple AI Agent with a seamless, LinkedIn-style onboarding flow:

- Authenticate via email or OAuth.
- Choose a bot name and subdomain.
- Provision and launch in one click.

## 2. Key Features

### Onboarding Flow

- [x] Email/OAuth signup with social providers (mock implementation).
- [x] Bot naming form with domain generation.
- [x] One-click provisioning that allocates subdomain (simulated).
- [x] Success screen with direct link to chat and dashboard.
- [x] Basic onboarding UI with multi-step flow (implemented in `Onboarding.jsx`)

### Default Agent Page

- [x] Automatic landing page styled with Tailwind CSS, similar to a LinkedIn company page.
- [x] Bot-specific URLs and domains for each bot.
- [x] Basic chat UI for end-user interactions (implemented in `BotLanding.jsx`).
- [ ] Public API endpoint for A2A/MCP integrations.

### Chat Interface

- [x] Responsive web page with a lightweight chat widget.
- [x] Simulated messaging with bot responses based on type.
- [x] Message history persisted in localStorage.
- [ ] Real‑time messaging over WebSocket; fallback to REST polling.
- [ ] Typing indicators and basic error handling.
- [x] Basic chat UI structure (implemented in `Chat.jsx` and `BotLanding.jsx`)

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

- [x] Automatic generation of yourbot.ubos.bot subdomain on bot creation.
- [x] Display of domain information in bot details.
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
- [x] Mock authentication system with login page
- [x] Bot onboarding flow with domain generation
- [x] Bot landing pages with unique URLs
- [x] Basic chat interface with simulated responses
- [x] GitHub repository integration

### In Progress
- [ ] Enhanced chat functionality with more realistic AI responses
- [ ] Usage tracking and visualization
- [ ] Domain provisioning system

### Next Steps
1. Enhance the chat interface with more realistic AI responses
2. Implement usage tracking and visualization in the dashboard
3. Add user profile and settings page
4. Develop domain provisioning system with custom domain support