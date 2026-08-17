<script setup>
import BaseCard from "./BaseCard.vue";

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  // the applied search term ,empty string = no highlighting
  searchTerm: {
    type: String,
    default: ""
  }
});


function highlightParts(text) {
  const query = props.searchTerm.trim();
  if (!query) return [{ text, matched: false }];

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const parts = [];
  let start = 0;
  let index = lowerText.indexOf(lowerQuery, start);

  if (index === -1) return [{ text, matched: false }];

  while (index !== -1) {
    if (index > start) {
      parts.push({ text: text.slice(start, index), matched: false });
    }
    parts.push({ text: text.slice(index, index + query.length), matched: true });
    start = index + query.length;
    index = lowerText.indexOf(lowerQuery, start);
  }

  if (start < text.length) {
    parts.push({ text: text.slice(start), matched: false });
  }

  return parts;
}
</script>

<template>
  <BaseCard variant="post-card">
    <h3>
      <template v-for="(part, i) in highlightParts(post.title)" :key="i">
        <mark v-if="part.matched" class="search-highlight">{{ part.text }}</mark>
        <template v-else>{{ part.text }}</template>
      </template>
    </h3>
    <p>
      <template v-for="(part, i) in highlightParts(post.body)" :key="i">
        <mark v-if="part.matched" class="search-highlight">{{ part.text }}</mark>
        <template v-else>{{ part.text }}</template>
      </template>
    </p>

<RouterLink :to="`/posts/${post.id}`" class="read-more-link">      Read More
      </RouterLink>
  </BaseCard>
</template>