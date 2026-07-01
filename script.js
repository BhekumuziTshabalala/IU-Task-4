const API = '/contacts';

let contactsData = [];

function validateForm(name, email, phoneNumber) {
    if (!name.trim() || !email.trim() || !phoneNumber.trim()) {
        alert('All fields are required.');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
        alert('Please enter exactly 10 digits for the phone number.');
        return false;
    }

    return true;
}

async function loadContacts() {
    try {
        const response = await fetch(API);
        contactsData = await response.json();
        displayContacts();
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

async function removeContact(id, name) {
    try {
        await fetch(`${API}/${id}`, { method: 'DELETE' });
        contactsData = contactsData.filter(contact => contact.id !== id);
        displayContacts();
        alert(`${name} has been removed successfully.`);
    } catch (error) {
        console.error('Error removing contact:', error);
        alert('Failed to remove contact.');
    }
}

async function addContact(name, email, phoneNumber) {
    if (validateForm(name, email, phoneNumber)) {
        try {
            const response = await fetch(API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phoneNumber })
            });
            const newContact = await response.json();
            contactsData.push(newContact);
            displayContacts();
            return true;
        } catch (error) {
            console.error('Error adding contact:', error);
            alert('Failed to add contact.');
            return false;
        }
    }
    return false;
}

function displayContacts() {
    const tableBody = document.getElementById('contactTableBody');
    tableBody.innerHTML = '';

    contactsData.forEach((contact, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <th scope="row" class="fw-semibold">${index + 1}</th>
            <td class="fw-medium text-dark">${contact.name}</td>
            <td><i class="bi bi-telephone text-muted me-2"></i>${contact.phoneNumber}</td>
            <td><i class="bi bi-envelope text-muted me-2"></i>${contact.email}</td>
            <td>
                <div class="d-flex flex-column gap-1">
                    <button class="btn btn-sm btn-outline-primary edit-btn d-inline-flex align-items-center gap-1">
                        <i class="bi bi-pencil-square"></i> Edit
                    </button>
                </div>
            </td>
        `;

        row.querySelector('.edit-btn').addEventListener('click', () => openEditModal(contact));
        tableBody.appendChild(row);
    });
}

let editModal;

function openEditModal(contact) {
    document.getElementById('editContactId').value = contact.id;
    document.getElementById('editNameInput').value = contact.name;
    document.getElementById('editPhoneInput').value = contact.phoneNumber;
    document.getElementById('editEmailInput').value = contact.email;
    editModal.show();
}

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    
    // Initialize the Bootstrap modal
    editModal = new bootstrap.Modal(document.getElementById('editContactModal'));

    // Add Contact form submission
    document.getElementById('contactForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const name = document.getElementById('nameInput').value;
        const email = document.getElementById('emailInput').value;
        const phoneNumber = document.getElementById('phoneInput').value;
        
        const isSuccess = await addContact(name, email, phoneNumber);
        if (isSuccess) {
            this.reset();
            this.classList.remove('was-validated'); 
        }
    });

    // Remove Contact form submission
    document.getElementById('removeContactForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const name = document.getElementById('removeNameInput').value.trim();
        
        const contactToDelete = contactsData.find(c => c.name.toLowerCase() === name.toLowerCase());
        
        if (contactToDelete) {
            await removeContact(contactToDelete.id, contactToDelete.name);
            this.reset();
        } else {
            alert('Contact not found with the name: ' + name);
        }
    });
    // Edit Contact form submission
    document.getElementById('editContactForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const id = document.getElementById('editContactId').value;
        const name = document.getElementById('editNameInput').value;
        const phoneNumber = document.getElementById('editPhoneInput').value;
        const email = document.getElementById('editEmailInput').value;

        if (validateForm(name, email, phoneNumber)) {
            try {
                const response = await fetch(`${API}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phoneNumber })
                });

                if (response.ok) {
                    const updatedContact = await response.json();
                    contactsData = contactsData.map(c => c.id === id ? updatedContact : c);
                    displayContacts();
                    editModal.hide();
                    alert(`${name} has been updated successfully.`);
                } else {
                    alert('Failed to update contact.');
                }
            } catch (error) {
                console.error('Error updating contact:', error);
                alert('Failed to update contact.');
            }
        }
    });
});