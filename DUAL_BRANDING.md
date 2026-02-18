# Dual Branding System

## Overview
The app uses a **dual-logo system** to balance white-label customization with platform attribution:

1. **Company Logo** - Client's branding (front and center)
2. **VisualPermit.com Logo** - Platform provider (visible in Settings)

## Logo Locations

### Company Logo (Iron Horse Midstream)
- **File:** `public/IH White Logo.png`
- **Used in:**
  - Navbar (top left, all pages)
  - Login page (hero)
  - Settings About tab (company info card)
- **Purpose:** Client-facing branding for daily use

### Platform Logo (VisualPermit.com)
- **File:** `public/visualpermit-logo.png`
- **Used in:**
  - Settings → About tab ("Powered by" section at bottom)
- **Purpose:** Platform attribution, clear ownership

## Design Philosophy

### User Experience
- **During normal use:** Users see their company logo (Iron Horse) prominently
- **In Settings → About:** Users see they're using VisualPermit.com platform
- **Balance:** Company logo is primary, VP logo is secondary but visible

### Future Multi-Tenant Implementation
When building the multi-company version:

1. **Company Logo Upload:**
   - Add upload field in Super Admin panel (company settings)
   - Store in S3/Supabase Storage (`/company-logos/{companyId}.png`)
   - Serve via signed URL or public bucket
   - Replace navbar logo dynamically based on logged-in user's company

2. **VisualPermit.com Logo:**
   - Always shown in Settings → About tab (hardcoded)
   - Cannot be changed/removed by companies
   - Ensures platform attribution

3. **Login Page:**
   - Show company logo if user selected from dropdown
   - Show VisualPermit.com logo on initial load (before company selection)

## File Paths

```
public/
├── IH White Logo.png          # Iron Horse company logo
└── visualpermit-logo.png      # VisualPermit.com platform logo
```

## Usage Examples

### Navbar (Current)
```tsx
<img
  src="/IH White Logo.png"
  alt="Iron Horse Midstream"
  className="h-10 w-auto drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]"
/>
```

### Settings About (Current)
```tsx
{/* Company Section */}
<img src="/IH Logo.png" alt="Iron Horse" className="h-16 w-auto" />

{/* Platform Attribution */}
<div className="pt-6 border-t">
  <p className="text-xs text-gray-400">Powered by</p>
  <img src="/visualpermit-logo.png" alt="VisualPermit.com" className="h-16 w-auto" />
</div>
```

### Future Multi-Tenant
```tsx
// Navbar (dynamic)
<img
  src={company.logoUrl || '/visualpermit-logo.png'}
  alt={company.name}
  className="h-10 w-auto"
/>

// Settings About (VP logo always present)
<img
  src="/visualpermit-logo.png"
  alt="VisualPermit.com"
  className="h-16 w-auto"
/>
```

## Brand Guidelines

### Iron Horse Colors
- Burgundy: `#A43850`
- Gold: `#F5A623`

### VisualPermit.com Colors
- Same burgundy/gold palette (brand consistency)
- Shield icon with "VP" in logo

### Logo Usage Rules
1. **Company logo** - Client can customize (upload their own)
2. **VP logo** - Never removed, always in Settings → About
3. **Minimum size** - 40px height (navbar), 64px height (Settings)
4. **Backgrounds** - VP logo works on light/dark (no glow effect needed)

## Benefits

✅ **For Clients:**
- Their branding front and center
- Professional white-label feel
- Custom logo upload capability

✅ **For VisualPermit.com:**
- Clear platform attribution
- Marketing presence in every deployment
- Professional "Powered by" placement

✅ **For Users:**
- Know which company's tracker they're using
- Understand the underlying platform
- Clear ownership and support contact

---

Last updated: 2026-02-18
