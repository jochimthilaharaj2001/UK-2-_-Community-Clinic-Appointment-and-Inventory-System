
console.log('Starting test...');
async function testLogin() {
    try {
        console.log('Calling fetch...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@clinic.com',
                password: 'admin123',
                role: 'admin'
            })
        });
        console.log('Response received, status:', response.status);
        const data = await response.json();
        console.log('Data:', data);
    } catch (error) {
        console.log('Error in testLogin:', error);
    }
}

testLogin();
