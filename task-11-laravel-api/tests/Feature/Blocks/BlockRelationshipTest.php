<?php

namespace Tests\Feature\Blocks;

use App\Models\ContentBlock;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BlockRelationshipTest extends TestCase
{
    use RefreshDatabase;

    public function test_page_returns_blocks_in_position_order(): void
    {
        $page = Page::factory()->create();

        $third = ContentBlock::factory()->for($page)->text()->create(['position' => 2]);
        $first = ContentBlock::factory()->for($page)->hero()->create(['position' => 0]);
        $second = ContentBlock::factory()->for($page)->cta()->create(['position' => 1]);

        $orderedIds = $page->blocks()->pluck('id')->all();

        $this->assertSame(
            [$first->id, $second->id, $third->id],
            $orderedIds
        );
    }

    public function test_deleting_a_page_deletes_its_blocks(): void
    {
        $page = Page::factory()->create();

        $block = ContentBlock::factory()->for($page)->text()->create();

        $page->delete();

        $this->assertDatabaseMissing('content_blocks', [
            'id' => $block->id,
        ]);
    }

    public function test_public_page_endpoint_includes_ordered_blocks(): void
    {
        $page = Page::factory()->create(['status' => 'published']);

        ContentBlock::factory()->for($page)->cta()->create(['position' => 1]);
        ContentBlock::factory()->for($page)->hero()->create(['position' => 0]);

        $response = $this->getJson("/api/pages/{$page->slug}");

        $response->assertStatus(200);

        $types = collect($response->json('data.blocks'))->pluck('type')->all();

        $this->assertSame(['hero', 'cta'], $types);
    }

    public function test_user_scoped_page_endpoint_includes_blocks(): void
    {
        $user = User::factory()->create();
        $page = Page::factory()->for($user)->create();

        ContentBlock::factory()->for($page)->text()->create();

        $response = $this->actingAs($user)->getJson("/api/pages/{$page->id}");

        $response
            ->assertStatus(200)
            ->assertJsonCount(1, 'data.blocks');
    }
}