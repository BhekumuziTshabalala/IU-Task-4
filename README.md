# Contact List Manager Web Application

## Overview
This project is a basic web application designed to manage a contact list utilising JSON data. The application provides a user-friendly interface to view existing contacts, add new entries, and remove specific contacts from the list dynamically.

## Features
1. **View Contacts:** Displays a list of contacts in an HTML table format.
2. **Add Contacts:** Allows users to input a name, email address, and phone number to add to the list.
3. **Remove Contacts:** Enables users to delete a contact by clicking the delete button in the table, or by specifying their exact name in the removal form.
4. **Data Validation:** Ensures all form fields are completed correctly and the email address follows a valid format before submission.
5. **Node.js Backend:** Uses an Express server to handle JSON data read/write/delete operations on the server side instead of frontend-only mockups or `json-server`.

---

## 1. JSON Data Structure
The application's state is managed using an array of JSON objects stored in `contacts.json`. Each object represents a single contact with attributes for `id`, `name`, `email`, and `phoneNumber`.

```json
[
    {
        "id": "1",
        "name" : "Bhekumuzi",
        "phoneNumber": "082 111 2222",
        "email" : "lindokuhle@sample.com"
    },
    {
        "id": "2",
        "name" : "Lindokuhle",
        "phoneNumber": "073 333 4444",
        "email" : "Bhekumuzi@sample.com"
    }
]
```

---

## 2. API Endpoints
The Node.js server (`server.js`) exposes the following endpoints:

* **`GET /contacts`**: Reads and returns all contacts from `contacts.json`.
* **`POST /contacts`**: Creates a new contact with a unique generated `id`, appends it to `contacts.json`, and returns the created contact.
* **`DELETE /contacts/:id`**: Deletes the contact with the matching `id` from `contacts.json`.

---

## 3. Running the Project

### Prerequisites
- [Node.js](https://nodejs.org/) (includes npm) installed on your system.

### Steps to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Express server:
   ```bash
   npm start
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```