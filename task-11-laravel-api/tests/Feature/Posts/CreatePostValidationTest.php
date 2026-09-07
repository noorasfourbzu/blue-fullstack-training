<?php

namespace Tests\Feature\Posts;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CreatePostValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_creating_a_post_with_invalid_data_fails_validation(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/posts', [
            'title' => '',
            'body' => '',
            'status' => 'not-a-real-status',
            // category_id omitted entirely
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'body', 'status', 'category_id']);

        $this->assertDatabaseCount('posts', 0);
    }
}