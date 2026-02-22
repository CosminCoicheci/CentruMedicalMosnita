# How to configure Netlify (step-by-step)

## Part 1: Connect the site and build

### If the site is not on Netlify yet

1. Go to **[netlify.com](https://www.netlify.com)** and log in.
2. Click **Add new site** → **Import an existing project**.
3. Choose **GitHub** (or GitLab / Bitbucket) and authorize Netlify.
4. Select the repository that contains this project (e.g. `CentruMedicalMosnita`).
5. **Build settings** – Netlify will read these from your `netlify.toml` file. You should see:
   - **Build command:** `npm run build`
   - **Publish directory:** `.`
   - **Branch:** `main` (or whatever your default branch is)
6. Click **Deploy site**. Wait for the first build to finish.

### If the site is already on Netlify

1. Go to **[app.netlify.com](https://app.netlify.com)** and open your site.
2. Go to **Site configuration** → **Build & deploy** → **Build settings**.
3. Confirm **Build command** is `npm run build` and **Publish directory** is `.`.  
   If you have `netlify.toml` in the repo root, Netlify uses these automatically; otherwise set them here and click **Save**.
4. Optionally click **Trigger deploy** → **Deploy site** to run a new build.

---

## Part 2: Enable editing from the browser (Identity + Git Gateway)

### Step 1: Enable Identity

1. In the left sidebar, click **Identity**.
2. Click **Enable Identity** (or **Settings and usage** if it’s already on).
3. Under **Registration preferences** choose **Invite only** so only people you invite can create accounts.
4. Click **Save** if you changed anything.

### Step 2: Enable Git Gateway

1. Still under **Identity**, open the **Services** tab (or scroll to **Git Gateway**).
2. Find **Git Gateway** and click **Enable Git Gateway**.
3. Confirm. This lets the admin panel (`/admin`) save changes by committing to your Git repo.

### Step 3: Invite editors

1. In **Identity**, go to the **Invite users** tab (or **Users** → **Invite users**).
2. Enter the person’s **email address**.
3. Click **Invite** (or **Send invite**). They receive an email to set their password and log in.
4. Give them the admin URL: **`https://[your-site-name].netlify.app/admin/`**  
   (Replace `[your-site-name]` with your actual site name, e.g. `centru-medical-mosnita`.)

---

## Part 3: Check the branch (for the admin panel)

The admin panel is configured to use the **main** branch (in `admin/config.yml`).

- If your repo’s default branch is **main** → no change needed.
- If it’s **master**, edit `admin/config.yml` and set:
  ```yaml
  backend:
    name: git-gateway
    branch: master
  ```
  Then commit and push. Redeploy if needed.

---

## Quick checklist

| Step | Where in Netlify | Action |
|------|------------------|--------|
| 1 | Build & deploy | Build command: `npm run build`, Publish: `.` (from `netlify.toml` or set manually) |
| 2 | Identity | Enable Identity |
| 3 | Identity → Services | Enable Git Gateway |
| 4 | Identity | Registration: **Invite only** (optional) |
| 5 | Identity → Invite users | Add editor emails and send invites |
| 6 | — | Share `https://[site-name].netlify.app/admin/` with editors |

After this, editors can open the admin link, log in with the email you invited, and edit the site from the browser. No Node.js or npm needed on their side.
