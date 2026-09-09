<?php

namespace Tests\Feature\Pages;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageAuthorizationTest extends TestCase
{
    use RefreshDatabase;

public function test_user_can_view_their_own_page(): void
{
    $user = User::factory()->create();

    $page = Page::factory()
        ->for($user)
        ->create();

    $response = $this->actingAs($user)
        ->getJson("/api/pages/{$page->id}");

    $response
        ->assertStatus(200)
        ->assertJsonPath('data.id', $page->id)
        ->assertJsonPath('data.title', $page->title);
}

public function test_user_cannot_view_another_users_page(): void
{
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    $page = Page::factory()
        ->for($owner)
        ->create();

    $response = $this->actingAs($otherUser)
        ->getJson("/api/pages/{$page->id}");

    $response->assertStatus(403);
}
    public function test_user_cannot_update_another_users_page(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();

        $page = Page::factory()
            ->for($owner)
            ->create();

        $response = $this->actingAs($otherUser)
            ->putJson("/api/pages/{$page->id}", [
                'title' => 'Hacked Title',
                'slug' => 'hacked-title',
                'content' => 'Hacked content.',
                'status' => 'published',
            ]);

        $response->assertStatus(403);
    }

   public function test_user_can_delete_their_own_page(): void
{
    $user = User::factory()->create();

    $page = Page::factory()
        ->for($user)
        ->create();

    $response = $this->actingAs($user)
        ->deleteJson("/api/pages/{$page->id}");

    $response->assertStatus(200);

    $this->assertDatabaseMissing('pages', [
        'id' => $page->id,
    ]);
}


public function test_user_cannot_delete_another_users_page(): void
{
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    $page = Page::factory()
        ->for($owner)
        ->create();

    $response = $this->actingAs($otherUser)
        ->deleteJson("/api/pages/{$page->id}");

    $response->assertStatus(403);

    $this->assertDatabaseHas('pages', [
        'id' => $page->id,
    ]);
}
}