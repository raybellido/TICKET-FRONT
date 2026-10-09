# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Internal IT helpdesk. Employees acting as CUSTOMER file and track their own issues; support staff acting as AGENT triage and resolve tickets through OPEN → IN_PROGRESS → RESOLVED → CLOSED; IT admins acting as ADMIN manage users and roles. Single-page internal tool used on desktop and mobile browsers during the workday.

## Product Purpose

Let internal users file support tickets, track status and priority, and let agents advance them through a fixed lifecycle. Success means fast ticket filing, clear status/priority visibility, and role-gated actions without extra process weight.

## Positioning

A deliberately simple internal ticket tool: login, ticket list with status/priority filters, ticket detail with history, and minimal admin user management. No assignment engine, SLA, comments, or notifications — neighboring products with those are out of scope by choice.

## Operating Context

Workflows: JWT login (email/password) → ticket list filtered by status/priority → open detail (description + status history) → create ticket → start/resolve/close (AGENT/ADMIN only) → change priority (AGENT/ADMIN only) → ADMIN creates users and changes roles by user id. No client router; view switching is local state (`tickets` | `users`). UI copy is Spanish. Backend is the system of record for auth and authorization (403 enforced server-side; role UI-gating is UX only).

## Capabilities and Constraints

Confirmed functionality: email/password login with localStorage token + role; `GET /api/tickets` list (summary, no description) with optional `?status=` `?priority=`; `GET /api/tickets/{id}` full detail; `POST /api/tickets`; `POST /api/tickets/{id}/start|resolve|close`; `PATCH /api/tickets/{id}/priority`; `POST /api/users`; `PATCH /api/users/{id}/role`. Backend has no user-list endpoint; role change requires a known user id.

Technical constraints (must preserve): React 19 + Vite + Tailwind CSS 4 SPA; API base `http://localhost:8080`; JWT Bearer in `Authorization` header, token/role in localStorage (`helpdesk_token`, `helpdesk_role`); 401 means expired session → logout; 403 means missing role. Responsive grid (1 col mobile, 2 col sm, 3 col lg) for ticket cards.

Explicitly undecided: production API base URL and deployment target; session-expiry UX beyond logout; whether user listing/search will ever exist.

## Brand Commitments

Name: Helpdesk. Spanish UI voice, terse and instructional. Existing minimal system: white cards on gray-50 page, indigo-600 primary actions, gray borders. No logo, custom font, or external brand assets confirmed — do not invent any.

## Evidence on Hand

Real implementation in `src/`: `App.tsx` (login + view switch), `pages/TicketsPage.tsx`, `pages/UsersPage.tsx`, `components/Navbar.tsx`, `components/TicketCard.tsx`, `components/TicketDetail.tsx`, `components/CreateTicketForm.tsx`, `service/api.ts`, `service/authService.ts`, `service/ticketService.ts`, `service/userService.ts`, `types/ticket.ts`, `types/user.ts`. No testimonials, customers, benchmarks, pricing, or marketing assets — future work must not fabricate them.

## Product Principles

1. Backend is authority; the frontend reflects roles and states it does not grant.
2. Filing a ticket must stay frictionless; triage actions stay explicitly gated.
3. Status and priority are always visible and filterable, never hidden in detail-only views.
4. Errors are stated plainly in the user's language with the next action, not console-only.
5. Minimal surface on purpose: add workflow only when the internal desk asks for it.
