const axios = require('axios');

async function clearUsers() {
  try {
    const response = await axios.delete('http://localhost:3001/api/users/all');
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

clearUsers(); 