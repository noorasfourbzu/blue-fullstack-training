# Task - Full Stack Integration (Vue + Laravel)
This is the README for Tass 15 + 16 + 17 In these tasks I connected the Vue frontend.

This Task connects the Vue frontend with the Laravel backend, including authentication, posts, categories, filtering, pagination, and CRUD operations using real MySQL data. Then Done several Tests on it. 

(Task 18) I also added a Pages module on top of this, so the app can show simple CMS-style pages (like an About Us page) in addition to the blog-style posts.

Below is how to run both projects
together and how the integration works.



## Required Software
 
Install these before doing anything else:
 
- **Node.js** 20.19+ (or 22.12+) and **npm** — for the Vue frontend
- **PHP** 8.3+
- **Composer** //  PHP's package manager, used to install the Laravel backend
- **MySQL** //  a local server (XAMPP, MAMP, or a native install all work)
- **Git**



## Project Structure 
The frontend and backend are still two separate projects and both need to run
at the same time (in two different terminals):

- `task-07-vue-app` → Vue 3 frontend , contains: Vite , Pinian ,Vue Routers
- `task-11-laravel-api` → Laravel backend, contains: REST API , MySql , Sanctum 




## How to run the Backend
1. Open a terminal inside `task-11-laravel-api`.
2. Install PHP dependencies: `composer install`
3. Generate the app key: `   php artisan key:generate`
4. Run the migrations and seeders for sample posts :`   php artisan migrate --seed`
5. Start the Laravel server: `php artisan serve`

## How to run the Frontend 
1. Open a second terminal inside `task-07-vue-app`
2. Install the packages: `   npm install`
3. Make sure the `.env` file has the backend URL
4. Start the dev server: `   npm run dev`


keep both terminals open and open the vue app in the browser, usaully its on `http://localhost:5173`
while the Backend is on ``http://127.0.0.1:8000`


## Environment Variables 
note: the values are just example not real values 
**Backend** 

```
APP_URL=http://localhost:8000
 
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

**Frontend**

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```
 

The frontend never has the database password or any backend secret, it only
knows the API base URL.


## CORS 

The backend only allows requests coming from the Vue dev server, this is set
in `task-11-laravel-api/config/cors.php`:
 
```php
'allowed_origins' => ['http://localhost:5173'],
```
 
So make sure the Vue app is running on port `5173`, otherwise the browser will block the requests with a CORS error.



## Database Setup 

The backend uses MySQL for this task. 
Steps:
1. Create an empty MySQL databas with whatever name 
2. Set the DB credentials in `.env` as shown above
3. Run `php artisan migrate --seed` to create the tables and add some seeds data 


## Authentication Flow 


Authentication uses Laravel Sanctum with **tokens** :
1. User logs in from the Vue `LoginView` using `POST /api/login`.
2. If the credentials are correct, the backend returns a token + the user
   info.
3. The Vue app saves this token in `sessionStorage` (`authToken`) through the
   Pinia `auth` store (`src/stores/auth.js`).
4. On every request after login, the token is sent automatically in the
   `Authorization: Bearer <token>` header 
5. `GET /api/me` is used to get the logged-in user and show them in the
   header 
6. `POST /api/logout` clears the token on the backend, and the frontend also
   removes it from `sessionStorage`.
7. If any request comes back `401 Unauthorized`, the app catches it and logs
   the user out / sends them back to login instead of failing silently


## Posts and Categories 
- Posts are loaded from GET /api/posts with pagination, search, and category filters.
- Categories are loaded from GET /api/categories and used in the Create/Edit forms.
- Create, Update, and Delete use the Laravel API and require authentication. Users can only modify their own posts.
- The Pinia store updates automatically after changes, keeping the UI in sync.


## Pages (Task 18)

The app now includes a simple CMS style **Pages** module alongside Posts.

- Each page has a **title, unique slug, content, and status** (`draft` or `published`)
- **Public pages:** Published pages can be viewed without login using `/p/<slug>`. Draft or unknown pages return `404`.
- **Page management:** Authenticated users can view, create, edit, and delete their own pages from `/pages`.
- **Ownership:** Users can only update or delete their own pages; unauthorized actions return `403 Forbidden`.
- The **Manage My Pages** button on the Account page links to the Pages management section.

- **Endpoints:**

| Method | Endpoint | Protected? |
|---|---|:---:|
| GET | /api/pages | Yes (own pages only) |
| POST | /api/pages | Yes |
| GET | /api/pages/{id} | Yes (own pages only) |
| PUT | /api/pages/{id} | Yes (own pages only) |
| DELETE | /api/pages/{id} | Yes (own pages only) |
| GET | /api/pages/{slug} | **No** for public, published only |

## Running Tests 
**Frontend using Vitest**
```
npm test
```
Run this inside `task-07-vue-app`. All API calls are mocked, so this doesn't need the backend running.
 
**Backend ( using Laravel test runner):**
```
php artisan test
```
Run this inside `task-11-laravel-api`.
Note : it uses SQLLite database for testing so it doesnt effect your real database.


## Posts and Categories

| Feature | Description |
|---|---|
| Posts | Posts are loaded from `GET /api/posts` with pagination, search, and category filters. |
| Categories | Categories are loaded from `GET /api/categories` and used in the Create/Edit forms. |
| Create / Update / Delete | Create, Update, and Delete use the Laravel API and require authentication. Users can only modify their own posts. |
| Pinia Store | The Pinia store updates automatically after changes, keeping the UI in sync. |


## Error Handling 
The app displays errors for:
- Network/backend errors
- Invalid login credentials
- Validation errors
- Unauthorized actions (401)
- Forbidden actions (403)
- Missing posts (404)
-  Missing or draft pages when viewed publicly (404)
- duplicate-slug validation errors (422)



## October CMS preperation Notes :


During the work on Pages and Content Blocks section I implemented some fundamental CMS concepts which are also implemented in  October CMS

* **Pages:** Page has basic attributes  (exp: title, slug, content, and status. Published pages)  All can be displayed to the public while draft pages can be stored for management purposes

* **Reusable content blocks:** Instead of storing all content directly within one page layout, I implemented reusable block types such as Hero, Text and Call to Action. Each of the blocks has its own content and can be added, edited, removed and reorganized

* **Dynamic rendering:** Public page doesnt have any single layout to render blocks. It gets blocks from the backend and it uses  the appropriate Vue component according to block type

* **Content management:** The page can be managed from the admin panel by adding editing the content of the blocks removing them and reorganizing

* **Separation between public and admin parts:** The management interface is secured and used for content management while the public page just shows published content