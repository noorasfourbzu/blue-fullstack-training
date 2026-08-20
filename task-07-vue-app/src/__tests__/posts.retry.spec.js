import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePostsStore } from '../stores/posts'
import { getPosts as getPostsMock } from '../services/postsApi'


// mock the service layer so no real network request happens,
// and so we can control exactly when the "API" fails vs succeeds
vi.mock('../services/postsApi', () => ({
  getPosts: vi.fn(),
  createPost: vi.fn(),
}))


describe ('posts store - fetch error and retry', () =>{

     beforeEach(() => {
    setActivePinia(createPinia())
    getPostsMock.mockReset()
  })


  it('sets an error state and keeps posts empty when the fetch fails', async () => {
    getPostsMock.mockRejectedValueOnce(new Error('Network down'))

    const store = usePostsStore()
    await store.fetchPosts()

    expect(store.error).toBe(true)
    expect(store.loading).toBe(false)
    expect(store.posts).toEqual([])
  })






  it('recovers from an error state when retryFetch succeeds', async () => {
    const store = usePostsStore()

    // first attempt fails
    getPostsMock.mockRejectedValueOnce(new Error('Network down'))
    await store.fetchPosts()
    expect(store.error).toBe(true)


    // when user click Retry the API this time responds successfully 
    getPostsMock.mockResolvedValueOnce([
      { id: 1, title: 'Post 1', body: 'Body 1' },
    ])
    await store.retryFetch()

    expect(store.error).toBe(false)
    expect(store.loading).toBe(false)
    expect(store.posts).toEqual([{ id: 1, title: 'Post 1', body: 'Body 1' }])
  })

})


