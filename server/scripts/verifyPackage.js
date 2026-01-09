const fs = require('fs');
const path = require('path');
const { openAsBlob } = require('fs');

async function testPackageCreation() {
    try {
        // 1. Login as Admin
        console.log('Logging in as admin...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: '12345' })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful. Token obtained.');

        // 2. Create Package with Days
        console.log('Creating package with days...');
        const form = new FormData();
        form.append('title', 'Test Multi-Day Package');
        form.append('description', 'Test Description');
        form.append('price', '999');
        form.append('featured', 'false');

        const days = [
            { dayNumber: 1, title: 'Day 1 Title', description: 'Day 1 Description' },
            { dayNumber: 2, title: 'Day 2 Title', description: 'Day 2 Description' }
        ];
        form.append('days', JSON.stringify(days));

        // Create dummy image
        const dummyPath = path.join(__dirname, 'dummy.jpg');
        fs.writeFileSync(dummyPath, 'dummy content');

        // In Node 20, we can accept streams or blobs. Let's try Blob.
        // If openAsBlob is not available or issues, we can construct a Blob from buffer.
        const fileBuffer = fs.readFileSync(dummyPath);
        const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
        form.append('images', blob, 'dummy.jpg');

        const createRes = await fetch('http://localhost:5000/api/packages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: form
        });

        if (!createRes.ok) {
            const errText = await createRes.text();
            throw new Error(`Creation failed: ${createRes.status} ${errText}`);
        }

        const packageData = await createRes.json();
        console.log('Package created:', packageData);

        if (packageData.days.length !== 2) {
            throw new Error('Days not saved correctly');
        }
        console.log('Days verification passed.');

        // 3. Clean up
        console.log('Cleaning up...');
        await fetch(`http://localhost:5000/api/packages/${packageData._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fs.unlinkSync(dummyPath);
        console.log('Test package deleted.');

        console.log('✅ Verification Successful!');

    } catch (error) {
        console.error('Verification Failed:', error);
    }
}

testPackageCreation();
