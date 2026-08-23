# AsfouraBandora — Vue App

This is the Vue 3  version of the AsfouraBandora website. It started in Task 07 and is
being built up task by task inside this same project (`task-07-vue-app`). The original
vanilla HTML/CSS/JS version from Tasks 01–06 lives in a separate folder and is not
touched by this app.

## Technologies

- Vue 3 (Composition API, `<script setup>`)
- Vite
- Vue Router
- Pinia
- Fetch API (no Axios)

## Setup / How to Run

1. Download or clone the project.
2. Open a terminal inside `task-07-vue-app`.
3. Run:
   ```
   npm install
   npm run dev
   ```
4. Open the link shown in the terminal.

## Project Structure

```
src/
  stores/posts.js       -> Pinia store (shared state)
  services/postsApi.js  -> plain fetch functions (GET posts, POST post)
  composables/usePost.js -> fetches ONE post by id, used only by PostDetailsView
  composables/api.js     -> holds the shared API URL
  router/index.js        -> all app routes
  views/                 -> one file per page/route
  components/            -> reusable UI pieces (PostCard, BaseCard, etc.)
```

**Why it's split this way:**
- `stores/posts.js` is the single place that owns the posts list, loading/error
  state, and favorite IDs. Views do not keep their own separate copy of this data.
- `services/postsApi.js` only sends requests and returns data. It does not hold any
  state — the store calls it and manages loading/error/result itself.
- `composables/usePost.js` (singular) is kept outside Pinia on purpose. It loads a
  single post for `PostDetailsView`, which is local, per-page data, not something
  shared across the app.

## Features

### Task 07 — Vue Basics
- Reusable components with props and emits (`PostCard`, `ServiceCard`, `BaseCard`, etc.)
- Reactive state and computed values
- Posts and services rendered from data using `v-for`
- Search filters posts and highlights the matching text
- Loading / empty / error UI states while fetching data
- Images use lazy loading

### Task 08 — Vue Router / SPA Navigation
- Single Page Application navigation using Vue Router (no page reloads)
- Routes: `/`, `/services`, `/posts`, `/posts/:id`, `/posts/create`, `/favorites`, `/contact`
- `/posts/:id` opens post details using a dynamic URL, e.g. `/posts/1`
- Services and Posts pages are lazy-loaded (only downloaded when visited)
- A "Not Found" page is shown for any unknown route
- Active navigation link shows the current page
- Post details page shows its own loading, error, and not-found states
- Post search is saved in the URL and restored after a refresh or shared link
- Browser Back/Forward buttons work correctly

### Task 09 — Pinia, Forms & API Mutations

**Store structure**
- `src/stores/posts.js` is a Pinia store (Composition API style) and is the single
  source of truth for shared data.
- **State:** `posts`, `loading`, `error`, `favoriteIds`, `submitting`, `submitError`,
  `lastCreatedPost`
- **Getters:** `favoritePosts` (list of full post objects that are favorited),
  `favoriteCount` (number of favorites)
- **Actions:** `fetchPosts`, `retryFetch`, `toggleFavorite`, `persistFavorites`,
  `restoreFavorites`, `createPost`

**Persistent favorites**
- Clicking the heart icon on a post (in `PostCard` or on `PostDetailsView`) calls
  `store.toggleFavorite(post.id)`.
- Only the post **IDs** are saved to `localStorage`, not full post objects.
- `restoreFavorites()` runs once when the app starts (`App.vue`, `onMounted`), so
  favorites are still there after a page refresh.
- The favorite count in the header (`SiteHeader.vue`) reads directly from the store,
  so it updates instantly no matter which page you favorited from.
- The `/favorites` page lists all favorited posts and shows an empty-state message
  when there are none yet.

**Create Post form (`CreatePostView.vue`)**
- Fields: Title, Body, User ID — all connected with `v-model`.
- Validation rules (checked live, shown after the user leaves a field):
  - Title: required, minimum 5 characters, 100 character limit with a remaining-count hint.
  - Body: required, minimum 10 characters, maximum 500 characters, with a live character counter.
  - User ID: required, must be a positive whole number.
