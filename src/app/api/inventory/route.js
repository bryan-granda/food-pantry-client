import axios from 'axios';

export async function GET(request) {
  try {
    //TODO: Change the URL to the correct endpoint
    const response = await axios.get('http://127.0.0.1:8080/listTransactions?storageCenterId=3');

    const data = JSON.stringify({ inventory: response.data });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

export async function POST(request) {
  try {
    //TODO: Change the URL to the correct endpoint
    const response = await axios.get('http://127.0.0.1:8080/listTransactions?storageCenterId=3');

    const data = JSON.stringify({ inventory: response.data });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}