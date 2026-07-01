# Contacts Directory Web Application

This document outlines the design and development of a basic web application to manage a contact list using JSON data. The application allows users to view, add, edit, and remove contacts.

## 1. JSON Data Structure
The contact list is represented as an array of JSON objects. Each object represents a single contact and contains a unique identifier (`id`), along with their `name`, `phoneNumber`, and `email`.

**Example JSON Data (`contacts.json`):**
```json
[
    {
        "id": "1",
        "name": "Bhekumuzi",
        "phoneNumber": "0821112322",
        "email": "lindokuhle@sample.com"
    },
    {
        "id": "2",
        "name": "Lindokuhle",
        "phoneNumber": "0733334444",
        "email": "Bhekumuzi@sample.com"
    },
    {
        "id": "",
        "name": "Bhekumuzi Tshabalala",
        "phoneNumber": "0782555073",
        "email": "bhekumuzitshabalala@email.com"
    }
]
```

## 2. Display Data
The application fetches the JSON data from a local Node.js/Express server. Once the response is received, it uses the built-in `response.json()` method to parse the JSON string into a JavaScript array of objects.

The `displayContacts()` function iterates over this array using `.forEach()` and dynamically creates table rows (`<tr>`). These rows are then appended to the HTML table body (`<tbody>`), immediately populating the user interface.

**Code Snippet (Data Parsing & Display):**
```javascript
// Fetch and parse JSON data
async function loadContacts() {
    try {
        const response = await fetch('/contacts');
        contactsData = await response.json(); 
        displayContacts();
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

// Dynamically populate HTML table
function displayContacts() {
    const tableBody = document.getElementById('contactTableBody');
    tableBody.innerHTML = ''; // Clear existing table

    contactsData.forEach((contact, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row" class="fw-semibold">${index + 1}</th>
            <td class="fw-medium text-dark">${contact.name}</td>
            <td><i class="bi bi-telephone text-muted me-2"></i>${contact.phoneNumber}</td>
            <td><i class="bi bi-envelope text-muted me-2"></i>${contact.email}</td>
            <td>
                <!-- Action Buttons -->
            </td>
        `;
        tableBody.appendChild(row);
    });
}
```

## 3. Add New Contact
A dedicated HTML form collects the `name`, `email`, and `phoneNumber` from the user. When the form is submitted, the frontend validates the data and sends a `POST` request with a JSON payload to the backend. The backend generates a unique `id`, writes the new data to the `contacts.json` file, and responds with the added contact. 

The frontend then pushes the new contact into the local `contactsData` array and calls `displayContacts()` to refresh the HTML table.

**Code Snippet (Adding Contact):**
```javascript
async function addContact(name, email, phoneNumber) {
    if (validateForm(name, email, phoneNumber)) {
        try {
            const response = await fetch('/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phoneNumber })
            });
            const newContact = await response.json();
            
            // Add to local state and update UI
            contactsData.push(newContact);
            displayContacts(); 
            return true;
        } catch (error) {
            console.error('Error adding contact:', error);
            return false;
        }
    }
    return false;
}
```

## 4. Remove Contact
A separate form is provided where a user can type the exact name of a contact to remove. When submitted, the JavaScript finds the corresponding contact object in the local array using a case-insensitive search. If found, a `DELETE` request is sent to the backend using the contact's unique `id`. The contact is then filtered out of the local array and the table is refreshed.

**Code Snippet (Remove by Name):**
```javascript
// Form submission handler
document.getElementById('removeContactForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('removeNameInput').value.trim();
    
    // Find contact by name
    const contactToDelete = contactsData.find(c => c.name.toLowerCase() === name.toLowerCase());
    
    if (contactToDelete) {
        await removeContact(contactToDelete.id, contactToDelete.name);
        this.reset();
    } else {
        alert('Contact not found with the name: ' + name);
    }
});

// Remove function
async function removeContact(id, name) {
    await fetch(`/contacts/${id}`, { method: 'DELETE' });
    // Remove from local state
    contactsData = contactsData.filter(contact => contact.id !== id);
    displayContacts(); // Update UI
    alert(`${name} has been removed successfully.`);
}
```

## 5. Validation
Both the frontend HTML and JavaScript enforce basic validation before submission.
- **HTML5 Validation**: Inputs use attributes like `required`, `maxlength="10"`, `type="email"`, and `pattern="\d{10}"` to provide immediate feedback.
- **JavaScript Validation**: Ensures that fields aren't empty whitespace and strictly enforces the email and phone formats using Regular Expressions. If validation fails, `alert()` dialogs prompt the user to correct the issue.

**Code Snippet (Validation):**
```javascript
function validateForm(name, email, phoneNumber) {
    // Check for empty fields
    if (!name.trim() || !email.trim() || !phoneNumber.trim()) {
        alert('All fields are required.');
        return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Exact 10-digit phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
        alert('Please enter exactly 10 digits for the phone number.');
        return false;
    }

    return true;
}
```

## Advantages of Using JSON
- **Lightweight and Fast:** JSON transmits data over the network efficiently with minimal overhead compared to older formats like XML.
- **Native JavaScript Integration:** JSON syntax is derived from JavaScript object notation, making it inherently easy to parse (`JSON.parse`) and stringify (`JSON.stringify`) directly inside frontend code.
- **Human-Readable:** It is simple for developers to open `contacts.json` and read or debug the structured data.
- **Flexibility:** Since it works heavily with key-value pairs, adding a new field (like `address` or `birthday`) requires little to no database schema changes, just an addition to the JSON structures.

## Challenges During Development
1. **Handling Horizontal Overflow in Tables:** Initially, long emails or phone numbers would expand the directory table, pushing the "Actions" column out of view. This was resolved by fixing the CSS `overflow` properties on the responsive table container (`.table-responsive`) from `hidden` to `auto` to allow horizontal scrolling while maintaining the card's rounded borders.
2. **Deleting by Name without Unique Constraints:** Implementing the feature to delete a contact by their name posed a challenge since names aren't strictly unique. The solution was to perform a client-side lookup to find the first matching object (case-insensitive), extract its unique server-generated `id`, and send the DELETE request via that `id`. This avoided complex backend modifications and edge cases where a query string might accidentally delete the wrong contact.
3. **Regex Specificity for Phone Numbers:** It was necessary to ensure users inputted exactly 10 numeric digits without any spaces or dashes. The challenge was aligning the HTML5 input constraints (`pattern`, `maxlength`) with the JavaScript RegExp (`^\d{10}$`) to provide a consistent validation experience across the UI and logic layers.