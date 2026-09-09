import { defineStore } from "pinia";
import { ref } from "vue";

import {
  createBlock as createBlockRequest,
  updateBlock as updateBlockRequest,
  deleteBlock as deleteBlockRequest,
  reorderBlocks as reorderBlocksRequest,
} from "../services/apiClient";

export const useBlocksStore = defineStore("blocks", () => {
  const blocks = ref([]);

  const submitting = ref(false);
  const submitError = ref(null);

  const updatingId = ref(null);
  const updateError = ref(null);

  const deletingId = ref(null);
  const deleteError = ref(false);

  const reordering = ref(false);
  const reorderError = ref(false);

  // Called after the page (with its blocks) loads, to seed local state.
  function setBlocks(pageBlocks) {
    blocks.value = [...(pageBlocks || [])].sort((a, b) => a.position - b.position);
  }

  async function addBlock(pageId, { type, data }) {
    submitting.value = true;
    submitError.value = null;

    try {
      const response = await createBlockRequest(pageId, { type, data });
      blocks.value.push(response.data);
      return response.data;
    } catch (err) {
      submitError.value = err.errors || true;
      throw err;
    } finally {
      submitting.value = false;
    }
  }

  async function editBlock(pageId, blockId, { type, data }) {
    updatingId.value = blockId;
    updateError.value = null;

    try {
      const response = await updateBlockRequest(pageId, blockId, { type, data });
      const index = blocks.value.findIndex((b) => b.id === blockId);
      if (index !== -1) blocks.value[index] = response.data;
      return response.data;
    } catch (err) {
      updateError.value = err.errors || true;
      throw err;
    } finally {
      updatingId.value = null;
    }
  }

  async function removeBlock(pageId, blockId) {
    deletingId.value = blockId;
    deleteError.value = false;

    try {
      await deleteBlockRequest(pageId, blockId);
      blocks.value = blocks.value.filter((b) => b.id !== blockId);
    } catch (err) {
      deleteError.value = true;
      throw err;
    } finally {
      deletingId.value = null;
    }
  }

  // direction: "up" | "down"
  async function moveBlock(pageId, blockId, direction) {
    const index = blocks.value.findIndex((b) => b.id === blockId);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.value.length) return;

    const reordered = [...blocks.value];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    reordering.value = true;
    reorderError.value = false;

    try {
      const response = await reorderBlocksRequest(pageId, reordered.map((b) => b.id));
      blocks.value = response.data;
    } catch (err) {
      reorderError.value = true;
      throw err;
    } finally {
      reordering.value = false;
    }
  }

  return {
    blocks,
    submitting, submitError,
    updatingId, updateError,
    deletingId, deleteError,
    reordering, reorderError,
    setBlocks, addBlock, editBlock, removeBlock, moveBlock,
  };
});