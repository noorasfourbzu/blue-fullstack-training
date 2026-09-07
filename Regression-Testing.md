# Regression Testing Checklist

## Authentication

- [PASSED] Login with valid credentials
- [PASSED] Login with invalid credentials
- [PASSED] Authenticated user information is retrieved correctly
- [PASSED] Session persists after browser refresh
- [PASSED] Logout works correctly
- [PASSED] Protected pages are inaccessible after logout

## Posts

- [PASSED] Posts list loads correctly
- [PASSED] Post details page works correctly
- [PASSED] Non-existing post shows 404 / "Post not found"
- [PASSED] Loading state is displayed while posts are loading
- [PASSED] Empty results state is displayed when no posts match

## Categories

- [PASSED] Categories load correctly from Laravel
- [PASSED] Categories appear correctly in filters/forms
- [PASSED] Category filtering works correctly

## Search / Filter / Sort / Pagination

- [PASSED] Search works correctly
- [PASSED] Published/Draft filter works correctly
- [PASSED] Category filter works correctly
- [NOTFOUND] Sorting works correctly
- [PASSED] Pagination works correctly
- [PASSED] Pagination uses backend data, not browser-only pagination

## CRUD

- [PASSED] Create post works correctly
- [PASSED] Created post appears without manual refresh
- [PASSED] Update post works correctly
- [PASSED] Updated post appears without manual refresh
- [PASSED] Delete post confirmation works correctly
- [PASSED] Delete post works correctly
- [PASSED] Deleted post disappears without manual refresh

## Validation & Error Handling

- [PASSED] Backend validation errors are displayed clearly
- [PASSED] Network/server errors are handled clearly
- [PASSED] 401 Unauthenticated is handled correctly
- [PASSED] 403 Forbidden is handled correctly
- [PASSED] 404 Not Found is handled correctly
- [PASSED] Success messages are displayed correctly
- [PARTIALLY] Submit/action buttons are  disabled while requests are in progress

## Authorization

- [PASSED] Edit button appears only for the post owner
- [PASSED] Delete button appears only for the post owner
- [PASSED] Laravel prevents unauthorized edit/delete requests
- [PASSED] Unauthorized edit/delete requests return 403 Forbidden

## Responsive Design

- [PASSED] Main pages work correctly on desktop width
- [PASSED] Main pages work correctly on mobile width
- [PASSED] Navbar is usable on mobile
- [PASSED] Posts/cards are responsive
- [PASSED] Forms are usable on mobile
- [PASSED] Filters are usable on mobile
- [PASSED] Pagination is usable on mobile
- [PASSED] No unwanted horizontal scrolling

## Browser Refresh & Routing

- [PASSED] Refreshing the Posts page works correctly
- [PASSED] Refreshing the Post Details page works correctly
- [PASSED] Refreshing the My Posts page works correctly
- [NOFinished] Refreshing the Create Post page works correctly
- [PASSES] Protected routes correctly check authentication after refresh
- [PASSED] Invalid/expired token does not restore authenticated state after refresh

## Automated Tests

- [PASSED] Laravel automated tests pass
- [PASSED] Vue automated tests pass