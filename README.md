# Password Manager

## Overview
This is a secure password manager built using FastAPI for the backend and React for the frontend. The application allows users to store, manage, and retrieve encrypted passwords securely. It also includes user authentication with 2-factor authentication (2FA), password recovery, and the ability to export/import passwords.

## Features
- **User Authentication**
  - Register and login
  - Password reset functionality
  - Two-factor authentication (2FA)

- **Password Management**
  - Add new password entries
  - Edit existing password entries
  - Delete password entries
  - Encrypt and decrypt passwords securely

- **Advanced Features**
  - Export passwords securely
  - Import passwords securely
  - Generate strong passwords

## Installation
### Prerequisites
- Python 3.8+
- Node.js and npm
- PostgreSQL or any supported database

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/password-manager.git
   cd password-manager/server
   ```
2. Create and activate a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   ```sh
   cp .env.example .env
   ```
   Update `.env` with database connection details and secret keys.
5. Apply database migrations:
   ```sh
   alembic upgrade head
   ```
6. Start the FastAPI server:
   ```sh
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the React client:
   ```sh
   cd ../react
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm run dev
   ```

## API Endpoints
### Authentication
- **`POST /register`** - Register a new user
- **`POST /login`** - Login a user
- **`POST /forgot-password`** - Request password reset
- **`POST /reset-password`** - Reset the password
- **`POST /enable-2fa`** - Enable 2-factor authentication
- **`POST /verify-2fa`** - Verify 2FA code

### Password Management
- **`POST /passwords`** - Add a new password entry
- **`PUT /passwords/{id}`** - Edit an existing password entry
- **`DELETE /passwords/{id}`** - Delete a password entry

### Export & Import
- **`GET /export-passwords`** - Export encrypted passwords
- **`POST /import-passwords`** - Import encrypted passwords

### Password Generator
- **`POST /generate-secure-password`** - Generate a secure password

## Security
- All passwords are encrypted using AES-256 encryption with a passphrase-derived key.
- User authentication is secured with JWT tokens.
- Two-factor authentication adds an additional layer of security.

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.

## Contact
For questions or support, reach out at [your-email@example.com].

