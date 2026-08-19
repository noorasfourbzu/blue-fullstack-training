# AsfouraBandora

A responsive website for an independent game studio, built across Tasks 01–06 of the Blue Full Stack Training Program. Started as a static responsive layout and grew into a fully interactive, accessibility tested frontend project.

This README covers the vanilla HTML/CSS/JS project only (Tasks 01–06). The Vue
version of this project (Tasks 07–09) lives in a separate folder,
`task-07-vue-app`, with its own README.

## Technologies

- HTML5
- CSS3 (custom properties, Flexbox, Grid, responsive media queries)
- Vanilla JavaScript (no frameworks, no libraries)

## Features

### Layout & Navigation
- Responsive layout for desktop, tablet, and mobile screens
- Sticky header that stays visible while scrolling
- Accessible mobile menu that can be opened and closed with the keyboard
- Mobile menu closes when pressing Escape or selecting a link
- Active navigation link updates based on the section currently in view
- Skip-to-content link for keyboard users
- Clear focus styles for links, buttons, and form fields
- Search results highlight the searched word in post titles

### Contact Form
- Client-side validation for name, email, phone, subject, and message
- Each field has its own validation rules and error message
- Phone validation supports different international number formats
- Phone numbers are checked by counting digits only
- Character limits are applied to the form fields
- Live character counter for the message field
- Fields are checked when the user leaves them and while they fix an error
- The form focuses on the first invalid field when submitted
- Accessible error messages using ARIA attributes
- Success and error messages are announced to screen readers
- The form clearly explains that no data is sent to a server

### Interactive Features
- Back-to-top button appears after scrolling
- Back-to-top button is keyboard accessible
- Statistics count up when the section becomes visible
- Animations respect the user's reduced-motion preference
- Images use lazy loading
- Posts use lazy loading when they are loaded

### Performance & Accessibility
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

For the Vue version of this project (Tasks 07–09), see `task-07-vue-app/README.md`.


## Completed Tasks

- **Task 01–03:** Responsive layout, styling, and mobile navigation.
- **Task 04:** JavaScript functionality including form validation, back-to-top, active navigation, and statistics counters.
- **Task 05:** QA testing, accessibility and performance improvements, responsive/cross-browser testing, and deployment.
- **Task 06:** Modern JavaScript refactor, local game data with category filtering and localStorage, JSONPlaceholder API integration, search, UI states, and lazy loading.

Tasks 07–09 (Vue 3, Vue Router, Pinia) continue inside `task-07-vue-app` — see that
project's own README for details.

## Known Limitations

- The contact form has no backend  it validates and displays a success message, but no data is actually sent anywhere.
- Phone number validation checks digit count only (7–15 digits, based on the international E.164 standard), not whether the number is actually a real, dialable number for a specific country.



## Screenshots

- Final desktop view: `screenshots/final desktop view.png`
- Final mobile view: `screenshots/final mobile view.png`
- Lighthouse accessibility result: `screenshots/lighthouse-accessibility.png`
- Lighthouse accessibility result :`screenshots/lighthouse-performance.png`
- Visible keyboard-focus state: `screenshots/keyboard-focus state.png`
- Category filter with discribtion view : `screenshots/Category filter with discribtion view .png`
- API Error state : `API error.png`

Screenshots for Tasks 07–09 (Vue app) are documented in `task-07-vue-app/README.md`.

## Author
Noor Asfour