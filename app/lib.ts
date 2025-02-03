import axios from 'axios';

const rawLLM = async (query: string) => {
  try {
    const response = await axios.post('http://localhost:5000/api/rllm', {
      query: query,
    });

    return response.data;
  } catch (error) {
    return { "error" : error }
  }
};

export { rawLLM };