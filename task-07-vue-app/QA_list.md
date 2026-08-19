# QA Notes

## QA Issue Log

| ID | Area | Where I Tested | What I Found | How Bad | Status | What I Did |
|---|---|---|---|---|---|---|
| QA-01 | Favorites Persistence | Browser restart → Favorites page | After reopening the browser, the favorite count appears correctly, but the saved favorite posts do not appear and the empty-state message is shown. The posts appear after visiting the Posts page and returning to Favorites. | **Blocker** | **Not Fixed** | Investigated the behavior. The issue still needs to be checked in the favorites persistence, Pinia initialization, and posts loading flow. |
| QA-02 | Footer Layout | Laptop/Desktop → Posts API loading/error state | When the Posts section is showing an API loading/error state, the footer does not stay at the bottom and appears in the middle of the page. | Medium | **Fixed** | Updated the page/layout structure so the footer stays at the bottom when the content is short. |
| QA-03 | Mobile/Tablet Navigation | Tablet/Mobile → Open navigation menu | The Favorites navigation item was not properly centered when the menu was opened. | Low | **Fixed** | Adjusted the navigation/menu CSS to center the Favorites item correctly. |
| QA-04 | Favorite Icon Layout | Posts cards with different title lengths | The favorite/heart icon does not have stable positioning. On some cards, longer titles overlap or hide the icon. | Medium | **Not Fixed** | Identified the issue. The post card layout/CSS still needs to be adjusted. |
| QA-05 | Create Post UI | Create Post page | The Create Post page needs additional CSS and HTML structure to match the layout and styling of the other pages. | Medium | **Not Fixed** | Identified the design inconsistency during QA. Further styling and structural work are still needed. |

## Favorites Storage Note

The intended approach is to keep `localStorage` lightweight by saving only the IDs of favorite posts rather than storing complete post objects or the full API response.

Example:

```json
[1, 5, 12]
```

Further optimization of the stored data structure can be considered later, but reducing the storage size is **not required to be completed as part of the current QA issue**.