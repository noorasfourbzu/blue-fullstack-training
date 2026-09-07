<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

   public function test_user_can_login_with_valid_credentials(): void
{
    $user = User::factory()->create([
        'email' => 'bandora@example.com',
        'password' => '12345678',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'bandora@example.com',
        'password' => '12345678',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure(['message', 'token', 'user' => ['id', 'name', 'email']])
        ->assertJsonPath('user.email', $user->email);
}
    public function test_login_fails_with_invalid_credentials(): void
    {
        User::factory()->create(['email' => 'trainee@example.com']);

        $response = $this->postJson('/api/login', [
            'email' => 'trainee@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Invalid credentials']);
    }
}