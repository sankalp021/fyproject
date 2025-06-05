import { BASE_URL } from '../config';

export const analyzeDisease = async (disease, symptoms) => {
  try {
    const response = await fetch(`${BASE_URL}/api/analyze-disease`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ disease, symptoms }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
