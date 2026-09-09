<script setup>
import { reactive, ref, computed, watch } from "vue";
import { useBlocksStore } from "../stores/blocks.js";

const props = defineProps({
  pageId: { type: [String, Number], required: true },
  initialBlocks: { type: Array, default: () => [] },
});

const blocksStore = useBlocksStore();

watch(
  () => props.initialBlocks,
  (value) => blocksStore.setBlocks(value),
  { immediate: true }
);

const BLOCK_TYPES = [
  { value: "hero", label: "Hero" },
  { value: "text", label: "Text" },
  { value: "cta", label: "Call to Action" },
];

const BLOCK_FIELDS = {
  hero: [
    { key: "heading", label: "Heading", required: true },
    { key: "subtitle", label: "Subtitle", required: false },
  ],
  text: [
    { key: "content", label: "Content", required: true, textarea: true },
  ],
  cta: [
    { key: "heading", label: "Heading", required: false },
    { key: "button_label", label: "Button Label", required: true },
    { key: "button_url", label: "Button URL", required: true },
  ],
};

function blankData(type) {
  const fields = BLOCK_FIELDS[type] || [];
  return Object.fromEntries(fields.map((f) => [f.key, ""]));
}

function typeLabel(type) {
  return BLOCK_TYPES.find((t) => t.value === type)?.label || type;
}

function previewText(block) {
  const fields = BLOCK_FIELDS[block.type] || [];
  const first = fields[0]?.key;
  return first ? block.data?.[first] || "" : "";
}

// --- Add block ---
const addForm = reactive({ type: "text", data: blankData("text") });
watch(() => addForm.type, (type) => { addForm.data = blankData(type); });

async function submitAdd() {
  try {
    await blocksStore.addBlock(props.pageId, {
      type: addForm.type,
      data: { ...addForm.data },
    });
    addForm.type = "text";
    addForm.data = blankData("text");
  } catch {
    // submitError is already set in the store; the banner below reacts to it.
  }
}

// --- Edit block ---
const editingBlockId = ref(null);
const editForm = reactive({ type: "", data: {} });

function startEdit(block) {
  editingBlockId.value = block.id;
  editForm.type = block.type;
  editForm.data = { ...blankData(block.type), ...block.data };
}

function cancelEdit() {
  editingBlockId.value = null;
}

async function submitEdit() {
  try {
    await blocksStore.editBlock(props.pageId, editingBlockId.value, {
      type: editForm.type,
      data: { ...editForm.data },
    });
    editingBlockId.value = null;
  } catch {
    // updateError is already set in the store; shown inline below.
  }
}

// --- Delete / reorder ---
async function handleDelete(block) {
  if (!confirm(`Delete this ${typeLabel(block.type)} block?`)) return;
  await blocksStore.removeBlock(props.pageId, block.id).catch(() => {});
}

function moveUp(block) {
  blocksStore.moveBlock(props.pageId, block.id, "up");
}

function moveDown(block) {
  blocksStore.moveBlock(props.pageId, block.id, "down");
}

const hasBlocks = computed(() => blocksStore.blocks.length > 0);
</script>

<template>
  <section id="page-blocks-manager" class="section">
    <h3 class="section-title">Content Blocks</h3>

    <p v-if="!hasBlocks" class="posts-status posts-status--empty">
      No blocks yet. Add one below to build this page.
    </p>

    <ul v-else class="blocks-list">
      <li v-for="(block, index) in blocksStore.blocks" :key="block.id" class="blocks-list__item">
        <template v-if="editingBlockId === block.id">
          <form @submit.prevent="submitEdit">
            <label :for="`edit-block-type-${block.id}`">Type</label>
            <select :id="`edit-block-type-${block.id}`" v-model="editForm.type" class="form-control" disabled>
              <option v-for="t in BLOCK_TYPES" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
            <small class="character-counter">Block type can't be changed after creation — delete and re-add instead.</small>

            <div v-for="field in BLOCK_FIELDS[editForm.type]" :key="field.key">
              <label :for="`edit-block-${block.id}-${field.key}`">{{ field.label }}</label>
              <textarea
                v-if="field.textarea"
                :id="`edit-block-${block.id}-${field.key}`"
                v-model="editForm.data[field.key]"
                class="form-control"
                rows="4"
              ></textarea>
              <input
                v-else
                :id="`edit-block-${block.id}-${field.key}`"
                v-model="editForm.data[field.key]"
                type="text"
                class="form-control"
              />
              <small
                v-if="blocksStore.updateError && blocksStore.updateError[`data.${field.key}`]"
                class="error-message"
              >
                {{ blocksStore.updateError[`data.${field.key}`][0] }}
              </small>
            </div>

            <button type="submit" class="button" :disabled="blocksStore.updatingId === block.id">
              {{ blocksStore.updatingId === block.id ? "Saving..." : "Save Block" }}
            </button>
            <button type="button" class="button" @click="cancelEdit">Cancel</button>
          </form>
        </template>

        <template v-else>
          <span class="blocks-list__type">{{ typeLabel(block.type) }}</span>
          <span class="blocks-list__preview">{{ previewText(block) }}</span>

          <div class="blocks-list__actions">
            <button type="button" :disabled="index === 0" @click="moveUp(block)">↑</button>
            <button type="button" :disabled="index === blocksStore.blocks.length - 1" @click="moveDown(block)">↓</button>
            <button type="button" @click="startEdit(block)">Edit</button>
            <button
              type="button"
              :disabled="blocksStore.deletingId === block.id"
              @click="handleDelete(block)"
            >
              {{ blocksStore.deletingId === block.id ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </template>
      </li>
    </ul>

    <p v-if="blocksStore.reorderError" class="error-message">
      Couldn't save the new order. Please try again.
    </p>
    <p v-if="blocksStore.deleteError" class="error-message">
      Couldn't delete that block. Please try again.
    </p>

    <h4>Add a Block</h4>
    <form @submit.prevent="submitAdd">
      <label for="add-block-type">Type</label>
      <select id="add-block-type" v-model="addForm.type" class="form-control">
        <option v-for="t in BLOCK_TYPES" :key="t.value" :value="t.value">{{ t.label }}</option>
      </select>

      <div v-for="field in BLOCK_FIELDS[addForm.type]" :key="field.key">
        <label :for="`add-block-${field.key}`">{{ field.label }}</label>
        <textarea
          v-if="field.textarea"
          :id="`add-block-${field.key}`"
          v-model="addForm.data[field.key]"
          class="form-control"
          rows="4"
        ></textarea>
        <input
          v-else
          :id="`add-block-${field.key}`"
          v-model="addForm.data[field.key]"
          type="text"
          class="form-control"
        />
        <small
          v-if="blocksStore.submitError && blocksStore.submitError[`data.${field.key}`]"
          class="error-message"
        >
          {{ blocksStore.submitError[`data.${field.key}`][0] }}
        </small>
      </div>

      <button type="submit" class="button" :disabled="blocksStore.submitting">
        {{ blocksStore.submitting ? "Adding..." : "Add Block" }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.blocks-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}
.blocks-list__item {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.blocks-list__type {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: #555;
}
.blocks-list__preview {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.blocks-list__actions {
  display: flex;
  gap: 0.5rem;
}
</style>