<script setup>
import {ref ,computed,onMounted} from "vue";
import PostCard from "./PostCard.vue";
const API_URL = "https://jsonplaceholder.typicode.com/posts";
const posts = ref([]);
const searchWord = ref("");
const loading = ref(false);
const error  = ref(false);

async function fetchPosts(){
    loading.value = true;
    error.value = false;

    try{
        const response = await fetch(API_URL);
        if(!response.ok)
        throw new Error("Failed to fetch Posts");
    posts.value = await response.json();
    }
    catch(err){
        error.value= true;
    }
    finally{
        loading.value= false; 
    }
}

const filteredPosts = computed(()=>{
    const query = searchWord.value.trim().toLowerCase();
     if (!query) return posts.value;

     return posts.value.filter((post) => 
     post.title.toLowerCase().includes(query)
     || post.body.toLowerCase().includes(query)

    );
});

function clearSearch(){
    searchWord.value = "";
}
onMounted(fetchPosts);
</script>
<template>
<section id="latest-posts"  class = "section">
<div class = "container">
    <h2   class = "section-title"> Latest Posts</h2>
    <div class="latest-posts-search-container">
        <textarea
        v-model="searchWord"
        name="search-word"
        rows = "1"
        placeholder = "Search Posts...."
        maxlength="200"
        ></textarea>

        <button 
        type = "button"
        @click="searchWord = searchWord.trim()">
        Search </button>

        <button
        type = "button"
        @click="clearSearch"
        >
        Clear 
        </button>
        </div>
        <p
        v-if="loading"
        class = "posts-status">
        Loading posts...
        </p>
        <div
        v-else-if = "error"
        class = "posts-status">
        <p>Failed to load posts</p>
        <button
        type = "button"
        @click="fetchPosts">
        Retry
        </button>
        </div>



        <template v-else>
            <p
            class = "results-count"
            aria-live = "polite">
            {{ filteredPosts.length }} results
            </p>
            <div class="latest-posts-container">

          <PostCard
            v-for="post in filteredPosts"
            :key="post.id"
            :post="post"
          />

        </div>

      </template>

    </div>

  </section>
</template>