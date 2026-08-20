
import { createPinia, setActivePinia } from 'pinia'
import {describe, it , expect, beforeEach} from'vitest'
import {usePostsStore} from '../stores/posts'
// Part 1  ----   Pinia store: verify that adding/removing a favorite updates shared state correctly
describe('posts store - favorites', () => {

    beforeEach(() => {
        // fresh pinia instance for every test so state never leaks between test
        setActivePinia(createPinia())
        localStorage.clear()
    })

    it('adds a post is to favoriteesIds when toggled on', () =>{
        const store  = usePostsStore()
        expect(store.favoriteIds).toEqual([])
        store.toggleFavorite(1)
        expect(store.favoriteIds).toContain(1)
        expect(store.favoriteCount).toBe(1)
    })

    it('removes a post id from favoriteIds when toggeled once again', () =>{
    const store = usePostsStore()
    store.toggleFavorite(1)
    expect(store.favoriteIds).toContain(1)
    store.toggleFavorite(1)
    expect(store.favoriteIds).not.toContain(1)
    expect(store.favoriteCount).toBe(0)
    })

    it('favoritePosts only returns posts whose id is in favoriteIds', () =>{
        const store = usePostsStore()
        store.posts = [
            {id: 1 , title: 'Post 1'},
            {id: 2 , title: 'Post 2'},
        ]
        store.toggleFavorite(2)
        expect(store.favoritePosts).toEqual([{id: 2,title: 'Post 2'}])
    })
})

describe ('posts store - favorite persistence',() =>{
    beforeEach(() =>{
        setActivePinia(createPinia())
        localStorage.clear()
    })

    it('restores favoriteIds from localStorage when saved data exists', 
    () =>{
        // simulate prevoius visit that already saved favorites
        localStorage.setItem('favoriteIds',JSON.stringify([3,7]))
        const store = usePostsStore()

        expect(store.favoriteIds).toEqual([])
        store.restoreFavorites()
        expect(store.favoriteIds).toEqual([3,7])
    }
    )

    it('leaves favoriteIds empty when local storage has no saved data', () => {
        const store = usePostsStore()
        store.restoreFavorites()
        expect(store.favoriteIds).toEqual([])
    })

    it('writes the current favoriteIds to local storage when a favorite is toggled',() => {
        const store = usePostsStore()
        store.toggleFavorite(5)
        const saved = JSON.parse(localStorage.getItem('favoriteIds'))
        expect(saved).toEqual([5])
    })
})