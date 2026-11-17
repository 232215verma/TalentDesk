# Deploy TalentDesk on Vercel

TalentDesk has a React/Vite client and an Express/MongoDB API. Deploy them as **two Vercel projects** from the same GitHub repository. Vercel serves the Express app as a Function; MongoDB must be hosted remotely (MongoDB Atlas), because a local MongoDB instance is not reachable by a deployed app.

## Before deploying

1. Push the project to GitHub. Vercel imports the repository and deploys new commits automatically.
2. Create a MongoDB Atlas database and copy its connection string. Replace `<password>` with the database user's password and URL-encode special characters in that password.
3. Keep database credentials, JWT secrets, and admin passwords in Vercel Environment Variables. Never commit `.env` files or put secrets in `VITE_*` variables.

## 1. Deploy the API

1. In Vercel, choose **Add New → Project**, then import the TalentDesk repository.
2. Set **Root Directory** to `server` and deploy. Keep the detected Node/Express settings; `src/server.js` exports the Express app for Vercel.
3. Open the API project’s **Settings → Environment Variables** and add these for Production (and Preview too if you will use preview deployments):

   | Name | Value |
   |---|---|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A long, random private value |
   | `CLIENT_URL` | `http://localhost:5173` for now; add the frontend URL in step 2 |
   | `ADMIN_NAME` | Name for the first administrator |
   | `ADMIN_EMAIL` | Email for the first administrator |
   | `ADMIN_PASSWORD` | A strong private password for the first administrator |

4. Redeploy the API after adding environment variables. Note its deployed URL, for example `https://talentdesk-api.vercel.app`.

## 2. Deploy the client

1. Add another Vercel project and import the same repository again.
2. Set **Root Directory** to `client`.
3. Add the Environment Variable `VITE_API_URL` with the API URL plus `/api`, for example `https://talentdesk-api.vercel.app/api`.
4. Deploy. Note the client URL Vercel assigns, for example `https://talentdesk.vercel.app`.

## 3. Connect the two deployments

1. In the API project, change `CLIENT_URL` to the exact client URL from step 2 (no trailing slash). For local development plus production, use a comma-separated value such as `http://localhost:5173,https://talentdesk.vercel.app`.
2. Redeploy the API so the CORS setting takes effect.
3. Open `https://<your-api-domain>/api/health`. It should return JSON with `"status":"ok"` and `"database":"connected"`.
4. Open the client URL and sign in with the admin account configured in the API environment variables.

The client includes a Vercel rewrite so React Router routes such as `/admin/login` load directly and on refresh.

## Create the first admin record

The API seed script is a local command, not a Vercel deployment step. Set `MONGODB_URI`, `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `server/.env` to the same Atlas database and initial admin values, then run `npm run seed` from the repository root. Keep that `.env` file private and do not commit it. The seed is safe to rerun for the configured admin email.

## Troubleshooting

- **Database disconnected / API error:** confirm the Atlas URI, database username/password, and Atlas Network Access rules. Atlas must accept connections from the deployed API; use Atlas’s current Vercel/serverless guidance for network access.
- **Browser CORS error:** make sure API `CLIENT_URL` exactly matches the deployed client origin, then redeploy the API.
- **Client cannot reach the API:** verify `VITE_API_URL` ends in `/api`, then redeploy the client. Vite variables are embedded at build time.
- **Deep link returns 404:** confirm `client/vercel.json` is included in the deployed commit and the Vercel client project root is `client`.
