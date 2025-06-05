import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Initialize Gemini model with proper error handling
const initializeGeminiModel = async () => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  try {    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    // Verify the model is working with a simple test
    await model.generateContent("Test");
    return model;
  } catch (error) {
    console.error('Gemini initialization error:', error);
    throw new Error('Failed to initialize Gemini model: ' + error.message);
  }
};

// Disease prediction endpoints with mock responses for testing
router.post('/diabetes', async (req, res) => {
  try {
    const { data } = req.body;
    const mockPrediction = Math.random() > 0.5 ? "[1]" : "[0]";
    res.json({ prediction: mockPrediction });
  } catch (error) {
    console.error('Diabetes Prediction Error:', error);
    res.status(500).json({ error: 'Failed to process prediction' });
  }
});

router.post('/heart', async (req, res) => {
  try {
    const { data } = req.body;
    const mockPrediction = Math.random() > 0.5 ? "[1]" : "[0]";
    res.json({ prediction: mockPrediction });
  } catch (error) {
    console.error('Heart Disease Prediction Error:', error);
    res.status(500).json({ error: 'Failed to process prediction' });
  }
});

router.post('/analyze-disease', async (req, res) => {
  try {
    const { disease, prompt } = req.body;
    console.log('Received request:', { disease, prompt });
    
    if (!disease || !prompt) {
      console.log('Missing parameters:', { disease, prompt });
      return res.status(400).json({ error: 'Missing required parameters' });
    }    let model;
    try {
      model = await initializeGeminiModel();
    } catch (initError) {
      console.error('Failed to initialize Gemini:', initError);
      return res.status(500).json({ 
        error: 'Service configuration error',
        details: initError.message
      });
    }

    try {      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Make sure text has the required section headers if they're missing
      const requiredSections = ['RISK ASSESSMENT', 'KEY FACTORS', 'LIFESTYLE RECOMMENDATIONS', 'WARNING SIGNS'];
      let formattedText = text;
      
      // If text doesn't have proper sections, try to format it
      if (!requiredSections.every(section => text.includes(`[${section}]`))) {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        formattedText = `
[RISK ASSESSMENT]
${lines[0] || 'Risk assessment not available.'}

[KEY FACTORS]
${lines.slice(1, 3).join('\n') || '• No specific factors identified.'}

[LIFESTYLE RECOMMENDATIONS]
${lines.slice(3, 5).join('\n') || '• General health recommendations apply.'}

[WARNING SIGNS]
${lines.slice(5).join('\n') || '• Consult a doctor if you experience any concerning symptoms.'}`;
      }

      console.log('Formatted Gemini response:', formattedText);
      res.json({ response: formattedText });
    } catch (geminiError) {
      console.error('Gemini API specific error:', geminiError);
      if (geminiError.message?.includes('safety')) {
        res.status(400).json({ error: 'Content safety check failed' });
      } else if (geminiError.message?.includes('quota')) {
        res.status(429).json({ error: 'API quota exceeded' });
      } else {
        res.status(500).json({ 
          error: 'Gemini API error',
          details: geminiError.message 
        });
      }
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze disease data',
      details: error.message 
    });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Disease routes working!' });
});

export default router;
