import axios from 'axios';

const rawLLM = async (query: string, history: string) => {
  try {
    const response = await axios.post('http://localhost:5000/api/rllm', {
      history: history,
      query: query,
    });

    return response.data;
  } catch (error) {
    return { "error" : error }
  }
};

function getTokenCount(text: string): number {
  return text.split(/\s+/).length;
}

function trimToMaxTokens(text: string, maxTokens: number): string {
  const words = text.split(/\s+/);
  const trimmedWords = words.slice(0, maxTokens);
  return trimmedWords.join(' ');
}

export { rawLLM, getTokenCount, trimToMaxTokens };