<?php

namespace Database\Factories;

use App\Models\ContentBlock;
use App\Models\Page;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContentBlock>
 */
class ContentBlockFactory extends Factory
{
    protected $model = ContentBlock::class;

    public function definition(): array
    {
        return [
            'page_id' => Page::factory(),
            'type' => 'text',
            'position' => 0,
            'data' => [
                'content' => fake()->paragraph(),
            ],
        ];
    }

    public function hero(): static
    {
        return $this->state(fn () => [
            'type' => 'hero',
            'data' => [
                'heading' => fake()->sentence(3),
                'subtitle' => fake()->sentence(6),
            ],
        ]);
    }

    public function text(): static
    {
        return $this->state(fn () => [
            'type' => 'text',
            'data' => [
                'content' => fake()->paragraph(),
            ],
        ]);
    }

    public function cta(): static
    {
        return $this->state(fn () => [
            'type' => 'cta',
            'data' => [
                'heading' => fake()->sentence(3),
                'button_label' => 'Learn More',
                'button_url' => fake()->url(),
            ],
        ]);
    }
}