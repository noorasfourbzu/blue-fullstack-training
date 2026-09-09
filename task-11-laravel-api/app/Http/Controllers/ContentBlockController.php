<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContentBlockRequest;
use App\Http\Requests\UpdateContentBlockRequest;
use App\Models\ContentBlock;
use App\Models\Page;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContentBlockController extends Controller
{
    use AuthorizesRequests;

    /**
     * Add a new block to the end of a page.
     */
    public function store(StoreContentBlockRequest $request, Page $page): JsonResponse
    {
        $this->authorize('update', $page);

        $nextPosition = $page->blocks()->max('position');
        $nextPosition = $nextPosition === null ? 0 : $nextPosition + 1;

        $block = $page->blocks()->create([
            'type' => $request->validated('type'),
            'data' => $request->validated('data'),
            'position' => $nextPosition,
        ]);

        return response()->json([
            'data' => $this->formatBlock($block),
        ], 201);
    }

    /**
     * Update a block's type/content (not its position).
     */
    public function update(UpdateContentBlockRequest $request, Page $page, ContentBlock $block): JsonResponse
    {
        $this->authorize('update', $page);

        abort_if($block->page_id !== $page->id, 404);

        $block->update($request->validated());

        return response()->json([
            'data' => $this->formatBlock($block),
        ]);
    }

    /**
     * Remove a block from a page.
     */
    public function destroy(Page $page, ContentBlock $block): JsonResponse
    {
        $this->authorize('update', $page);

        abort_if($block->page_id !== $page->id, 404);

        $block->delete();

        return response()->json([
            'message' => 'Block deleted successfully.',
        ]);
    }

    /**
     * Save a full new order for a page's blocks.
     *
     * The request must supply every block belonging to the page,
     * each exactly once — this prevents a partial or duplicated
     * list from leaving blocks with clashing or stale positions.
     */
    public function reorder(Request $request, Page $page): JsonResponse
    {
        $this->authorize('update', $page);

        $data = $request->validate([
            'block_ids' => ['required', 'array'],
            'block_ids.*' => ['integer', 'distinct'],
        ]);

        $currentIds = $page->blocks()->pluck('id')->sort()->values()->all();
        $incomingIds = collect($data['block_ids'])->sort()->values()->all();

        if ($currentIds !== $incomingIds) {
            return response()->json([
                'message' => 'block_ids must contain exactly the blocks belonging to this page, each listed once.',
            ], 422);
        }

        foreach ($data['block_ids'] as $index => $blockId) {
            ContentBlock::where('id', $blockId)
                ->where('page_id', $page->id)
                ->update(['position' => $index]);
        }

        $page->load('blocks');

        return response()->json([
            'data' => $page->blocks->map(fn ($block) => $this->formatBlock($block)),
        ]);
    }

    private function formatBlock(ContentBlock $block): array
    {
        return [
            'id' => $block->id,
            'page_id' => $block->page_id,
            'type' => $block->type,
            'position' => $block->position,
            'data' => $block->data,
        ];
    }
}