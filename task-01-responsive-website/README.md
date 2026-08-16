# AsfouraBandora

A responsive website for an independent game studio, built across Tasks 01–05 of the Blue Full Stack Training Program. Started as a static responsive layout and grew into a fully interactive, accessibility tested frontend project.

## Technologies

- HTML5
- CSS3 (custom properties, Flexbox, Grid, responsive media queries)
- Vanilla JavaScript (no frameworks, no libraries)
- Vue 3 + Vite (starting task 07 inside seperate file 'task-07-vue-app')

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

**Vue app (Task 07):**
1.Download or clone the project
2.Open terminal , write 'npm run dev', and follow the link


## Completed Tasks
 
- **Task 01–03:** Responsive layout, styling, and mobile navigation
- **Task 04:** Full JavaScript layer — contact form validation, back-to-top button, active navigation state, and statistics counters
- **Task 05:** Full QA pass  functional regression testing, accessibility audit and fixes, performance optimization, cross-browser and responsive testing, and deployment





- **Task 06 (in progress):** Modern JavaScript refactor and dynamic data

  **Part 1 : Local data ("Our Games" section)**
  - Added an "Our Games" section rendered entirely from a local JavaScript array (`Game` objects with id, title, category, description, and release year) instead of hardcoded HTML cards
  - Cards are generated with a dedicated `renderGames()` function; category filter buttons (All + one per genre in the data) are generated with `renderCategoryButton()`, and clicking a filter updates the visible cards immediately
  - The selected category filter is saved to `localStorage` and restored automatically on page reload
  - Uses `filter()`, arrow functions, and template literals as the modern JavaScript techniques applied

  **Part 2 & 3 & 4 : REST API integration, search, and UI states and Final testing **
  - Added a "Latest Posts" section that loads data from the JSONPlaceholder `/posts` endpoint using `fetch()` inside an `async` `fetchPosts()` function
  - `response.ok` is checked before the body is parsed; unsuccessful responses are treated as errors
  - Posts are rendered with a dedicated `renderPosts()` function using `textContent` (not `innerHTML`), so external API text is never injected as raw HTML
  - Implemented loading, success, empty, and error states, each mutually exclusive, plus a Retry button that re-runs `fetchPosts()` without reloading the page
  - Added a search button that filters the loaded posts by title and body (case-insensitive) without issuing a new API request, a live results counter, a "No matching results" state, and a Clear button that restores the full list
  - Added lazy loading for posts 
  - Done final checkups: inspected the API request in the browser Network tab, verified the request method, status code, timing, and response payload, tested a failed request and confirmed the error state and Retry action,verified repeated Retry clicks do not duplicate content or event listeners,organized API URLs and reusable selectors/constants in clear variables,and confirmed the browser console is free of JavaScript errors after testing all interactions

  


- **Task 07:** Vue.js Fundamentals


  The vanilla JavaScript site above is preserved unchanged. A new Vue 3 app was created in its own `task-07-vue-app` folder inside the same repository, rebuilding selected sections (header, hero, services, posts) as reusable Vue components. Full setup, component, and props/events documentation lives in `task-07-vue-app/README.md`; summary below.



  **Part 1 : Vue 3 + Vite setup**

  - Created `task-07-vue-app` with Vite's Vue 3 template, cleaned out the default demo content, and set up `src/components/` and `src/assets/`

  - Uses Composition API with `<script setup>` throughout, no Options API mixing



  **Part 2 : Componentizing the existing website**

  - Split the page into `SiteHeader`, `HeroSection`, `ServicesSection`, `ServiceCard` (+ a shared `BaseCard`), and `PostsSection` — `App.vue` only imports and arranges them

  - Services data moved into a JavaScript array and rendered with `v-for`, keyed by `service.id` (never the array index)

  - Reused the original site's styling direction and restored the responsive breakpoints (1024px / 768px / 480px) so the Vue page is responsive on desktop, tablet, and mobile



  **Part 3 :  Props, custom events, and reactive filtering**

  - 8 service records passed down to `ServiceCard` via props, with props declared explicitly (`defineProps`)

  - Category controls (All / Web / Mobile / UI-UX) built as a separate `CategoryFilter` component; selected category stored with `ref()`, visible list derived with `computed()`

  - Two custom events with `defineEmits()`: `CategoryFilter` emits `filter-change`, `ServiceCard` emits `view-details` on its "View Details" button

  - Clicking a card's "View Details" updates a parent-level `selectedService` ref and reveals a details panel (scrolled into view automatically so the update isn't missed further down the page)



  **Part 4 :  REST API integration inside Vue**

  - Same JSONPlaceholder `/posts` endpoint as Task 06, now fetched inside `PostsSection.vue` with `onMounted()` and an async `fetchPosts()`

  - `posts`, `loading`, and `error` all stored with `ref()`; `fetchPosts()` is reusable so Retry calls the same function

  - Full state coverage: loading, error + Retry, empty (API returned nothing), no results (search matched nothing), and success

  - `v-model` search input filters by title via `computed()`; lazy loading reimplemented with an `IntersectionObserver` watching a sentinel element, revealing posts in batches of 10 (matching the original site's behavior), while search shows all matches at once



  **Part 5 :  Vue rules, testing, and code quality**

  - No `document.querySelector`/`getElementById`/manual `innerHTML` anywhere  all UI state is reactive

  - No Vue Router, Pinia, Vuex, Nuxt, Axios, or jQuery — only `vue` and `vite` as dependencies

  - Fixed a bug found during review: the search input/buttons had lost their `id` attributes during componentization, leaving them unstyled 

  - Verified no console warnings or missing-key warnings, and tested at desktop, tablet, and mobile widths





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
- Task07 components : `screenshots/task 07 components.png`
- Category filter with discribtion view : `screenshots/Category filter with discribtion view .png`
- API Error state : `API error.png`
- API Error state : 

## Author
Noor Asfour