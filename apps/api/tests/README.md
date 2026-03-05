# Unit test Plan

## Services

- [Users](#users)
- [Roles](#roles)
- [Invitations](#invitations)
- [Assets](#assets)
- [Events](#events)
- [Tags](#tags)
- [Licenses](#licenses)
- [Purchases](#purchases)
- [Subscriptions](#subscriptions)
- [Teams](#teams)
- [Transactions](#transactions)
- [Templates](#templates)
- [Template Versions](#template-versions)
- [Plans](#plans)
- [Webhook](#webhook)
- [Jobs](#jobs)

---

### Users

1. CRUD basics: create user, read by ID, patch name/email, soft-delete.
2. Validation: required email, valid email format, unique email, password hash required if local login.
3. Authorization: only self or admin can update profile; only admin can delete.
4. Business: assigning roles works; email verification status.
5. Edge cases: duplicate email, very long name, missing password_hash.
6. Integration: link with `roles`, `subscriptions`, `teams`, `purchases`.

### Roles

1. CRUD basic: create role, read all, update description, delete (if unused).
2. Validation: unique name.
3. Authorization: only admin can manage roles.
4. Business: default role assigned when new user created.
5. Integration: `user_roles` pivot table works correctly (user has multiple roles).

### Invitations

1. CRUD: create invitation, update content, delete invitation.
2. Validation: unique slug per owner, required title/template_id.
3. Authorization: only owner or team can edit, admin can override.
4. Business: public/private flag works (visibility in `find`).
5. Edge: invalid JSON in `data`/`meta`, missing template_id.
6. Integration: links to `templates`, used in `jobs` (render invitation).

### Assets

1. CRUD: upload asset, get asset, update metadata, delete asset.
2. Validation: mime_type required, file size > 0.
3. Authorization: only owner can manage, public flag controls read.
4. Business: link asset as cover/thumbnail of template, invitation assets.
5. Edge: unsupported file type, large file size.
6. Integration: used in `templates` + `invitations`.

### Events (Activity Logs)

1. CRUD: append event, fetch by actor/subject.
2. Validation: must have type, actor_id optional for system.
3. Authorization: only admin can see all events, user sees own activity.
4. Business: event payload stored as JSON, timestamp order works.
5. Edge: large payload, unknown type.
6. Integration: triggered by action in other services (create template -> event logged).

### Tags

1. CRUD: create tag, list tags, update name/slug, delete.
2. Validation: uniques slug, lowercase slug format.
3. Authorization: only admin can create/edit.
4. Business: many-to-many with `template`.
5. Edge: duplicate name/slug.
6. Integration: search templates by tag.

### Licenses

1. CRUD: issue license, fetch license, revoke license.
2. Validation: template_id & grantee_id required.
3. Authorization: only system/payment flow can create.
4. Business: license type(`single_use`, `multi_use`, etc.) enforced.
5. Edge: invalid template reference, expired licese.
6. Integration: created from `purchases`, used to unlock templates for users.

### Purchases

1. CRUD: create purchase record, fetch by buyer, update status.
2. Validation: license_id required, curreny valid.
3. Authorization: only buyer or admin can view.
4. Business: purchase status lifecycle (`pending` -> `succeeded` -> `refunded`).
5. Edge: double purchase of same template, invalid license reference.
6. Integration: triggers `transactions`, creates `licenses`.

### Subscriptions

1. CRUD: create subscriptions, read active, cancel subscription.
2. Validation: plan_id required, must be valid plan.
3. Authorization: only owner/admin can manage.
4. Business: status lifecycle (`trialing` -> `active` -> `past_due` -> `canceled`).
5. Edge: overlapping subscription, expired trial.
6. Integration: Stripe webhook updates status, entitlements checked when accessing premium templates.

### Teams

1. CRUD: create team, update name, delete team.
2. Validation: owner_id required.
3. Authorization: only owner/admin can update/delete.
4. Business: team_members pivot works; roles inside team (owner, editor, viewer).
5. Edge: owneer leaves team, duplicate team name.
6. Integration: team templates, invitations, billing (shared plan).

### Transactions

1. CRUD: record transaction, fetch by user.
2. Validation: purchase_id required, amount_cents > 0.
3. Authorization: only involved parties or admin can view.
4. Business: platform fee calculation in meta, credit/debit distinction.
5. Edge: negative abount, currency mismatch.
6. Integration: linked to `purchases` -> `licenses` -> `payouts`.

### Templates

1. CRUD: create Template, update content, delete template.
2. Validation: owener_id required, visibility valid (`private/public/marketplace`).
3. Authorization: only owner/team can edit, public visible to all.
4. Business: premium flag + price works, publishing sets `published_at`.
5. Edge: large `editor_state` JSON, invalid JSON.
6. Integration: linked with `tags`, `assets`, `template_versions`.

### Template Versions

1. CRUD: create version, fetch versions, update changelog.
2. Validation: template_id required, version_number auto-increment.
3. Authorization: only admin can manage.
4. Business: plan featurs grant entitlements (e.g. premium tempaltes).
5. Edge: changing price in active plan, missing currency.
6. Integration: linked to subscriptions.

### Webhooks

1. CRUD: log webhook event, mark processed.
2. Validation: provider and event_type required.
3. Authorization: only system can insert.
4. Business: idempotency check (don't process same event twice).
5. Edge: invalid payload, replayed event.
6. Integration: Stripe events update `purchases` and `subscriptions`.

### Jobs

1. CRUD: create job, fetch status, update attempts, mark done.
2. Validation: type required, invitation_id optional.
3. Authorization: only system/worker can update.
4. Business: retry logic, max attempts, queued -> processing -> complete/failed.
5. Edge: payload too large, invalid type.
6. Integration: render jobs tied to invitation/assets.
