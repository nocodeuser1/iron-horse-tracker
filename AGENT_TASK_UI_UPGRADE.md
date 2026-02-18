# Agent Task: UI/UX Upgrade & Drawer Fix

## Priority 1: Fix DetailDrawer Positioning (CRITICAL)

**Problem:** The DetailDrawer modal is not centering properly on screen. When clicking requirements (especially from top of list), the drawer appears cut off at the bottom of the viewport instead of centered.

**Root Cause:** The fixed positioning with transforms isn't working as expected. Likely need to use a portal or ensure proper stacking context.

**Requirements:**
1. Modal MUST appear centered in viewport regardless of scroll position
2. Full-screen backdrop blur (wall-to-wall, top-to-bottom, no white bars)
3. Background scrolling must be locked when drawer is open
4. Drawer should be properly visible and scrollable
5. Click outside drawer (on backdrop) should close it
6. ESC key should close it

**Suggested Fix:**
- Consider using React Portal to render modal at document root
- Use `position: fixed` with proper viewport units
- Ensure z-index stacking is correct
- Test opening drawer from both top and bottom of scrolled list

## Priority 2: App-Wide UI Polish

### General Improvements
1. **Animations:** Ensure all transitions are smooth and consistent
2. **Spacing:** Check padding/margins are visually balanced
3. **Typography:** Verify hierarchy is clear (headings vs body text)
4. **Colors:** Ensure brand colors (burgundy #A43850, gold #F5A623) are used consistently
5. **Dark mode:** Verify all components look good in dark mode
6. **Responsive:** Test mobile, tablet, desktop layouts

### Specific Areas to Review
1. **Dashboard**
   - Metric cards should have hover states
   - Charts should be properly labeled and colored
   - Empty states should be clear

2. **Requirements Page**
   - Table rows need better hover feedback
   - Filter panel should be easy to use
   - CSV export should work reliably
   - Mobile card view should match desktop functionality

3. **Calendar View**
   - Events should be easy to click
   - Month navigation should be intuitive
   - Color coding should match requirements table

4. **Settings Page**
   - Forms should have clear validation
   - Save states should be obvious
   - Tab navigation should be smooth

5. **AI Chat**
   - Placeholder design should look polished
   - Sample questions should be clickable (even if demo)

### Accessibility
- Ensure proper focus states on all interactive elements
- Check color contrast ratios
- Verify keyboard navigation works

## Priority 3: Functionality Enhancements

1. **Performance**
   - Check for unnecessary re-renders
   - Optimize large lists (virtualization if needed)
   - Ensure localStorage operations are efficient

2. **User Feedback**
   - Add loading states where appropriate
   - Toast notifications for actions (mark complete, export, etc.)
   - Error states should be helpful

3. **Polish**
   - Add subtle animations to page transitions
   - Smooth scrolling where appropriate
   - Micro-interactions on buttons/cards

## Testing Checklist

- [ ] Open drawer from top of requirements list → appears centered
- [ ] Open drawer from bottom of requirements list → appears centered  
- [ ] Open drawer after scrolling halfway → appears centered
- [ ] Click backdrop → drawer closes
- [ ] Press ESC → drawer closes
- [ ] Background doesn't scroll when drawer is open
- [ ] All pages work in dark mode
- [ ] Mobile layout works on small screens
- [ ] Charts render properly
- [ ] CSV export works
- [ ] Mark complete/incomplete works and updates dashboard
- [ ] All navigation links work
- [ ] Settings persist after page reload

## Files to Focus On

**Critical:**
- `src/components/requirements/DetailDrawer.tsx` - Fix positioning
- `src/pages/Requirements.tsx` - Ensure drawer integration works

**Important:**
- `src/pages/Dashboard.tsx` - Polish metrics and charts
- `src/pages/CalendarView.tsx` - Improve event interactions
- `src/pages/SettingsPage.tsx` - Better form UX
- `src/pages/AIChat.tsx` - Polish placeholder design
- `src/components/layout/Navbar.tsx` - Smooth interactions

## Success Criteria

1. ✅ Drawer opens centered on screen from ANY scroll position
2. ✅ App looks polished and professional throughout
3. ✅ All interactions feel smooth and responsive
4. ✅ Dark mode works perfectly everywhere
5. ✅ Mobile experience is excellent
6. ✅ No console errors or warnings
7. ✅ Performance is snappy (no lag)

## Notes

- Use Opus model for this comprehensive task
- Test thoroughly in both light and dark mode
- Keep the brand colors and design language consistent
- Don't break existing functionality
- If you make significant changes, document them

**IMPORTANT:** The drawer issue is blocking the demo. Fix that first, then do the polish pass.
