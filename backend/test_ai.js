require('dotenv').config({ path: './.env' });
const { generateCourseOutline } = require('./src/utils/aiHelper');

async function testAI() {
  try {
    console.log('Testing AI Integration...');
    const result = await generateCourseOutline('Test Course', 'A course to test AI', 4);
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log('AI Integration is working!');
  } catch (error) {
    console.error('AI Integration Error:', error.message || error);
    process.exit(1);
  }
}

testAI();
