# Contact List Manager Web Application

## Overview
This project is a basic web application designed to manage a contact list utilising JSON data. The application provides a user-friendly interface to view existing contacts, add new entries, and remove specific contacts from the list dynamically.

## Features
1. **View Contacts:** Displays a list of contacts in an HTML table format.
2. **Add Contacts:** Allows users to input a name, email address, and phone number to add to the list.
3. **Remove Contacts:** Enables users to delete a contact by specifying their name.
4. **Data Validation:** Ensures all form fields are completed correctly and the email address follows a valid format before submission.

---

## 1. JSON Data Structure
The application's state is managed using an array of JSON objects. Each object represents a single contact with attributes for `name`, `email`, and `phoneNumber`. 

```json
[
    {
        "name" : "Bhekumuzi",
        "phoneNumber": "082 111 2222",
        "email" : "lindokuhle@sample.com"

    },
    {
        "name" : "Lindokuhle",
        "phoneNumber": "073 333 4444",
        "email" : "Bhekumuzi@sample.com"
    },
    {
        "name" : "Tshabalala",
        "phoneNumber": "061 555 6666",
        "email" : "tshabalala@sample.com"
    }
]