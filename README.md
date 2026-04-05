# GiftLink

GiftLink is a full-stack web application that helps users give away household items they no longer need and helps other users discover free items to reuse locally.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT + bcrypt
- NLP: natural
- Deployment: Docker + GitHub Actions CI

## Project Structure

- `backend/` Express API, MongoDB connection, auth, search, listings, sentiment
- `frontend/` React app with home, listings, item details, registration, login, and profile pages
- `data/gifts.json` starter data with 16 gift listings
- `deliverables/` submission-oriented command files and placeholders

## Local Setup

1. Copy `.env.example` to `.env` and adjust values if needed.
2. Install dependencies:
   `npm install --workspaces`
3. Import starter data into MongoDB:
   `mongoimport --uri mongodb://127.0.0.1:27017/giftlink --collection gifts --file data/gifts.json --jsonArray`
4. Start the backend:
   `npm run dev --workspace backend`
5. Start the frontend:
   `npm run dev --workspace frontend`

## API Endpoints

- `GET /api/gifts`
- `GET /api/gifts/:id`
- `GET /api/search`
- `POST /api/sentiment`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`

## Docker

Run the full stack with:

`docker compose up --build`

The frontend is exposed on `http://localhost:8080` and the API on `http://localhost:5000`.

