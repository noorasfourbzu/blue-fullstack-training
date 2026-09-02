<script setup>
// reusable filter control: the parent owns the actual selection state
// this component only displays the options its given and reports clicks

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  selected: {
    type: [String, Number],
    required: true
  }
});



const emit = defineEmits(["filter-change"]);

function getCategoryId(category) {

if(typeof category === "string"){
  return category.id; 
}


}

function getCategoryName(category) {
  if (typeof category === "string") {
    return category;
  }

  return category.name;
}

function selectCategory(category){
  
  emit("filter-change", getCategoryId(category));
}



</script>

<template>
  <div class="category-buttons-container">
    <button
      v-for="category in categories"
      :key="getCategoryId(category)"
      type="button"
      class="category-capsule"
      :class="{ 'is-active': getCategoryId(category) === selected }"
      :aria-pressed="getCategoryId(category) === selected"
      @click="selectCategory(category)"
    >      
      {{ getCategoryName(category) }} 
    </button>
  </div>
</template>
