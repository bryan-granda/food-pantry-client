import axios from 'axios';

export async function GET(request) {
  try {
    const response = await axios.get('http://127.0.0.1:8080/listTransactions?storageCenterId=3');

    console.log('response', response);
    console.error('response', response);
    console.error('response.data', response.data);
    console.log('response.data', response.data);

    return new Response(JSON.stringify({ inventory: response.data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching inventory', error);
    return new Response({ status: 500 }, {error: error});
  }
}