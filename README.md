# Talki - Real-Time Chat App

Talki is a full-stack messenger prototype built as a final course project. It allows registered users to create an account, verify their email address, log in securely, manage their profile, add contacts, and exchange real-time chat messages.

## Features

- User registration with email verification
- Login with JWT authentication
- Password reset by email
- Protected chat and settings pages
- Contact list and contact search
- One-to-one chat creation
- Real-time messaging with Socket.IO
- Message deletion
- Profile settings with username, password, and profile picture updates
- Dark mode support

## Tech Stack

Frontend:

- React
- Vite
- React Router
- Tailwind CSS
- Socket.IO Client
- Font Awesome

Backend:

- Node.js
- Express
- MongoDB with Mongoose
- Socket.IO
- JWT
- bcrypt
- Multer
- Resend email API

## Project Structure

```text
chat-app/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    server.js
  frontend/
    src/
      components/
      context/
      layouts/
      pages/
```

## Requirements

- Node.js
- npm
- MongoDB Atlas database or local MongoDB
- Resend account and API key

## Environment Variables

Create a `.env` file inside `backend/` based on `backend/.env.example`:

```env
MONGODB_DB=mongodb://127.0.0.1:27017/chat-app
JWT_SECRET_KEY=replace-with-a-long-random-secret
RESEND_API_KEY=replace-with-your-resend-api-key
EMAIL_ADDRESS=you@example.com
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
```

For MongoDB Atlas, use the connection string from Atlas. If `mongodb+srv://` does not work in your local network or environment, use the standard `mongodb://...` Atlas connection string with multiple hosts.

`FRONTEND_URL` is used for email verification and password reset links.

`CORS_ORIGINS` can contain multiple frontend addresses separated by commas, for example:

```env
CORS_ORIGINS=http://localhost:5173,http://192.168.0.200:5173
```

Create a `.env` file inside `frontend/` if you want to override the API URL:

```env
VITE_API_URL=http://localhost:3000
```

## Installation

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Running Locally

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Expected backend output:

```text
DB connected
MongoDB connected successfully
Server started on port: http://localhost:3000
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Open the Vite URL in the browser, usually:

```text
http://localhost:5173
```

On Windows PowerShell, if `npm run dev` is blocked by script execution policy, use:

```powershell
npm.cmd run dev
```

## How To Test The Main Flow

1. Open the frontend URL.
2. Click `Join Now`.
3. Register a new user.
4. Check the email address configured as `EMAIL_ADDRESS`.
5. Open the verification link.
6. Log in with the verified account.
7. Add contacts and open a chat.
8. Send and delete messages.
9. Test password reset from the `Forgot Password` page.

Note: during local testing, verification and reset emails are sent to the email configured in `EMAIL_ADDRESS`.

## Common Local Issues

### PowerShell blocks npm

Use:

```powershell
npm.cmd run dev
```

### Port 3000 is already in use

Find the process:

```powershell
netstat -ano | findstr :3000
```

Stop it:

```powershell
taskkill /PID <PID> /F
```

Then restart the backend.

### Password reset opens the wrong app

Check `FRONTEND_URL` in `backend/.env`. It must match the frontend URL shown by Vite.

Example:

```env
FRONTEND_URL=http://localhost:5173
```

Restart the backend after changing `.env`.

### CORS error with Socket.IO

If the browser opens the app at a network address such as `http://192.168.0.200:5173`, add it to `CORS_ORIGINS`:

```env
CORS_ORIGINS=http://localhost:5173,http://192.168.0.200:5173
```

Restart the backend after changing `.env`.

## Useful Commands

Frontend lint:

```bash
cd frontend
npm run lint
```

Frontend production build:

```bash
cd frontend
npm run build
```

Backend syntax check:

```powershell
rg --files backend -g *.js -g !node_modules | ForEach-Object { node --check $_ }
```

## Security Notes

- Do not commit real `.env` files.
- Keep MongoDB and Resend credentials private.
- Use a long random value for `JWT_SECRET_KEY`.
- In production, restrict MongoDB network access and CORS origins to trusted addresses only.
