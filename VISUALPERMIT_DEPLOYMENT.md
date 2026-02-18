# VisualPermit.com Deployment Guide

## Overview
The app is now configured for multi-tenant SaaS deployment at **VisualPermit.com** with role-based access control.

## Live Domain
**Domain:** VisualPermit.com (deployed on Netlify)

## Architecture

### Public Routes
- **/** - Landing page with VisualPermit.com branding
- **/login** - Universal login page for all users

### Role-Based Routes

#### Super Admin
- **Email:** `admin@visualpermit.com`
- **Password:** `SuperAdmin2026!`
- **Route:** `/admin-baber` (non-obvious URL for security)
- **Access:** Manage all companies, users, and system settings
- **Features:**
  - View/manage all companies
  - User management across companies
  - System-wide settings
  - Company creation/deletion

#### Company Admin (Iron Horse example)
- **Email:** `scott@baberenvironmental.com`
- **Password:** `IHTempLogin26`
- **Routes:** `/dashboard`, `/requirements`, `/calendar`, `/ai-chat`, `/settings`
- **Access:** Company-specific permit tracking
- **Features:**
  - Dashboard with company metrics
  - Requirement tracking
  - Calendar view
  - Settings management
  - Cannot access super admin panel

## Login Flow

### 1. Public Visitor
1. Visit **VisualPermit.com** → sees landing page
2. Click "Sign In" or "Get Started" → redirects to `/login`
3. Enter credentials
4. System routes based on role:
   - Super admin → `/admin-baber`
   - Company user → `/dashboard`

### 2. Already Authenticated
- Super admin visiting `/` → auto-redirects to `/admin-baber`
- Company user visiting `/` → auto-redirects to `/dashboard`
- Super admin trying to access `/dashboard` → blocked, redirected to `/admin-baber`
- Company user trying to access `/admin-baber` → blocked, redirected to `/dashboard`

## User Roles

### `super_admin`
- Full system access
- Manage all companies and users
- Access super admin panel
- Cannot access company-specific routes (by design - maintains separation)

### `company_admin`
- Manage company settings
- Full CRUD on permits/requirements
- Invite/manage company users
- Cannot access super admin panel

### `user`
- View and update permits/requirements
- Limited settings access
- Cannot access super admin panel

## Demo Credentials

### Super Admin
```
Email: admin@visualpermit.com
Password: SuperAdmin2026!
→ Redirects to: /admin-baber
```

### Iron Horse Company Admin
```
Email: scott@baberenvironmental.com
Password: IHTempLogin26
→ Redirects to: /dashboard
```

## Security Features

### Route Protection
- **Public routes:** Landing page, login page
- **Authenticated routes:** All others
- **Role-based protection:**
  - Super admin routes block company users
  - Company routes block super admins
  - Automatic redirection to appropriate dashboard

### URL Security
- Super admin panel at `/admin-baber` (non-obvious path)
- No links to super admin panel in company UI
- Company users have no visibility into super admin features

### Data Isolation
- Each company has `companyId` in user object
- Future: Company-scoped queries (WHERE companyId = ?)
- Super admin can view all companies
- Company users only see their own data

## Multi-Company Setup

### Current State (Demo)
1 company configured:
- **Company ID:** `iron-horse-1`
- **Company Name:** Iron Horse Midstream
- **Logo:** `/IH White Logo.png`
- **Users:** 1 (Scott - company_admin)
- **Permits:** 30 (Title V requirements)

### Adding New Companies (Future)
1. Super admin logs in at `/admin-baber`
2. Click "+ Add Company" button
3. Fill in company details:
   - Company name
   - Upload logo
   - Set permit types
   - Create first admin user
4. System generates:
   - Unique `companyId`
   - Login credentials for company admin
   - Isolated data storage

## Branding System

### Dual Logo Strategy
1. **Company Logo** (front and center)
   - Displayed in navbar for company users
   - Shown on login page after company selection
   - Customizable per company

2. **VisualPermit.com Logo** (platform attribution)
   - Always visible in Settings → About tab
   - Cannot be removed by companies
   - Landing page hero
   - Super admin panel

### Logo Files
```
public/
├── IH White Logo.png          # Iron Horse company logo
├── visualpermit-logo.png      # VisualPermit.com platform logo
└── [future company logos]     # Uploaded via super admin panel
```

## Deployment Checklist

### Netlify Configuration
- [x] Domain: VisualPermit.com
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Node version: 18 or 22 (not 25)
- [ ] Environment variables: None required (demo uses hardcoded credentials)

### Post-Deployment
1. Verify landing page loads at **VisualPermit.com**
2. Test super admin login → should redirect to `/admin-baber`
3. Test company admin login → should redirect to `/dashboard`
4. Test logout → should return to landing page
5. Verify route protection (try accessing `/admin-baber` as company user)

## Future Enhancements

### Backend Integration
- [ ] Replace hardcoded credentials with database auth
- [ ] Add Supabase/Firebase for data persistence
- [ ] Company-scoped database queries
- [ ] Logo upload to cloud storage (S3/Supabase Storage)

### Super Admin Features
- [ ] Create/edit/delete companies
- [ ] User management (invite, disable, delete)
- [ ] System analytics dashboard
- [ ] Billing/subscription management
- [ ] Email notification settings

### Company Features
- [ ] Company settings page (logo upload, branding)
- [ ] Team member invitations
- [ ] Role assignment (admin vs user)
- [ ] Permit upload workflow (PDF → AI extraction → review → approve)

### Multi-Tenancy
- [ ] Database schema with company isolation
- [ ] Company-scoped queries
- [ ] Data import/export per company
- [ ] Custom domains (e.g., ironhorse.visualpermit.com)

## Support Contacts

### Platform Support
- **Email:** support@visualpermit.com
- **Sales:** sales@visualpermit.com

### Company-Specific Support
Each company sees their own support contact in Settings → About

## Version History

### v1.0.0 (2026-02-18)
- Initial multi-tenant deployment
- Role-based authentication
- Super admin panel
- Iron Horse Midstream demo company
- Landing page with VisualPermit.com branding

---

Last updated: 2026-02-18
