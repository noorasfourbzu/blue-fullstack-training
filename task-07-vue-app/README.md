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