<?php

namespace Tests\Feature\Pages;

use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_published_page_can_be_viewed_publicly_by_slug(): void
    {
        $user = User::factory()->create();

        $page = Page::factory()
            ->for($user)
            ->create([
                'slug' => 'about-us',
                'status' => 'published',
            ]);

        $response = $this->getJson('/api/pages/about-us');

        $response
            ->assertStatus(200)
            ->assertJsonPath('data.slug', 'about-us')
            ->assertJsonPath('data.status', 'published');
    }

    public function test_draft_page_cannot_be_viewed_publicly(): void
    {
        $user = User::factory()->create();

        Page::factory()
            ->for($user)
            ->create([
                'slug' => 'draft-page',
                'status' => 'draft',
            ]);

        $response = $this->getJson('/api/pages/draft-page');

        $response->assertStatus(404);
    }

    public function test_unknown_slug_returns_404(): void
    {
        $response = $this->getJson('/api/pages/does-not-exist');

        $response->assertStatus(404);
    }
}