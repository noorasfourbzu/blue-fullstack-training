<?php

namespace Tests\Feature\Pages;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_title_is_required(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/pages', [
                'slug' => 'about-us',
                'content' => 'Content',
                'status' => 'published',
            ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    public function test_status_must_be_valid(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/pages', [
                'title' => 'About Us',
                'slug' => 'about-us',
                'content' => 'Content',
                'status' => 'invalid',
            ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    public function test_slug_must_be_unique(): void
    {
        $user = User::factory()->create();

        Page::factory()
            ->for($user)
            ->create([
                'slug' => 'about-us',
            ]);

        $response = $this->actingAs($user)
            ->postJson('/api/pages', [
                'title' => 'Another Page',
                'slug' => 'about-us',
                'content' => 'Content',
                'status' => 'published',
            ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['slug']);
    }
}