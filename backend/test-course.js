const axios = require('axios');
const jwt = require('jsonwebtoken');

async function test() {
  try {
    // Generate a valid JWT token for a mock teacher
    const token = jwt.sign(
      { id: '6a0f2ffd91e7d9cb11564834', role: 'teacher' }, // John the teacher
      'supersecretkey123',
      { expiresIn: '1d' }
    );

    const payload = {
      title: 'Untitled AI Generated Course',
      code: 'CS-123',
      description: 'No description provided.',
      semester: 'Semester 1',
      academicYear: '2026/2027',
      status: 'draft'
    };

    const res = await axios.post('http://localhost:5000/api/courses', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

test();
