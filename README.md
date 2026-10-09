# Blue Full-Stack Training

This repository contains three related learning projects: a Vue frontend, a Laravel API, and an October CMS site. The Vue app connects to the Laravel API for authentication, posts, categories, and CMS-style pages. The October CMS project practices building a separate theme-based site with reusable templates and editable content.



## Required Software
 
Install these before doing anything else:
 
- **Node.js** 20.19+ (or 22.12+) and **npm** — for the Vue frontend
- **PHP** 8.3+
- **Composer** //  PHP's package manager, used to install the Laravel backend
- **MySQL** //  a local server (XAMPP, MAMP, or a native install all work)
- **Git**
- **October CMS:** PHP 8.2+ and Composer (the theme runs inside the `october-cms` application)



## Project Structure

- `task-07-vue-app` → Vue 3 frontend, built with Vite and Pinia
- `task-11-laravel-api` → Laravel REST API, using MySQL and Sanctum
- `october-cms` → October CMS application and the `blue-training-theme` theme

To use the integrated Vue/Laravel app, run its frontend and backend at the same time in separate terminals:





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

## October CMS Setup and Theme

The October CMS project is in `october-cms`. It uses the theme named **Blue Training Theme** (`blue-training-theme`).

### Install and run locally

1. Make sure PHP 8.2+ and Composer are installed, and start a local MySQL server if using MySQL.
2. Open a terminal in `october-cms` and install the PHP dependencies:

   ```sh
   composer install
   ```

3. Create a local environment file from `.env.example` (in PowerShell, run `Copy-Item .env.example .env`; on macOS/Linux, run `cp .env.example .env`).
4. Configure the local application URL and database settings in `.env`, then generate an application key:

   ```sh
   php artisan key:generate
   ```

5. Run the October installer to configure the database, create the database tables, and set up the first backend administrator:

   ```sh
   php artisan october:install
   ```

6. Start the local web server:

   ```sh
   php artisan serve
   ```

   Open the site at `http://127.0.0.1:8000`. The October CMS backend is at `http://127.0.0.1:8000/backend`.

### Database and backend access

Create an empty local database first if using MySQL. Set `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` in the local `.env` to match your own database. These are local configuration values: do not put real credentials in the README or commit `.env`. The installer uses this configuration to initialize the CMS database.

Use the administrator account created during `php artisan october:install` to sign in at `/backend`. Do not publish its password; each developer should create and keep their own local credentials.

### Theme structure

Theme files are under `october-cms/themes/blue-training-theme`:

- `layouts/default.htm` provides the shared HTML shell, stylesheet link, header, page content area, and footer.
- `pages/home.htm`, `pages/about.htm`, `pages/contact.htm`, and `pages/index.htm` define CMS page routes and page content. The About and Contact files currently contain their page metadata but no custom body content.
- `partials/header.htm`, `partials/footer.htm`, and `partials/hero.htm` are reusable page fragments.
- `content/hero.htm` contains editable hero content used by the hero partial.
- `assets/css/theme.css` contains the theme's desktop and mobile styling.

Select **Blue Training Theme** as the active front-end theme in the October backend to view it. This theme uses plain CSS, so no separate Node/npm build step is needed for its styles.

### Setup notes and challenges

- The October site is a separate app from the Vue/Laravel integration; run its server from `october-cms` and configure its database independently.
- The CMS page templates, shared partials, editable content, and CSS live in different theme folders, so keep their filenames and CSS class names aligned when editing the design.
- The local backend administrator and database credentials are created/configured on each machine and should not be shared in project documentation.

## Comparing the Vue Pages with October CMS

The Vue/Laravel Pages feature and October CMS both separate a page's content from the parts of the site that are shared, but they express that structure differently:

- **Pages:** In the Vue app, a published page is fetched by its slug and rendered dynamically. In October CMS, a Page defines a URL and its own page content; it uses a Layout to wrap that content.
- **Layouts:** The Vue app's `App.vue` provides a shared shell around the router view, including the site header and footer. An October CMS Layout serves a similar purpose: it defines the common HTML structure and includes shared elements around each page.
- **Partials and components:** Vue components such as the Hero, Text, and Call to Action blocks can be reused to build pages. October CMS Partials are reusable template fragments, such as the header, footer, or hero partial, included where needed.
- **Editable content:** In the Vue app, page fields and block data are stored in Laravel and managed through the app's page tools. October CMS lets editors manage page content separately from the templates; for example, the hero text can be stored as editable content and rendered inside the hero partial.

The ideas are similar—reusable structure and content managed separately—but Vue renders typed blocks in the app, while October CMS assembles theme Pages, Layouts, Partials, and editable content.