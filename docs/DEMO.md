# Demo walkthrough

1. Start MongoDB (local) or set an Atlas URI in `server/.env`.
2. Configure `server/.env` with a unique `JWT_SECRET` and admin email/password.
3. Run `npm run seed`, then `npm run dev`.
4. Open `http://localhost:5173/admin/login`; sign in as the seeded administrator.
5. Review dashboard totals and latest signups.
6. Open **People**; search by name/email, add a teammate, edit role/status, and remove a non-admin test account (confirm the dialog).
7. Open a private browser window and register a normal account; confirm the person can view their profile but cannot access `/app/users` or admin APIs.
8. Sign out and sign back in to confirm the login and logout flow.

For the submission screenshot, capture the dashboard and People directory at desktop width, then one mobile-sized view of the directory. Keep screenshots in a `screenshots/` folder in the project.
- Add a teammate: admin sign-in → **People** → **Add a person** → leave Role as **Team member**.
- Add another administrator: follow the same flow, choose **Administrator** in Role, then share that new account's email/password with the intended admin.
