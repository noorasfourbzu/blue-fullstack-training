<?php

namespace Tests\Feature\Blocks;

use App\Models\ContentBlock;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BlockAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_add_a_block(): void
    {
        $page = Page::factory()->create();

        $response = $this->postJson("/api/pages/{$page->id}/blocks", [
            'type' => 'text',
            'data' => ['content' => 'Hello'],
        ]);

        $response->assertStatus(401);
    }

    public function test_non_owner_cannot_add_a_block(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $page = Page::factory()->for($owner)->create();

        $response = $this->actingAs($intruder)->postJson("/api/pages/{$page->id}/blocks", [
            'type' => 'text',
            'data' => ['content' => 'Hello'],
        ]);

        $response->assertStatus(403);
    }

    /**
     * Regression test: UpdateContentBlockRequest::authorize() used to
     * be hard-coded to `false`, which made this endpoint 403 for the
     * *owner* too. This confirms the owner can actually edit a block.
     */
    public function test_owner_can_update_their_block(): void
    {
        $user = User::factory()->create();
        $page = Page::factory()->for($user)->create();
        $block = ContentBlock::factory()->for($page)->text()->create();

        $response = $this->actingAs($user)->putJson(
            "/api/pages/{$page->id}/blocks/{$block->id}",
            [
                'type' => 'text',
                'data' => ['content' => 'Updated content.'],
            ]
        );

        $response
            ->assertStatus(200)
            ->assertJsonPath('data.data.content', 'Updated content.');
    }

    public function test_non_owner_cannot_update_a_block(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $page = Page::factory()->for($owner)->create();
        $block = ContentBlock::factory()->for($page)->text()->create();

        $response = $this->actingAs($intruder)->putJson(
            "/api/pages/{$page->id}/blocks/{$block->id}",
            [
                'type' => 'text',
                'data' => ['content' => 'Hacked.'],
            ]
        );

        $response->assertStatus(403);

        $this->assertDatabaseMissing('content_blocks', [
            'id' => $block->id,
            'data' => json_encode(['content' => 'Hacked.']),
        ]);
    }

    public function test_non_owner_cannot_delete_a_block(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $page = Page::factory()->for($owner)->create();
        $block = ContentBlock::factory()->for($page)->text()->create();

        $response = $this->actingAs($intruder)->deleteJson(
            "/api/pages/{$page->id}/blocks/{$block->id}"
        );

        $response->assertStatus(403);

        $this->assertDatabaseHas('content_blocks', ['id' => $block->id]);
    }

    public function test_owner_can_delete_their_block(): void
    {
        $user = User::factory()->create();
        $page = Page::factory()->for($user)->create();
        $block = ContentBlock::factory()->for($page)->text()->create();

        $response = $this->actingAs($user)->deleteJson(
            "/api/pages/{$page->id}/blocks/{$block->id}"
        );

        $response->assertStatus(200);

        $this->assertDatabaseMissing('content_blocks', ['id' => $block->id]);
    }

    public function test_non_owner_cannot_reorder_blocks(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $page = Page::factory()->for($owner)->create();

        $first = ContentBlock::factory()->for($page)->text()->create(['position' => 0]);
        $second = ContentBlock::factory()->for($page)->text()->create(['position' => 1]);

        $response = $this->actingAs($intruder)->postJson(
            "/api/pages/{$page->id}/blocks/reorder",
            ['block_ids' => [$second->id, $first->id]]
        );

        $response->assertStatus(403);
    }
}