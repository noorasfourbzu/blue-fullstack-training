<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.

     */
    public function run(): void
    {
        
           User::create([
          "name" => "Noor",
          "email" => "noorasfourbzu@gmail.com",
          "password" =>  Hash::make("123"),

           ]
           );

           
           User::create([
          "name" => "example",
          "email" => "example@gmail.com",
          "password" =>  Hash::make("1234"),

           ]
           );
    }
}
