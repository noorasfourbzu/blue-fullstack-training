<?php

namespace Tests\Feature\Pages;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdatePageTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_their_page(): void
    {
        $user = User::factory()->create();

        $page = Page::factory()
            ->for($user)
            ->create();

        $response = $this->actingAs($user)
            ->putJson("/api/pages/{$page->id}", [
                'title' => 'Updated Title',
                'slug' => 'updated-title',
                'content' => 'Updated content.',
                'status' => 'published',
            ]);

        $response
            ->assertStatus(200)
            ->assertJsonPath('data.title', 'Updated Title');

        $this->assertDatabaseHas('pages', [
            'id' => $page->id,
            'title' => 'Updated Title',
            'slug' => 'updated-title',
        ]);
    }
}