- The submit button is disabled while the form is submitting, so it can't be sent twice.

**POST request behavior**
- On submit, the store's `createPost()` action sends a real `POST` request to
  `https://jsonplaceholder.typicode.com/posts` using `fetch()` and `async/await`,
  with a JSON body (`title`, `body`, `userId`) and the `Content-Type: application/json` header.
- **Loading:** the button shows "Submitting..." while the request is running.
- **Success:** the form clears itself and shows the ID JSONPlaceholder returned.
- **Error:** the form keeps whatever the user typed (nothing is lost) and shows an
  error message with a Retry button.

  

**Known limitation — JSONPlaceholder persistence**
JSONPlaceholder is a fake/test API. It accepts the POST request and replies as if the
post was created (usually with `id: 101`), but it does **not** actually save the new
post on its server. Refreshing or reloading the posts list will not show the post you
just "created" — this is expected and is a limit of the free test API, not a bug in
this app.

## Development QA Log (Tasks 07–09)

Issues found and fixed during development, before the Task 10 regression pass.

| ID | Area | Where I Tested | What I Found | How Bad | Status | What I Did |
|---|---|---|---|---|---|---|
| QA-01 | Favorites Persistence | Browser restart → Favorites page | After reopening the browser, the favorite count appears correctly, but the saved favorite posts do not appear and the empty-state message is shown. The posts appear after visiting the Posts page and returning to Favorites. | Blocker | Fixed | Run a separate loading for the favorite posts, by matching the saved IDs from local storage. |
| QA-02 | Footer Layout | Laptop/Desktop → Posts API loading/error state | When the Posts section is showing an API loading/error state, the footer does not stay at the bottom and appears in the middle of the page. | Medium | Fixed | Updated the page/layout structure so the footer stays at the bottom when the content is short. |
| QA-03 | Mobile/Tablet Navigation | Tablet/Mobile → Open navigation menu | The Favorites navigation item was not properly centered when the menu was opened. | Low | Fixed | Adjusted the navigation/menu CSS to center the Favorites item correctly. |
| QA-04 | Favorite Icon Layout | Posts cards with different title lengths | The favorite/heart icon does not have stable positioning. On some cards, longer titles overlap or hide the icon. | Medium | Fixed | Added margins and other simple CSS fixes. |
| QA-05 | Create Post UI | Create Post page | The Create Post page needed additional CSS and HTML structure to match the layout and styling of the other pages. | Medium | Fixed | Matched the Contact page CSS structure; added correct success/failure messages. |
| QA-06 | Post Details navigation | Post Details "Back" button | The "Back" button always went to `/posts`, even when the user came from Favorites. | — | Fixed | Track the previous route and send the user back to Favorites when that's where they came from, otherwise `/posts`. |
| QA-07 | Create Post validation messages | Create Post form | Validation errors (empty/invalid fields) showed the same message as connection errors. | — | Fixed | Added a separate validation-error message telling the user to check the highlighted fields. |
| QA-08 | Create Post buttons | Create Post form after a failed submit | "Create Post" and "Retry" both showed after a failed submit, and Retry wasn't disabled while submitting (double-clicking risk). | — | Fixed | Merged into one button that relabels to "Retry" and stays disabled while submitting. |

**Favorites storage note:** Stayed within the requirement of not storing large
amounts of data — only favorite post IDs are saved, with a separate fetch used
to load the actual post data for the Favorites section. Time complexity should
be considered for a larger API/dataset in the future.

## Task 10 – Regression QA Results

I went through the full app on both `npm run dev` and `npm run preview` and checked everything from Tasks 07–10 against the Task 10 checklist.

