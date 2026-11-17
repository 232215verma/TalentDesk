# Admin guide

## Sign in as admin

1. Open `http://localhost:5173/admin/login`.
2. Use the admin email and password from your private `server/.env`. This workspace has the requested Ayush admin account configured there.
3. The admin dashboard shows people totals, active/inactive accounts, administrators, and recent registrations.

## Add a team member

1. Open **People** in the sidebar.
2. Select **Add a person**.
3. Enter the person's name, email, and a temporary password of at least eight characters.
4. Leave **Role** as **Team member** and choose an account status.
5. Select **Add to team**. The account appears in the directory and can sign in at `/login`.

## Add another administrator

Follow the same steps, but choose **Administrator** in the **Role** field before selecting **Add to team**. Share the email and temporary password securely. The new administrator signs in at `/admin/login` and can manage users and workspace stats. Only grant this role to people who should have full admin access.

## Read, edit, deactivate, and delete

- **Read:** the People directory lists everyone. Search by name or email, filter by Everyone/Active/Inactive, and paginate through the results.
- **Edit:** open the row's action menu and select **Edit details**; save the name, email, role, or status changes.
- **Deactivate/reactivate:** in the row menu choose **Set inactive** or **Set active**. Inactive accounts cannot log in.
- **Delete:** choose **Remove person** and confirm the prompt. The signed-in admin cannot delete or deactivate their own account.
- **Export:** choose **Export page** to download the currently displayed page as a CSV file.

## Sign out

Use the sign-out icon beside your name in the sidebar. This removes the JWT from the browser. Admin APIs require a valid JWT and return `403` for regular user accounts.



## Workspace name

The current workspace name is stored in MongoDB. Sign in as an administrator and select the workspace name card at the top of the sidebar. Enter a name and save; it updates for all signed-in team members. The name is limited to 50 characters. Team members can see the workspace name but cannot edit it.

