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
  <section id="page-blocks-manager" class="section page-blocks-manager">
    <div class="page-blocks-manager__header">
      <div>
        <br>
        <h3 class="section-title">Content Blocks</h3>
        <p class="page-blocks-manager__intro">
          Build the page from reusable sections and control the order they appear in.
        </p>
      </div>
      <span class="page-blocks-manager__count">
        {{ blocksStore.blocks.length }} block{{ blocksStore.blocks.length === 1 ? "" : "s" }}
      </span>
    </div>

    <p v-if="!hasBlocks" class="page-feedback page-feedback--empty">
      No blocks yet. Add one below to build this page.
    </p>

    <ul v-else class="blocks-list" aria-label="Page content blocks">
      <li v-for="(block, index) in blocksStore.blocks" :key="block.id" class="blocks-list__item">
        <template v-if="editingBlockId === block.id">
          <form class="block-form" @submit.prevent="submitEdit">
            <div class="block-form__heading">
              <div>
                <p class="page-eyebrow">Editing block {{ index + 1 }}</p>
                <h4>{{ typeLabel(block.type) }} block</h4>
              </div>
              <span class="block-position">Position {{ index + 1 }}</span>
            </div>

            <div class="block-form__fields">
              <div class="block-form__field">
                <label :for="`edit-block-type-${block.id}`">Type</label>
                <select :id="`edit-block-type-${block.id}`" v-model="editForm.type" class="form-control" disabled>
                  <option v-for="t in BLOCK_TYPES" :key="t.value" :value="t.value">{{ t.label }}</option>
                </select>
                <small class="character-counter">Block type can't be changed after creation — delete and re-add instead.</small>
              </div>

              <div v-for="field in BLOCK_FIELDS[editForm.type]" :key="field.key" class="block-form__field">
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
            </div>

            <p v-if="blocksStore.updateError === true" class="page-feedback page-feedback--error">
              Couldn't save this block. Please try again.
            </p>

            <div class="block-form__actions">
              <button type="submit" class="button page-ui-button" :disabled="blocksStore.updatingId === block.id">
                {{ blocksStore.updatingId === block.id ? "Saving..." : "Save Block" }}
              </button>
              <button type="button" class="button page-ui-button page-ui-button--secondary" @click="cancelEdit">Cancel</button>
            </div>
          </form>
        </template>

        <template v-else>
          <div class="blocks-list__content">
            <div class="blocks-list__header">
              <span class="blocks-list__type">{{ typeLabel(block.type) }}</span>
              <span class="block-position">Position {{ index + 1 }}</span>
            </div>
            <p class="blocks-list__preview">{{ previewText(block) || "No content yet" }}</p>
          </div>

          <div class="blocks-list__actions">
            <button
              type="button"
              class="page-ui-button page-ui-button--icon"
              :disabled="index === 0 || blocksStore.reordering"
              aria-label="Move block up"
              @click="moveUp(block)"
            >↑</button>
            <button
              type="button"
              class="page-ui-button page-ui-button--icon"
              :disabled="index === blocksStore.blocks.length - 1 || blocksStore.reordering"
              aria-label="Move block down"
              @click="moveDown(block)"
            >↓</button>
            <button type="button" class="page-ui-button page-ui-button--secondary" @click="startEdit(block)">Edit</button>
            <button
              type="button"
              class="page-ui-button page-ui-button--danger"
              :disabled="blocksStore.deletingId === block.id"
              @click="handleDelete(block)"
            >
              {{ blocksStore.deletingId === block.id ? "Deleting..." : "Delete" }}
            </button>
          </div>
        </template>
      </li>
    </ul>

    <p v-if="blocksStore.reorderError" class="page-feedback page-feedback--error">
      Couldn't save the new order. Please try again.
    </p>
    <p v-if="blocksStore.deleteError" class="page-feedback page-feedback--error">
      Couldn't delete that block. Please try again.
    </p>

    <form class="block-form block-form--add" @submit.prevent="submitAdd">
      <div class="block-form__heading">
        <div>
          <h4>Add a Block</h4>
        </div>
      </div>

      <div class="block-form__fields">
        <div class="block-form__field">
          <label for="add-block-type">Type</label>
          <select id="add-block-type" v-model="addForm.type" class="form-control">
            <option v-for="t in BLOCK_TYPES" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>

        <div v-for="field in BLOCK_FIELDS[addForm.type]" :key="field.key" class="block-form__field">
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
      </div>

      <p v-if="blocksStore.submitError === true" class="page-feedback page-feedback--error">
        Couldn't add this block. Please check your connection and try again.
      </p>

      <div class="block-form__actions">
        <button type="submit" class="button page-ui-button" :disabled="blocksStore.submitting">
          {{ blocksStore.submitting ? "Adding..." : "Add Block" }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.page-blocks-manager {
  max-width: 700px;
  margin: 0 auto;
  padding: 0;
}

.page-blocks-manager__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.page-blocks-manager .section-title {
  margin-bottom: 8px;
  text-align: left;
}

.page-eyebrow {
  margin-bottom: 6px;
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.page-blocks-manager__intro {
  color: var(--color-muted-text);
  font-size: 0.95rem;
}

.page-blocks-manager__count,
.block-position {
  flex-shrink: 0;
  color: var(--color-muted-text);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.page-blocks-manager__count {
  padding: 6px 10px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background-color: var(--color-surface);
}

.blocks-list {
  list-style: none;
  display: grid;
  gap: 14px;
  padding: 0;
  margin: 0 0 28px;
}

.blocks-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-width: 0;
  padding: 18px;
  border: 1px solid #ddd;
  border-color: var(--color-border);
  border-radius: 10px;
  background-color: var(--color-surface);
  box-shadow: 0 2px 8px rgba(37, 37, 37, 0.05);
}

.blocks-list__content {
  min-width: 0;
}

.blocks-list__header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-bottom: 8px;
}

.blocks-list__type {
  display: inline-flex;
  padding: 4px 9px;
  border-radius: 999px;
  color: var(--color-text);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.blocks-list__preview {
  margin: 0;
  color: var(--color-muted-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.blocks-list__actions {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.block-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 22px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background-color: var(--color-background);
}

.block-form--add {
  margin-top: 12px;
}

.block-form__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.block-form__heading h4 {
  color: var(--color-text);
  font-size: 1.2rem;
}

.block-form__fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.block-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.block-form__field label {
  color: var(--color-text);
  font-weight: 700;
}

.block-form__field .character-counter,
.block-form__field .error-message {
  margin-top: 0;
}

.block-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.page-feedback {
  margin: 0;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-left-width: 4px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
}

.page-feedback--empty {
  margin-bottom: 28px;
  color: var(--color-muted-text);
  background-color: var(--color-surface);
}

.page-feedback--error {
  border-color: #f5c2c0;
  border-left-color: #c62828;
  color: #c62828;
  background-color: #fdecea;
}

@media (max-width: 600px) {
  .page-blocks-manager__header,
  .blocks-list__item {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-blocks-manager__count {
    align-self: flex-start;
  }

  .blocks-list__preview {
    white-space: normal;
  }

  .blocks-list__actions,
  .block-form__actions {
    width: 100%;
  }

  .blocks-list__actions .page-ui-button {
    flex: 1 1 auto;
  }
}

@media (max-width: 480px) {
  .block-form {
    padding: 16px;
  }

  .block-form__actions {
    flex-direction: column;
  }

  .block-form__actions .page-ui-button {
    width: 100%;
  }

  .blocks-list__actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .blocks-list__actions .page-ui-button {
    width: 100%;
  }
}
</style>