# Group Chat

## Overview

This project is a group chat application that consists of both a frontend and backend. It allows users to communicate in real-time and is built using Node.js for the backend and a suitable framework for the frontend.

## Prerequisites

Make sure you have the following installed on your machine:

- Node.js
- npm
- Python (for running tests)
- MongoDB (for database operations)

## Installation

1. Clone the repository:
```bash
   git clone https://github.com/irahularora/groupchat.git
   cd groupchat
```

2. Install dependencies for both frontend and backend:
```bash
   npm install
```

3. Navigate to the `tests` directory and install the required Python packages:
```bash
   cd tests
   pip install -r requirements.txt
```

4. Update the MongoDB URI in the backend's `.env` file:
   In `backend/.env`, set the following:
```bash
   MONGO_URI=mongodb://localhost:27017/groupchat
```

## Running the Application

To start both the frontend and backend simultaneously, run:
```bash
    npm run start
```

## User Login

For the first-time user, the default login credentials are:
- **Username:** admin
- **Password:** admin

To run the tests, execute:
```bash
    python main.py
```

## Note

Make sure that your MongoDB server is running before you start the application.
