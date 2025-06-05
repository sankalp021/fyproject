import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

const Symptomchk = () => {
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [analysisResults, setAnalysisResults] = useState({
    disease: "",
    description: "",
    precaution: "",
    medications: "",
    workout: "",
    diets: ""
  });
  const [activeSection, setActiveSection] = useState(null);

  const handlePrediction = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${BASE_URL}/symptoms`, {
        data: symptoms,
      });
      
      setAnalysisResults({
        disease: response.data.data.predicted_disease,
        description: response.data.data.dis_des,
        precaution: response.data.data.my_precautions,
        medications: response.data.data.medications,
        workout: response.data.data.workout,
        diets: response.data.data.rec_diet
      });
      setActiveSection('disease');
    } catch (error) {
      setErrorMessage("Failed to fetch prediction. Please try again later.");
    }

    setIsLoading(false);
  };

  const sections = [
    { id: 'disease', title: 'Disease', color: '#F39334' },
    { id: 'description', title: 'Description', color: '#268AF3' },
    { id: 'precaution', title: 'Precaution', color: '#F371F9' },
    { id: 'medications', title: 'Medications', color: '#F8576F' },
    { id: 'workout', title: 'Workouts', color: '#99F741' },
    { id: 'diets', title: 'Diets', color: '#E5E23D' }
  ];

  return (
    <section className="min-h-screen bg-gray-50 py-12">
      <div className="px-4 mx-auto max-w-screen-lg">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Health Care Center</h2>
        
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handlePrediction} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="symptoms" className="block text-xl font-medium text-gray-700">
                Enter Your Symptoms
              </label>
              <input
                type="text"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor focus:border-transparent text-lg"
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="E.g., itching, sleeping, aching etc."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primaryColor text-white text-lg font-semibold py-4 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? "Analyzing..." : "Analyze Symptoms"}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            {errorMessage}
          </div>
        )}

        {/* Analysis Results */}
        {analysisResults.disease && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Analysis Results</h3>
            
            {/* Section Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className="p-3 rounded-lg font-semibold text-gray-800 transition-all hover:transform hover:scale-105"
                  style={{
                    backgroundColor: section.color,
                    opacity: activeSection === section.id ? 1 : 0.7
                  }}
                >
                  {section.title}
                </button>
              ))}
            </div>

            {/* Content Display */}
            <div className="bg-gray-50 rounded-lg p-6 min-h-[200px]">
              {activeSection && (
                <div className="prose max-w-none">
                  <h4 className="text-xl font-semibold mb-4" style={{ color: sections.find(s => s.id === activeSection)?.color }}>
                    {sections.find(s => s.id === activeSection)?.title}
                  </h4>
                  <div className="whitespace-pre-line">
                    {analysisResults[activeSection]}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Symptomchk;
