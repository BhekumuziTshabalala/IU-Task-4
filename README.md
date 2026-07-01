# Contacts Directory

A simple, modern web application for managing a contact list. This project uses a lightweight Node.js/Express backend to store contact data persistently in a local JSON file. The frontend is built using standard HTML, JavaScript, and Bootstrap 5 for responsive styling.

## Features

- **View Contacts:** Displays all saved contacts in a responsive table.
- **Add Contacts:** Allows users to add a new contact with basic validation (e.g., enforcing exactly 10 digits for the phone number).
- **Remove Contacts:** Users can type a contact's name to instantly remove them from the directory.
- **Data Persistence:** All contacts are stored and updated in real-time within `contacts.json`.

## Technology Stack

- **Frontend:** HTML5, Vanilla JavaScript, Bootstrap 5 (CSS & Icons).
- **Backend:** Node.js, Express.js.
- **Data Storage:** Local JSON file (`contacts.json`).

## Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

## Getting Started

1. **Clone or Download the Repository:**
   Navigate into the project directory (e.g., `cd Task5`).

2. **Install Dependencies:**
   Run the following command to install the required Express package:
   ```bash
   npm install
   ```

3. **Start the Application:**
   Start the Node.js server with:
   ```bash
   npm start
   ```
   *(Alternatively, you can run `node server.js`)*

4. **Access the App:**
   Open your preferred web browser and go to:
   [http://localhost:3000](http://localhost:3000)

## Troubleshooting

- **Error: `EADDRINUSE: address already in use :::3000`**
  This means you already have a server running on port 3000 (perhaps in another terminal window or background process). You need to stop that server first, or change the port in `server.js`.
