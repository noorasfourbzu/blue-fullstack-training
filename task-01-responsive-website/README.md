# AsfouraBandora

A responsive website for an independent game studio, built across Tasks 01–05 of the Blue Full Stack Training Program. Started as a static responsive layout and grew into a fully interactive, accessibility tested frontend project.

## Technologies

- HTML5
- CSS3 (custom properties, Flexbox, Grid, responsive media queries)
- Vanilla JavaScript (no frameworks, no libraries)

## Features

**Layout & navigation**
- Responsive layout for desktop, tablet, and mobile screens
- Sticky header that stays visible while scrolling
- Accessible mobile navigation menu (opens/closes, closes on Escape or on link click, keyboard-operable)
- Active navigation highlighting that tracks which section is currently in view (built with `IntersectionObserver`)
- Skip-to-content link for keyboard users, visible on focus
- Visible keyboard focus states on every interactive element (links, buttons, form fields)

**Contact form**
- Full client-side validation for name, email, phone, subject, and message, each with its own rules
- Phone validation counts only digits (ignoring formatting characters like spaces, `+`, `-`, and parentheses), so it works correctly for any country's format
- Character limits enforced two ways: natively with `maxlength`, and in JavaScript (the phone field specifically blocks extra digits while still allowing formatting characters)
- Live character counter on the message field
- Validates a field when it loses focus, then re validates live while the user corrects a mistake
- On submit it focuses automatically moves to the first invalid field
- Accessible error handling: `aria-invalid`, `aria-describedby`, and a `role="status"` banner that announces success or error messages
- Success message clearly states no data is sent to a server (this is a front-end only training project)

**Interactive extras**
- Back-to-top button that appears after scrolling, keyboard accessible, scrolls smoothly back to the top
- Statistics section with animated count up numbers that play once when the section first comes into view
- Both animations respect `prefers-reduced-motion` and skip/shorten themselves accordingly
- lazy loading is applied on images , eventhought right now we dont realy need it(since we only have the logo)
- lazy loading is applied in posts section
- posts section can 

**Performance & accessibility**
- Lighthouse Accessibility score: 100/100
- Lighthouse Performance score: 100/100



## API UI States

- Loading: displayed while the request is in progress
- Empty: when there is nothing found
- Error: an error message and Retry button are displayed
- Retry: sends the request again after a failed request
- Reached limits: shown at the end after loading all available posts

## Setup / How to Run

1. Download or clone the project.
2. Open the `index.html` file in a web browser — no build step, no installs, no dependencies.


## Completed Tasks
 

- **Task 01–03:** Responsive layout, styling, and mobile navigation
- **Task 04:** Full JavaScript layer — contact form validation, back-to-top button, active navigation state, and statistics counters
- **Task 05:** Full QA pass  functional regression testing, accessibility audit and fixes, performance optimization, cross-browser and responsive testing, and deployment





- **Task 06 (in progress):** Modern JavaScript refactor and dynamic data

  **Part 1 — Local data ("Our Games" section)**
  - Added an "Our Games" section rendered entirely from a local JavaScript array (`Game` objects with id, title, category, description, and release year) instead of hardcoded HTML cards
  - Cards are generated with a dedicated `renderGames()` function; category filter buttons (All + one per genre in the data) are generated with `renderCategoryButton()`, and clicking a filter updates the visible cards immediately
  - The selected category filter is saved to `localStorage` and restored automatically on page reload
  - Uses `filter()`, arrow functions, and template literals as the modern JavaScript techniques applied

  **Part 2 & 3 & 4 — REST API integration, search, and UI states and Final testing **
  - Added a "Latest Posts" section that loads data from the JSONPlaceholder `/posts` endpoint using `fetch()` inside an `async` `fetchPosts()` function
  - `response.ok` is checked before the body is parsed; unsuccessful responses are treated as errors
  - Posts are rendered with a dedicated `renderPosts()` function using `textContent` (not `innerHTML`), so external API text is never injected as raw HTML
  - Implemented loading, success, empty, and error states, each mutually exclusive, plus a Retry button that re-runs `fetchPosts()` without reloading the page
  - Added a search button that filters the loaded posts by title and body (case-insensitive) without issuing a new API request, a live results counter, a "No matching results" state, and a Clear button that restores the full list
  - Added lazy loading for posts 
  - Done final checkups: inspected the API request in the browser Network tab, verified the request method, status code, timing, and response payload, tested a failed request and confirmed the error state and Retry action,verified repeated Retry clicks do not duplicate content or event listeners,organized API URLs and reusable selectors/constants in clear variables,and confirmed the browser console is free of JavaScript errors after testing all interactions

  


## Known Limitations
 
- The contact form has no backend — it validates and displays a success message, but no data is actually sent anywhere. 
- Phone number validation checks digit count only (7–15 digits, based on the international E.164 standard), not whether the number is actually a real, dialable number for a specific country.
- The GitHub Pages deployment currently has an issue that still needs to be resolved.


## Screenshots

- Final desktop view: `screenshots/final desktop view.png`
- Final mobile view: `screenshots/final mobile view.png`
- Lighthouse accessibility result: `screenshots/lighthouse-accessibility.png`
- Lighthouse accessibility result :`screenshots/lighthouse-performance.png`
- Visible keyboard-focus state: `screenshots/keyboard-focus state.png`


## Author
Noor Asfour