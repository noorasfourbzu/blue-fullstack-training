<?php

namespace Tests\Feature\Pages;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\Page;
use App\Models\User;

class CreatePageTest extends TestCase
{
        use RefreshDatabase;
      public function test_authenticated_user_can_create_a_page(): void
    {
        $user = User::factory()->create();

        $data = [
            'title' => 'About Us',
            'slug' => 'about-us',
            'content' => 'This is the about us page.',
            'status' => 'published',
        ];

        $response = $this->actingAs($user)
            ->postJson('/api/pages', $data);

        $response
            ->assertStatus(201)
            ->assertJsonPath('data.title', 'About Us')
            ->assertJsonPath('data.slug', 'about-us')
            ->assertJsonPath('data.status', 'published');

        $this->assertDatabaseHas('pages', [
            'title' => 'About Us',
            'slug' => 'about-us',
            'user_id' => $user->id,
        ]);
    }

    public function test_guest_cannot_create_a_page(): void
    {
        $response = $this->postJson('/api/pages', [
            'title' => 'About Us',
            'slug' => 'about-us',
            'content' => 'Content',
            'status' => 'published',
        ]);

        $response->assertStatus(401);
    }

}
