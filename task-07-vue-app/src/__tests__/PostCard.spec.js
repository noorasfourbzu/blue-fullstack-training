import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import PostCard from '../components/PostCard.vue'
import { usePostsStore } from '../stores/posts'

function mountPostCard(post,searchTerm =''){
    return mount(PostCard,{
        props:{post,searchTerm},
        global:{
            stubs: {
                RouterLink:{
                    template: '<a><slot /></a>'
                }
            }
        }
    })
}


describe('PostCrad', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        localStorage.clear()
    })

    it('renders the post title and body',() =>{
        const post = {id:1 , title: 'My First Post',body:'Some post content'}
        const warpper = mountPostCard(post)
        expect(warpper.text()).toContain('My First Post')
        expect(warpper.text()).toContain('Some post content')
    })


    it('shows the heart as not favorite by default', () =>{
        const post = {id:1 , title: 'Post', body: 'Body'}
        const wrapper = mountPostCard(post)
        const button = wrapper.find('.favorite-heart')
        expect(button.classes()).not.toContain('is-favorite')
        expect(button.attributes('aria-label')).toBe('Add to Favorite')

    })

    it('toggle the favorite state in the store when the heart button is clicked', async() => {
        const post = {id:1, title:'Post',body:'Body'}
        const wrapper = mountPostCard(post)
        const store = usePostsStore()
        expect(store.favoriteIds).not.toContain(1)
        await wrapper.find('.favorite-heart').trigger('click')
        expect(store.favoriteIds).toContain(1)// is store state is actually updated
        const button = wrapper.find('.favorite-heart')
        expect(button.classes()).toContain('is-favorite')
        expect(button.attributes('aria-label')).toBe('Remove from Favorite')
    })
})