| # | What I Checked | Result | Notes |
|---|------|--------|-------|
| 1 | Navigation between all routes + Not Found page |  Pass | Clicked through every route, typed a random URL and got the Not Found page. |
| 2 | Refreshing directly on a routed page |  Pass | Tried it on dev and preview, no 404s. |
| 3 | Posts loading/error/retry/empty states |  Pass | All 4 states show up correctly. |
| 4 | Post Details with a valid ID and an invalid ID |  Pass | Valid ID shows the post, invalid ID shows the "not found" message instead of crashing. |
| 5 | Search + the URL query string staying in sync | Pass | Searching updates the URL, and going back/forward keeps it synced. |
| 6 | Favorites staying synced + surviving a refresh |  Pass | Favorited a post, refreshed the page, it was still there. |
| 7 | Create Post validation + submit states | Pass | Empty/invalid fields get blocked, valid submit shows loading then success. |
| 8 | Keyboard navigation + focus | Pass | Tabbed through links, buttons and form fields, focus is visible everywhere. |
| 9 | Responsive layout on desktop/tablet/mobile | Pass | Found and fixed one issue during this pass, see below. |
| 10 | No console warnings/errors |  Pass | Found and fixed one issue during this pass, see below. |

**Bugs I found and fixed during this QA pass:**
1. `FavoritesView.vue` had `<Button>` (capital B) which isn't a real component, so it was throwing a Vue warning in the console. Changed it to a normal lowercase `<button>`.
2. On mobile/tablet, clicking "Create Post" in the menu didn't close the menu like every other link did — I forgot to add the `@click="closeMenu"` on that one link. Added it.
3. On small phone screens (480px), the search bar and the Search/Clear buttons were wrapping weirdly and looked messy. Added a CSS rule so they stack nicely instead.

**Anything still broken?** No, nothing left as far as I found.

## Frontend Handover – Task 10

**What this project is**
It's the AsfouraBandora Vue app, built up task by task (07 through 10). Check the **Features** section above for what was added in each task, and **Project Structure** for what each folder does.

**How to run it**
```
npm install
npm run dev
```
(Same as the Setup section above.)

**Environment variable**
The API URL isn't hardcoded anywhere — it comes from a `.env` file:
```
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
```
`postsApi.js` and `api.js` read this with `import.meta.env.VITE_API_BASE_URL`. `.env` itself is git-ignored (so it never gets pushed), but `.env.example` is committed so anyone cloning the repo knows what variable to set.

**Running the tests**
```
npm test
```
This runs Vitest. None of the tests actually call the real JSONPlaceholder API — everything is mocked, so the tests will pass the same way every time, even with no internet. Right now there are **18 tests in 7 files**:
- Store tests: adding/removing favorites, filtering favorite posts, saving/restoring favorites from localStorage
- Retry tests: what happens when a fetch fails, and recovering after clicking Retry
- PostCard tests: renders the post correctly, favorite heart toggles
- PostDetailsView test: the Back button goes to the right place depending on where you came from
- Create Post tests: blocks bad input with error messages, and a separate test for the actual success path with a mocked API call
- One basic smoke test just to confirm Vitest itself is set up right

**Build + preview**
```
npm run build
npm run preview
```
I checked routing, favorites, localStorage, and the API calls again on the preview build, not just on dev — that's the point of doing a production build check.

**Known limitations**
Check the **Known Limitations** section below — the main one is that JSONPlaceholder doesn't actually save new posts.

**QA results**
See the QA table right above this section — everything passes, no open issues left.

## API UI States

Used across Posts, Post Details, and Create Post:

- **Loading** — shown while a request is in progress
- **Empty** — shown when there is nothing to display
- **Error** — an error message with a Retry button
- **Retry** — sends the same request again
- **Not Found** — shown when a post ID doesn't exist

## Known Limitations

- The Create Post form uses JSONPlaceholder, which does not really save new posts
  (see the Task 09 section above).
- GitHub Pages does not support Vue Router's `createWebHistory()` refresh out of the
  box. A `404.html` redirect trick (or switching to `createWebHashHistory()`) is
  needed for the deployed version.

## ScreenShots
- Favorites view/section after selecting posts :`screenshots/favorite_posts.png`
- Create Post form validation for an invalid submission:`screenshots/fail - create post.png`
- successful POST submission/result:`screenshots/success - create post.png`

## Author
Noor Asfour