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
  
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
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

router.post('/kidney', async (req, res) => {
  try {
    const { data } = req.body;
    const mockPrediction = Math.random() > 0.5 ? "[1]" : "[0]";
    res.json({ prediction: mockPrediction });
  } catch (error) {
    console.error('Kidney Disease Prediction Error:', error);
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
    }
    
    let model;
    try {
      model = await initializeGeminiModel();
    } catch (initError) {
      console.error('Failed to initialize Gemini:', initError);
      return res.status(500).json({ 
        error: 'Service configuration error',
        details: initError.message
      });
    }    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      console.log('Raw Gemini response:', text);
      
      // Check if text has proper section formatting
      const requiredSections = ['RISK ASSESSMENT', 'KEY FACTORS', 'LIFESTYLE RECOMMENDATIONS', 'WARNING SIGNS'];
      let formattedText = text;
      
      // If text doesn't have proper sections, create structured fallback
      if (!requiredSections.every(section => text.includes(`[${section}]`))) {
        console.log('Response lacks proper sections, creating structured format...');
        
        // Split the response into paragraphs for better distribution
        const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 0);
        
        // Distribute content across sections more intelligently
        const riskContent = paragraphs[0] || 'Based on the provided data, further medical evaluation is recommended.';
        const factorsContent = paragraphs.slice(1, Math.ceil(paragraphs.length / 3)).join('\n\n') || 'Multiple factors may be contributing to the risk profile.';
        const recommendationsContent = paragraphs.slice(Math.ceil(paragraphs.length / 3), Math.ceil(2 * paragraphs.length / 3)).join('\n\n') || 'Maintain a healthy lifestyle with regular exercise and balanced diet.';
        const warningContent = paragraphs.slice(Math.ceil(2 * paragraphs.length / 3)).join('\n\n') || 'Consult with a healthcare professional for persistent symptoms.';
        
        formattedText = `[RISK ASSESSMENT]
${riskContent}

[KEY FACTORS]
${factorsContent}

[LIFESTYLE RECOMMENDATIONS]
${recommendationsContent}

[WARNING SIGNS]
${warningContent}`;
      }
      
      console.log('Final formatted response:', formattedText);
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

// Symptoms analysis endpoint
router.post('/symptoms', async (req, res) => {
  try {
    const { data: symptoms } = req.body;
    console.log('Received symptoms:', symptoms);
    
    if (!symptoms || symptoms.trim() === '') {
      return res.status(400).json({ error: 'Symptoms are required' });
    }
    
    let model;
    try {
      model = await initializeGeminiModel();
    } catch (initError) {
      console.error('Failed to initialize Gemini:', initError);
      return res.status(500).json({ 
        error: 'Service configuration error',
        details: initError.message
      });
    }    // Create a comprehensive prompt for symptom analysis
    const prompt = `
    You are a medical AI assistant. Analyze the following symptoms and provide a comprehensive health assessment.

    Patient Symptoms: ${symptoms}

    Please provide your analysis in the following structured format with clear sections. Use simple text without asterisks, special symbols, or formatting characters:

    [POSSIBLE CONDITIONS]
    List 2-3 most likely conditions or health issues based on these symptoms. Use plain text without asterisks or bullet points.

    [DESCRIPTION]
    Provide a brief medical explanation of the most probable condition in simple paragraph form.

    [IMMEDIATE PRECAUTIONS]
    List immediate steps the patient should take for safety and symptom management. Use numbered points (1. 2. 3.) instead of asterisks.

    [RECOMMENDED MEDICATIONS]
    Suggest over-the-counter medications or general treatment approaches in simple text format (note: not a prescription).

    [LIFESTYLE RECOMMENDATIONS]
    Suggest exercise, rest, or activity modifications that may help. Use numbered points instead of asterisks.

    [DIETARY SUGGESTIONS]
    Recommend foods or dietary changes that may help with the condition in simple text format.

    Important: This is for informational purposes only and should not replace professional medical advice. Always consult a healthcare provider for proper diagnosis and treatment.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      console.log('Raw Gemini response:', text);
        // Parse the structured response
      const sections = {};
      const sectionPattern = /\[([^\]]+)\]\s*([\s\S]*?)(?=\[|$)/g;
      let match;
      
      while ((match = sectionPattern.exec(text)) !== null) {
        const [, header, content] = match;
        // Clean the content by removing asterisks and unnecessary symbols
        const cleanContent = content
          .trim()
          .replace(/\*/g, '') // Remove asterisks
          .replace(/•/g, '') // Remove bullet points
          .replace(/^\s*[-•]\s*/gm, '') // Remove dash/bullet prefixes
          .replace(/\n\s*\n/g, '\n') // Remove extra empty lines
          .trim();
        sections[header.trim()] = cleanContent;
      }
      
      // Create structured response for frontend
      const structuredResponse = {
        predicted_disease: sections['POSSIBLE CONDITIONS'] || 'Condition analysis not available',
        dis_des: sections['DESCRIPTION'] || 'Description not available',
        my_precautions: sections['IMMEDIATE PRECAUTIONS'] || 'Precautions not available',
        medications: sections['RECOMMENDED MEDICATIONS'] || 'Medication suggestions not available',
        workout: sections['LIFESTYLE RECOMMENDATIONS'] || 'Exercise recommendations not available',
        rec_diet: sections['DIETARY SUGGESTIONS'] || 'Dietary suggestions not available'
      };
      
      console.log('Structured response:', structuredResponse);
      res.json({ data: structuredResponse });
      
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
    console.error('Symptoms Analysis Error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze symptoms',
      details: error.message 
    });
  }
});

export default router;
