<?php

namespace Tests\Feature\Posts;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\Feature\Support\CreateTestData;
use Tests\TestCase;

class CreatePostTest extends TestCase
{
    use RefreshDatabase;
    use CreateTestData;

    public function test_authenticated_user_can_create_a_post(): void
    {
        $user = User::factory()->create();
        $category = $this->createCategory();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/posts', [
            'title' => 'My first training post',
            'body' => 'Body content long enough to pass validation.',
            'status' => 'published',
            'category_id' => $category->id,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'My first training post')
            ->assertJsonPath('data.user.id', $user->id);

        $this->assertDatabaseHas('posts', [
            'title' => 'My first training post',
            'user_id' => $user->id,
        ]);
    }
}