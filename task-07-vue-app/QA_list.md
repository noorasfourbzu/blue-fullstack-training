# QA Notes

## QA Issue Log

| ID | Area | Where I Tested | What I Found | How Bad | Status | What I Did |
|---|---|---|---|---|---|---|
| QA-01 | Favorites Persistence | Browser restart → Favorites page | After reopening the browser, the favorite count appears correctly, but the saved favorite posts do not appear and the empty-state message is shown. The posts appear after visiting the Posts page and returning to Favorites. | **Blocker** | **Fixed** | Run a seperate loading for the favorite posts,by matching the saved IDs from the local storage |
| QA-02 | Footer Layout | Laptop/Desktop → Posts API loading/error state | When the Posts section is showing an API loading/error state, the footer does not stay at the bottom and appears in the middle of the page. | Medium | **Fixed** | Updated the page/layout structure so the footer stays at the bottom when the content is short. |
| QA-03 | Mobile/Tablet Navigation | Tablet/Mobile → Open navigation menu | The Favorites navigation item was not properly centered when the menu was opened. | Low | **Fixed** | Adjusted the navigation/menu CSS to center the Favorites item correctly. |
| QA-04 | Favorite Icon Layout | Posts cards with different title lengths | The favorite/heart icon does not have stable positioning. On some cards, longer titles overlap or hide the icon. | Medium | **Fixed** | Added margins and other CSS simple solutions. |
| QA-05 | Create Post UI | Create Post page | The Create Post page needs additional CSS and HTML structure to match the layout and styling of the other pages. | Medium | **Fixed** | matched the contact page CSS structure, Added correct success\ failure message. |
| QA-06 | Post Details navigation | "Back" button always went to `/posts`, even when the user came from Favorites |  **Fixed** | Track the previous route and send the user back to Favorites when that's where they came from, otherwise `/posts` |
| QA-07 | Create Post validation messages | Validation errors (empty/invalid fields) showed the same message as connection errors |  **Fixed** | Added a separate validation-error message telling the user to check the highlighted fields |
| QA-08 | Create Post buttons | "Create Post" and "Retry" both showed after a failed submit, and Retry wasn't disabled while submitting (double-clicking risk) |  **Fixed** | Merged into one button that relabels to "Retry" and stays disabled while submitting |


## Favorites Storage Note
Stayed under the requirments of not storing lots of data, by only storing  id and done a seperate api fetch for the posts in the favorite posts section.
Time complixity must be considered for larger API form next time. 