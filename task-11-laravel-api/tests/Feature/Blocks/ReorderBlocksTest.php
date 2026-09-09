<?php

namespace Tests\Feature\Blocks;

use App\Models\ContentBlock;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReorderBlocksTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_reorder_blocks(): void
    {
        $user = User::factory()->create();
        $page = Page::factory()->for($user)->create();

        $first = ContentBlock::factory()->for($page)->hero()->create(['position' => 0]);
        $second = ContentBlock::factory()->for($page)->text()->create(['position' => 1]);
        $third = ContentBlock::factory()->for($page)->cta()->create(['position' => 2]);

        $response = $this->actingAs($user)->postJson(
            "/api/pages/{$page->id}/blocks/reorder",
            ['block_ids' => [$third->id, $first->id, $second->id]]
        );

        $response->assertStatus(200);

        $orderedIds = $page->blocks()->pluck('id')->all();

        $this->assertSame([$third->id, $first->id, $second->id], $orderedIds);
    }

    public function test_reorder_rejects_a_list_missing_a_block(): void
    {
        $user = User::factory()->create();
        $page = Page::factory()->for($user)->create();

        $first = ContentBlock::factory()->for($page)->text()->create(['position' => 0]);
        ContentBlock::factory()->for($page)->text()->create(['position' => 1]);

        $response = $this->actingAs($user)->postJson(
            "/api/pages/{$page->id}/blocks/reorder",
            ['block_ids' => [$first->id]]
        );

        $response->assertStatus(422);
    }

    public function test_reorder_rejects_duplicate_ids(): void
    {
        $user = User::factory()->create();
        $page = Page::factory()->for($user)->create();

        $first = ContentBlock::factory()->for($page)->text()->create(['position' => 0]);
        $second = ContentBlock::factory()->for($page)->text()->create(['position' => 1]);

        $response = $this->actingAs($user)->postJson(
            "/api/pages/{$page->id}/blocks/reorder",
            ['block_ids' => [$first->id, $first->id]]
        );

        $response->assertStatus(422);
    }

    public function test_reorder_rejects_a_block_id_from_another_page(): void
    {
        $user = User::factory()->create();
        $page = Page::factory()->for($user)->create();
        $otherPage = Page::factory()->for($user)->create();

        $ownBlock = ContentBlock::factory()->for($page)->text()->create(['position' => 0]);
        $foreignBlock = ContentBlock::factory()->for($otherPage)->text()->create(['position' => 0]);

        $response = $this->actingAs($user)->postJson(
            "/api/pages/{$page->id}/blocks/reorder",
            ['block_ids' => [$foreignBlock->id]]
        );

        $response->assertStatus(422);

        $this->assertSame(0, $foreignBlock->fresh()->position);
        $this->assertSame(0, $ownBlock->fresh()->position);
    }
}