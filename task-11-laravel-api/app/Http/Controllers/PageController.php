<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePageRequest;
use App\Http\Requests\UpdatePageRequest;
use App\Http\Resources\PageResource;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageController extends Controller
{
    /**
     * Display a listing of the authenticated user's pages.
     */
    public function index(Request $request)
    {
        $pages = Page::with('user')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return PageResource::collection($pages);
    }

    /**
     * Store a newly created page.
     */
    public function store(StorePageRequest $request): PageResource
    {
        $page = Page::create([
            'title' => $request->title,
            'slug' => $request->slug,
            'content' => $request->content,
            'status' => $request->status,
            'user_id' => $request->user()->id,
        ]);

        $page->load('user');

        return new PageResource($page);
    }

    /**
     * Display the specified page for management.
     */
    public function show(Page $page): PageResource
    {
        $this->authorize('view', $page);

        $page->load('user');

        return new PageResource($page);
    }

    /**
     * Update the specified page.
     */
    public function update(
        UpdatePageRequest $request,
        Page $page
    ): PageResource {
        $this->authorize('update', $page);

        $page->update([
            'title' => $request->title,
            'slug' => $request->slug,
            'content' => $request->content,
            'status' => $request->status,
        ]);

        $page->load('user');

        return new PageResource($page);
    }

    /**
     * Remove the specified page.
     */
    public function destroy(Page $page): JsonResponse
    {
        $this->authorize('delete', $page);

        $page->delete();

        return response()->json([
            'message' => 'Page deleted successfully.',
        ]);
    }
}