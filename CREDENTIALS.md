# VisualPermit.com - Login Credentials

## Live Domain
🌐 **https://visualpermit.com**

---

## Super Admin Access

**Login URL:** https://visualpermit.com/login

### Option 1: Generic Super Admin
```
Email:    admin@visualpermit.com
Password: SuperAdmin2026!
```

### Option 2: Israel (Baber Environmental)
```
Email:    israel@baberenvironmental.com
Password: myBaberPermitting26
```

**What you'll see:**
- Auto-redirect to `/admin-baber` (super admin panel)
- Companies table with Iron Horse Midstream
- Stats: 1 company, 1 user, 30 permits
- Manage Companies / Users / System Settings tabs

**Super Admin Capabilities:**
- View all companies
- Manage all users across companies
- System-wide settings
- Create new companies (UI placeholder ready)

---

## Company Admin Access (Demo)

**Login URL:** https://visualpermit.com/login

### Scott (Iron Horse Admin)
```
Email:    scott@baberenvironmental.com
Password: IHTempLogin26
```

### Sheila (Iron Horse Admin)
```
Email:    sheila@baberenvironmental.com
Password: IHTempLogin26
```

**What you'll see:**
- Auto-redirect to `/dashboard` (company dashboard)
- Iron Horse Midstream branding in navbar
- 30 permit requirements with tracking
- Calendar, requirements list, AI assistant, settings

**Company Admin Capabilities:**
- View/edit company permits
- Track requirements and deadlines
- Access all company features
- Cannot see super admin panel

---

## Route Structure

### Public (No Login Required)
- `/` - Landing page with VisualPermit.com branding
- `/login` - Universal login page

### Super Admin Only
- `/admin-baber` - Super admin panel
  - **Access:** Super admin only
  - **Blocked:** Company users (redirected to `/dashboard`)

### Company Users Only
- `/dashboard` - Company dashboard
- `/requirements` - Requirements list
- `/calendar` - Calendar view
- `/ai-chat` - AI assistant
- `/settings` - Company settings
  - **Access:** Company admins and users
  - **Blocked:** Super admins (redirected to `/admin-baber`)

---

## Security Notes

1. **Role Separation:**
   - Super admins CANNOT access company routes
   - Company users CANNOT access super admin routes
   - Automatic redirection enforces this

2. **URL Security:**
   - Super admin panel at non-obvious URL (`/admin-baber`)
   - No links to super admin panel in company UI

3. **Data Isolation:**
   - Each company has unique `companyId`
   - Future: Database queries scoped by company
   - Super admin can view all companies

---

## Testing the Deployment

### 1. Test Super Admin
1. Go to https://visualpermit.com
2. Click "Sign In"
3. Login with super admin credentials
4. Should redirect to `/admin-baber`
5. See companies table with Iron Horse
6. Try visiting `/dashboard` → should redirect back to `/admin-baber`

### 2. Test Company User
1. Logout (or open incognito)
2. Go to https://visualpermit.com/login
3. Login with Iron Horse credentials
4. Should redirect to `/dashboard`
5. See Iron Horse branding and permit data
6. Try visiting `/admin-baber` → should redirect to `/dashboard`

### 3. Test Logout
1. Click logout icon in navbar
2. Should return to `/` (landing page)
3. Try accessing protected routes → redirect to `/login`

---

## Deployment to Netlify

### Build Settings
```
Build command:    npm run build
Publish directory: dist
Node version:     18 or 22 (NOT 25)
```

### Deploy Options

**Option A: Drag & Drop**
1. Run `npm run build` locally
2. Drag `dist/` folder to Netlify
3. Done!

**Option B: GitHub Auto-Deploy**
1. Connect Netlify to GitHub repo
2. Set build settings above
3. Auto-deploy on push to `main`

### Current Status
- ✅ Domain configured: VisualPermit.com
- ✅ Code ready for deployment (built successfully)
- ✅ All features tested locally
- ⏳ Awaiting deployment to Netlify

---

## Quick Reference

| User Type | Email | Password | Redirects To |
|-----------|-------|----------|--------------|
| Super Admin (Generic) | admin@visualpermit.com | SuperAdmin2026! | /admin-baber |
| Super Admin (Israel) | israel@baberenvironmental.com | myBaberPermitting26 | /admin-baber |
| Iron Horse Admin (Scott) | scott@baberenvironmental.com | IHTempLogin26 | /dashboard |
| Iron Horse Admin (Sheila) | sheila@baberenvironmental.com | IHTempLogin26 | /dashboard |

---

**Last Updated:** 2026-02-18
