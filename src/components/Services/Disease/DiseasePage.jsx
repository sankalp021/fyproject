import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { services } from "../../../assets/data/services";
import DiabetesTest from "./DiabetesTest";
import HeartDiseaseTest from "./HeartDiseaseTest";
import KidneyDiseaseTest from "./KidneyDiseaseTest.jsx";
import LiverDiseaseTest from "./LiverDiseaseTest.jsx";
import BreastCancerDiseaseTest from "./BreastCancerDiseaseTest.jsx";
import MalariaDiseaseTest from "./MalariaDiseaseTest.jsx";
import PneumoniaDiseaseTest from "./PneumoniaDiseaseTest.jsx";
import ResultComponent from "./ResultComponent";
import DiseaseInput from "./DiseaseInput";

const DiseasePage = () => {
  const [prediction, setPrediction] = useState(null);
  const [geminiResponse, setGeminiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the service ID from the URL using useParams
  const { id } = useParams();
  const [currentService, setCurrentService] = useState(null);

  React.useEffect(() => {
    const loadService = () => {
      setIsLoading(true);
      const foundService = services.find(s => s.id === id);
      setCurrentService(foundService);
      setIsLoading(false);
    };

    loadService();
  }, [id]);
  
  const handlePrediction = (pred) => {
    setPrediction(pred);
  };

  const handleGeminiAnalysis = (response) => {
    setGeminiResponse(response);
  };

  const renderDiseaseComponent = () => {
    const commonLayout = (SpecificTest) => (
      <div className="disease-test-container">
        {SpecificTest && <SpecificTest onPrediction={handlePrediction} onAnalysis={handleGeminiAnalysis} />}
        {prediction !== null && <ResultComponent prediction={prediction} />}
        <div className="mt-8">
          <DiseaseInput disease={currentService.name} onSubmit={handleGeminiAnalysis} />
          {geminiResponse && (
            <div className="mt-8 p-6 bg-[#f5f5f5] rounded-lg">
              <h3 className="text-[18px] leading-[30px] text-headingColor font-semibold mb-4">
                AI Analysis:
              </h3>
              <p className="text-[16px] leading-7 text-textColor">
                {geminiResponse}
              </p>
            </div>
          )}
        </div>
      </div>
    );

    // Determine which test component to use
    let TestComponent = null;
    
    switch (currentService.id) {
      case "1":
        TestComponent = DiabetesTest;
        break;
      case "2":
        TestComponent = HeartDiseaseTest;
        break;
      case "3":
        TestComponent = KidneyDiseaseTest;
        break;
      case "4":
        TestComponent = LiverDiseaseTest;
        break;
      case "5":
        TestComponent = BreastCancerDiseaseTest;
        break;
      case "6":
        TestComponent = MalariaDiseaseTest;
        break;
      case "7":
        TestComponent = PneumoniaDiseaseTest;
        break;
      default:
        return (
          <div className="text-center py-8">
            <h3 className="text-xl text-red-500">Disease test not found</h3>
            <p className="text-gray-600 mt-2">Please try another disease or use the symptom analysis below.</p>
          </div>
        );
    }

    return commonLayout(TestComponent);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl text-headingColor">Loading...</h2>
      </div>
    );
  }

  if (!currentService) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl text-red-500">Error: Disease not found</h2>
        <p className="mt-4">Please select a valid disease from the services page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-[26px] leading-9 font-bold text-headingColor mb-6">
        {currentService.name}
      </h2>
      <p className="text-[16px] leading-7 text-textColor mb-8">
        {currentService.desc}
      </p>
      {renderDiseaseComponent()}
    </div>
  );
};

export default DiseasePage;
