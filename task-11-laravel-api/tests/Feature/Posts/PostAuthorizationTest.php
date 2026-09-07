<?php

namespace Tests\Feature\Posts;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Feature\Support\CreateTestData;
use Tests\TestCase;

class PostAuthorizationTest extends TestCase
{
    use RefreshDatabase;
    use CreateTestData;

    public function test_a_user_cannot_update_another_users_post(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $post = $this->createPost($owner);

        Sanctum::actingAs($otherUser);

        $response = $this->putJson("/api/posts/{$post->id}", [
            'title' => 'Hijacked title',
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'title' => $post->title, // unchanged
        ]);
    }

    public function test_a_user_cannot_delete_another_users_post(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $post = $this->createPost($owner);

        Sanctum::actingAs($otherUser);

        $response = $this->deleteJson("/api/posts/{$post->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }
}