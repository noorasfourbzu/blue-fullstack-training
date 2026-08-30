<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\Category;
class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     ***/
    
    public function run(): void
    {


    $technology = Category::where('slug', 'technology')->first();
    $business = Category::where('slug','business')->first();
    $education = Category::where('slug','education') ->first();
    $science = Category::where('slug','science')->first();

         Post::create([
            'title' => 'New Advances in Artificial Intelligence',
            'body' => 'Researchers are exploring new artificial intelligence techniques that could improve how computers understand language, images, and complex data.',
            'status' => 'published',
            'category_id'=> $technology -> id,

        ]);

        Post::create([
            'title' => 'Scientists Develop More Efficient Solar Technology',
            'body' => 'Scientists are working on new solar technologies designed to improve energy efficiency and make renewable energy systems more practical.',
            'status' => 'published',
                        'category_id'=> $business -> id,

        ]);

        Post::create([
            'title' => 'Open Source Developers Release New AI Tools',
            'body' => 'The open source community continues to release new tools and libraries that make it easier for developers to experiment with artificial intelligence applications.',
            'status' => 'published',
            'category_id'=> $education -> id,

        ]);

        Post::create([
            'title' => 'Astronomers Discover Interesting Features in a Distant Planet',
            'body' => 'Astronomers are studying observations from powerful telescopes to better understand the atmosphere and conditions of planets outside our solar system.',
            'status' => 'draft',
                        'category_id'=> $science -> id,

        ]);

        Post::create([
            'title' => 'Researchers Explore Faster Computer Chips',
            'body' => 'Computer scientists and engineers are investigating new chip designs that could improve computing performance while reducing energy consumption.',
            'status' => 'published',
                        'category_id'=> $technology -> id,

        ]);

        Post::create([
            'title' => 'New Research in Quantum Computing',
            'body' => 'Researchers continue to investigate quantum computing methods that could eventually help solve certain problems that are difficult for traditional computers.',
            'status' => 'draft',
                        'category_id'=> $business -> id,

        ]);

        Post::create([
            'title' => 'Cybersecurity Researchers Warn About New Online Threats',
            'body' => 'Security researchers continue to monitor emerging online threats and recommend stronger security practices for users and organizations.',
            'status' => 'published',
                        'category_id'=> $education -> id,

        ]);

        Post::create([
            'title' => 'Scientists Study the Effects of Climate Change',
            'body' => 'New scientific studies are helping researchers understand how changing temperatures and environmental conditions affect ecosystems around the world.',
            'status' => 'draft',
                        'category_id'=> $science -> id,

        ]);
    }
}
