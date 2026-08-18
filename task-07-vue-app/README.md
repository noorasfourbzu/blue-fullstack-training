## Task 09 - Pinia, Forms & API Mutations

### State architecture
- `src/stores/posts.js` (Pinia, Composition API style) is the single source of truth for the posts list, loading/error flags, and favorite post IDs.
- `src/services/postsApi.js` holds the pure `getPosts()` request function. It contains no reactive state — the store calls it and manages loading/error/result itself.
- `src/composables/usePosts.js` was removed: its responsibility (fetching + holding the posts list) is now fully owned by the store, so keeping both would have created two disconnected copies of the same state.
- `src/composables/usePost.js` (singular) was kept as-is. It fetches a single post by ID for `PostDetailsView`, which is local, per-route data, not state shared across the app — so it does not belong in Pinia.
- `PostsView.vue` now consumes `usePostsStore()` instead of `usePosts()`.