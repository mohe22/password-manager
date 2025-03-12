# Password Manager
![password-landing-3](https://github.com/user-attachments/assets/4c2f00a4-2ee1-42cd-bc68-9bd300a61a02)
![password-landing-1](https://github.com/user-attachments/assets/cd406650-0826-4215-8586-dfddfa88bcf7)
![Screenshot 2025-03-09 190929](https://github.com/user-attachments/assets/ef7c1713-f11b-4fd9-8549-92567715dfc5)
![Screenshot 2025-03-09 190846](https://github.com/user-attachments/assets/5a238169-14a2-4f9f-9c95-5bc156feb6b3)
![Screenshot 2025-03-09 190827](https://github.com/user-attachments/assets/1a8009b2-7853-4b4b-9572-d796eeefd5a4)
![Screenshot 2025-03-09 190742](https://github.com/user-attachments/assets/fdacd2de-2048-463c-970f-6a5e0546f852)
![Screenshot 2025-03-09 190635](https://github.com/user-attachments/assets/7ebf2220-ac57-4e49-b81b-4e1e32b44cb3)
![Screenshot 2025-03-09 190616](https://github.com/user-attachments/assets/ca682851-2263-4929-bdf6-673641d8f54e)
![Screenshot 2025-03-09 190543](https://github.com/user-attachments/assets/1479e555-2ca4-45f6-8554-853ede3fd6e2)
![Screenshot 2025-03-09 190437](https://github.com/user-attachments/assets/53d68614-50da-4156-ba83-63a67b2db082)
![Screenshot 2025-03-09 190357](https://github.com/user-attachments/assets/29754568-2c24-4b95-8e88-1b27b5f4ec15)
![Screenshot 2025-03-09 190258](https://github.com/user-attachments/assets/59088ed1-9afa-4f5c-b906-073267ee5a32)
![password-loading](https://github.com/user-attachments/assets/c8a8ccab-a01f-4946-bf93-044c939c8e1b)

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
For questions or support, reach out at [yln0501403845@gmail.com].

