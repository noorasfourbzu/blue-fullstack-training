<?php

namespace Tests\Feature\Blocks;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateBlockTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_add_a_hero_block(): void
    {
        $user = User::factory()->create();
        $page = Page::factory()->for($user)->create();

        $response = $this->actingAs($user)->postJson("/api/pages/{$page->id}/blocks", [
            'type' => 'hero',
            'data' => [
                'heading' => 'Welcome',
                'subtitle' => 'We build things.',
            ],
        ]);

        $response
            ->assertStatus(201)
            ->assertJsonPath('data.type', 'hero')
            ->assertJsonPath('data.data.heading', 'Welcome');

        $this->assertDatabaseHas('content_blocks', [
            'page_id' => $page->id,
            'type' => 'hero',
        ]);
    }

    public function test_owner_can_add_a_text_block(): void
    {
        $user = User::factory()->create();
        $page = Page::factory()->for($user)->create();

        $response = $this->actingAs($user)->postJson("/api/pages/{$page->id}/blocks", [
            'type' => 'text',
            'data' => ['content' => 'Some paragraph content.'],
        ]);

        $response->assertStatus(201)->assertJsonPath('data.type', 'text');
    }

    public function test_owner_can_add_a_cta_block(): void
    {
        $user = User::factory()->create();
        $page = Page::factory()->for($user)->create();

        $response = $this->actingAs($user)->postJson("/api/pages/{$page->id}/blocks", [
            'type' => 'cta',
            'data' => [
                'button_label' => 'Contact us',
                'button_url' => 'https://example.com/contact',
            ],
        ]);

        $response->assertStatus(201)->assertJsonPath('data.type', 'cta');
    }

    public function test_unsupported_block_type_is_rejected(): void
    {
        $user = User::factory()->create();
        $page = Page::factory()->for($user)->create();

        $response = $this->actingAs($user)->postJson("/api/pages/{$page->id}/blocks", [
            'type' => 'gallery',
            'data' => ['images' => []],
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('type');
    }

    public function test_cta_block_without_a_url_is_rejected(): void
    {
        $user = User::factory()->create();
        $page = Page::factory()->for($user)->create();

        $response = $this->actingAs($user)->postJson("/api/pages/{$page->id}/blocks", [
            'type' => 'cta',
            'data' => ['button_label' => 'Contact us'],
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('data.button_url');
    }

    public function test_new_block_is_appended_after_existing_blocks(): void
    {
        $user = User::factory()->create();
        $page = Page::factory()->for($user)->create();

        $this->actingAs($user)->postJson("/api/pages/{$page->id}/blocks", [
            'type' => 'text',
            'data' => ['content' => 'First block.'],
        ]);

        $response = $this->actingAs($user)->postJson("/api/pages/{$page->id}/blocks", [
            'type' => 'text',
            'data' => ['content' => 'Second block.'],
        ]);

        $response->assertJsonPath('data.position', 1);
    }
}