
const API_URL = 'http://localhost:5000/api';

async function addItem() {
    try {
        console.log('Logging in as admin...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@clinic.com',
                password: 'admin123',
                role: 'admin'
            })
        });

        const loginData = await loginRes.json();
        const token = loginData.token;

        if (!token) {
            console.error('Login failed:', loginData);
            return;
        }

        console.log('Login successful. Token acquired.');

        const item = {
            generic_name: 'sanchevini',
            category: 'Medical Supplies',
            quantity: 124,
            unit: 'Pieces',
            reorder_level: 22,
            selling_price: 43000,
            manufacturer: 'fbfbgfbgfn',
            expiry_date: '2026-02-26',
            location: 'A1-05'
        };

        console.log('Adding inventory item...', item);
        const res = await fetch(`${API_URL}/inventory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(item)
        });

        const data = await res.json();
        if (res.ok) {
            console.log('Success:', data.message);
        } else {
            console.error('Failed:', data);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

addItem();
