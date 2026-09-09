<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePageRequest;
use App\Http\Requests\UpdatePageRequest;
use App\Http\Resources\PageResource;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
class PageController extends Controller
{    use AuthorizesRequests;
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


    public function publicShow(string $slug):PageResource{
         $page = Page::with(['user', 'blocks'])
        ->where('slug', $slug)
        ->where('status', 'published')
        ->firstOrFail();

    return new PageResource($page);
    }
    /**
     * Store a newly created page.
     */
    public function store(StorePageRequest $request): PageResource
    {
        $page = new Page($request->validated());

        // Assign ownership to the authenticated user.
        $page->user_id = $request->user()->id;

        $page->save();

        $page->load('user');

        return new PageResource($page);
    }

   
    /**
     * Display the specified page.
     */
    public function show(Page $page): PageResource
    {
        $this->authorize('view', $page);

        $page->load(['user', 'blocks']);

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

        $page->update($request->validated());

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