import axios from 'axios';

export async function GET(res) {
  try {
    //TODO: Change the URL to the correct endpoint
    const apiResponse = await axios.get('http://127.0.0.1:8080/listTransactions?storageCenterId=3');

    return new Response(JSON.stringify({ inventory: apiResponse.data }), { status: 200 });
  } catch (error) {
    console.error("Error in GET handler:", error.message);
    return new Response(JSON.stringify({ error: "Failed to process the request." }), { status: 500 });
  }
}