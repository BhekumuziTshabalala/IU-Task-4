const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CONTACTS_FILE = path.join(__dirname, 'contacts.json');

app.use(express.json());
// Serve static files from the current directory
app.use(express.static(__dirname));

// Helper function to read contacts safely
async function readContacts() {
    try {
        const data = await fs.readFile(CONTACTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error('Error reading contacts file:', error);
        throw error;
    }
}

// Helper function to write contacts safely
async function writeContacts(contacts) {
    try {
        await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 4), 'utf8');
    } catch (error) {
        console.error('Error writing contacts file:', error);
        throw error;
    }
}

// GET /contacts - Get all contacts
app.get('/contacts', async (req, res) => {
    try {
        const contacts = await readContacts();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read contacts' });
    }
});

// POST /contacts - Add a new contact
app.post('/contacts', async (req, res) => {
    try {
        const { name, email, phoneNumber } = req.body;
        if (!name || !email || !phoneNumber) {
            return res.status(400).json({ error: 'Name, email, and phoneNumber are required' });
        }

        const contacts = await readContacts();
        
        // Generate a simple unique ID
        const newContact = {
            id: Date.now().toString(),
            name,
            phoneNumber,
            email
        };

        contacts.push(newContact);
        await writeContacts(contacts);

        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save contact' });
    }
});

// DELETE /contacts/:id - Remove a contact by ID
app.delete('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let contacts = await readContacts();
        
        const initialLength = contacts.length;
        contacts = contacts.filter(contact => contact.id !== id);
        
        if (contacts.length === initialLength) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        await writeContacts(contacts);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
