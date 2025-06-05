import React, { useState } from 'react';

const DiseaseInput = ({ disease, onSubmit }) => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here we'll make the API call to your backend which will communicate with Gemini
      const result = await fetch('/api/analyze-symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disease: disease,
          symptoms: symptoms
        }),
      });

      const data = await result.json();
      setResponse(data.response);
      onSubmit && onSubmit(data.response);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setResponse('Sorry, there was an error processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="symptoms" 
            className="block text-sm font-medium text-headingColor mb-2"
          >
            
          </label>
          {/* <textarea
            id="symptoms"
            name="symptoms"
            rows={4}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none focus:border-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor rounded-md"
            placeholder="e.g., I've been experiencing..."
            required
          /> */}
        </div>
        
        {/* <button
          type="submit"
          disabled={loading}
          className="w-full bg-primaryColor text-white text-[16px] leading-[30px] rounded-lg px-4 py-3 hover:bg-irisBlueColor disabled:bg-[#0066ff61]"
        >
          {loading ? 'Analyzing...' : 'Analyze Symptoms'}
        </button> */}
      </form>

      {response && (
        <div className="mt-8 p-6 bg-[#f5f5f5] rounded-lg">
          <h3 className="text-[18px] leading-[30px] text-headingColor font-semibold mb-4">
            Analysis Results:
          </h3>
          <p className="text-[16px] leading-7 text-textColor">
            {response}
          </p>
        </div>
      )}
    </div>
  );
};

export default DiseaseInput;
