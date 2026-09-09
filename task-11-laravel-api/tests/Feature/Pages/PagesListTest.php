<?php

namespace Tests\Feature\Pages;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Page;
use App\Models\User;

class PagesListTest extends TestCase
{
        use RefreshDatabase;
    /**
     * A basic feature test example.
     */


     public function test_authenticated_user_can_list_their_pages(): void
    {
        $user = User::factory()->create();

        Page::factory()
            ->count(3)
            ->for($user)
            ->create();

        $response = $this->actingAs($user)->getJson('/api/pages');

        $response ->assertStatus(200) ->assertJsonCount(3, 'data');
    }

    public function test_guest_cannot_access_pages_list(): void
    {
        $response = $this->getJson('/api/pages');
        $response->assertStatus(401);
    }
}
