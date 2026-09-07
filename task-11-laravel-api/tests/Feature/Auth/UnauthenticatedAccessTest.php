<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UnauthenticatedAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_a_protected_endpoint(): void
    {
        $response = $this->getJson('/api/me');
        $response->assertStatus(401);
    }
}