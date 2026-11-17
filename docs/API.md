# API Reference

Base URL for local development: `http://localhost:5000/api`.

All request and response bodies use JSON. Protected routes require `Authorization: Bearer <JWT>`. Tokens expire after seven days. Newly registered accounts always receive the `user` role; use the seed command to create the first administrator.

## Public endpoints

### `GET /health`
Returns `{ "status": "ok", "database": "connected" }` when the API is healthy.

### `POST /auth/register`
Request: `{ "name": "Avery Lee", "email": "avery@example.com", "password": "at-least-8-chars" }`

Returns `201` with `{ token, user }`. Duplicate email returns `409`.

### `POST /auth/login`
Request: `{ "email": "avery@example.com", "password": "..." }`

Returns `{ token, user }`; invalid credentials return `401`, inactive account returns `403`.

## Signed-in endpoint

### `GET /auth/me`
Returns `{ user }` for the token owner. An absent, invalid or expired token returns `401`.

## Admin endpoints

### `GET /dashboard/stats`
Returns `total`, `active`, `inactive`, `admins`, and up to five `recentUsers`.

### `GET /users?page=1&limit=8&search=avery&status=active`
Returns `{ users, total, page, pages, counts }`. `limit` is capped at 50. Search matches name and email. Optional `status` is `all`, `active`, or `inactive`; `counts` reports matching totals for each status.

### `POST /users`
Request: `{ "name": "Avery Lee", "email": "avery@example.com", "password": "at-least-8-chars", "role": "user", "status": "active" }`.

Returns `201` with `{ user }`.

### `GET /users/:id`
Returns `{ user }`, or `404` when not found.

### `PUT /users/:id`
Accepts any subset of `name`, `email`, `password`, `role` (`user` or `admin`), and `status` (`active` or `inactive`). Returns `{ user }`.

### `DELETE /users/:id`
Returns `{ message }`. Administrators cannot delete their own account.

## Error format

Errors are JSON: `{ "message": "Readable explanation" }`. Common statuses are `400` validation error, `401` authentication required/expired, `403` role or account restriction, `404` not found, and `409` duplicate email.



