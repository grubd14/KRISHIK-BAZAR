## Krisik Bazar (KRISHIK-BAZAR)

Empowering Nepali farmers with transparent market information and a simple web UI.

### Features

- **Real-time prices**: Manage crops, markets, and daily prices via REST APIs
- **Simple SPA frontend**: Tailwind-powered UI bundled with the Django app
- **Seed data**: One-click script to populate crops, markets, and prices
- **Admin panel**: Manage data using Django admin

### Tech Stack

- **Backend**: Django 5.2, Django REST Framework
- **Database**: SQLite (default)
- **Frontend**: Tailwind CSS (CDN), Font Awesome, Vanilla JS
- **Utilities**: django-cors-headers, Pillow

## Quickstart

### Prerequisites

- Python 3.10+
- pip

### 1) Install dependencies

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

### 2) Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 3) Seed sample data (recommended)

```bash
python populate_data.py
```

This creates common crops, several Nepali markets (e.g., Kalimati, Pokhara), and randomized daily prices.

### 4) Start the server

```bash
python manage.py runserver
```

- Frontend UI: `http://127.0.0.1:8000/`
- Admin: `http://127.0.0.1:8000/admin/` (optional; create a superuser below)

Optional: create an admin user

```bash
python manage.py createsuperuser
```

## Project layout

```text
KRISHIK-BAZAR/
  ├─ krisik_bazar/
  │  ├─ models.py          # Crop, Market, Price, UserSearch
  │  ├─ serializers.py     # DRF serializers
  │  ├─ views.py           # ViewSets
  │  ├─ urls.py            # API + frontend routes
  │  └─ settings.py        # Django settings (DEBUG on by default)
  ├─ templates/            # Tailwind-based UI (served at "/")
  ├─ static/               # JS, CSS, images
  ├─ populate_data.py      # Seed crops, markets, prices
  ├─ manage.py
  └─ db.sqlite3            # SQLite database (created after migrate)
```

## Configuration

- `DEBUG` is enabled by default. For production, set `DEBUG=False`, set `ALLOWED_HOSTS`, and rotate `SECRET_KEY`.
- Static files are served from `static/` in development. Configure a proper static files backend for production.
- CORS is wide-open for hackathon convenience. Restrict in production (`CORS_ALLOW_ALL_ORIGINS = False`).

## API Reference

Base URL: `http://127.0.0.1:8000/`

### List endpoints (DRF ViewSets)

- `GET /api/crops/`
- `GET /api/markets/`
- `GET /api/prices/`

Standard DRF actions (list/retrieve/create/update/delete) are available for `crops`, `markets`, and `prices`.

 

## Frontend walkthrough

- The root route (`/`) serves a single-page UI (Tailwind CSS + Vanilla JS) with sections: Home, Products, Add Product, About, Contact.
- Products are populated from `GET /api/prices/`. The UI merges these server records with any locally added demo products stored in `localStorage`.
- Auth is simulated in the frontend (no backend auth). Login/registration just set data in `localStorage` for the demo experience.
- Adding a product stores it locally (not persisted to the backend) and is visible in the UI for the current browser.

## Seeding details

`populate_data.py` creates:

- Crops: Rice, Wheat, Corn, Potato, Tomato (with Nepali names)
- Markets: Kalimati, Baneshwor, Pulchowk, Bharatpur, Pokhara (with contacts)
- Prices: Randomized price_per_kg for each crop-market pair

If the script reports missing tables, run migrations first, then re-run the script.

## Admin

- Visit `/admin/` to manage crops, markets, and prices.
- Create a superuser with `python manage.py createsuperuser`.

## Development notes and ideas

- Add real authentication and user models; wire the Add Product flow to backend endpoints.
- Lock down CORS and permissions for production use.
- Serve static files via a production-ready approach (e.g., WhiteNoise or a CDN).
- Replace the hardcoded `SECRET_KEY` and configure environment-based settings.

## Acknowledgements

- Tailwind CSS, Font Awesome
- Django & Django REST Framework


