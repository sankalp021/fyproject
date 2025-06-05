import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../config";
import DcotorsDropDown from "../../DoctorDropDown/DoctorDropDown";
import Modal from "../../Modal/Modal";
import { formatDiseasePrompt } from "../../../utils/diseasePrompts";

const DiabetesTest = ({ onPrediction, onAnalysis }) => {
  const [inputData, setInputData] = useState({
    "Number of Pregnancies eg. 0": "",
    "Glucose (mg/dL) eg. 80": "",
    "Blood Pressure (mmHg) eg. 80": "",
    "Skin Thickness (mm) eg. 20": "",
    "Insulin Level (IU/mL) eg. 80": "",
    "Body Mass Index (kg/m²) eg. 23.1": "",
    "Diabetes Pedigree Function eg. 0.52": "",
    "Age (years) eg. 34": "",
  });
  const [prediction, setPrediction] = useState(null);
  const [formError, setFormError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormFilled = Object.values(inputData).every((value) => value.trim() !== "");
    if (!isFormFilled) {
      setFormError("Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    try {
      // Get ML prediction
      const mlResponse = await axios.post(`${BASE_URL}/diabetes`, {
        data: inputData,
      });
      setPrediction(mlResponse.data.prediction);
      onPrediction(mlResponse.data.prediction);

      // Get Gemini analysis
      const prompt = formatDiseasePrompt("Diabetes Test", inputData);
      console.log('Sending prompt:', prompt); // Debug log
      const geminiResponse = await axios.post(`${BASE_URL}/analyze-disease`, {
        disease: "Diabetes Test",
        prompt
      });
      
      const response = geminiResponse.data.response;
      setGeminiResponse(response);
      onAnalysis(response);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
      setFormError("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className="w-2/3">
          <h1 className="text-center text-2xl font-bold">Diabetes Predictor</h1>
          <div className="bg-white border border-black rounded p-4">
            <form onSubmit={handleSubmit}>
              {Object.entries(inputData).map(([name, value]) => (
                <div key={name} className="mb-4">
                  <input
                    className="border border-black rounded px-3 py-2 w-full"
                    type="text"
                    name={name}
                    placeholder={name}
                    value={value}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              {formError && (
                <div className="text-red-500 mb-4">{formError}</div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-primaryColor hover:bg-irisBlueColor text-white font-bold py-2 px-4 rounded ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Analyzing..." : "Analyze"}
              </button>
            </form>
          </div>

          {/* {prediction !== null && (
            <div className={`mt-3 ${
              prediction.includes("[1]") ? "bg-red-400" : "bg-green-400"
            } text-2xl p-4 rounded-lg shadow-md`}
            >
              <h3 className="text-center font-semibold">
                {prediction.includes("[1]")
                  ? "High Risk: Please consult your doctor."
                  : "Low Risk: Your indicators appear healthy."}
              </h3>
            </div>
          )}

          <DcotorsDropDown
            testName={"Diabetes Disease Predictor"}
            testResult={prediction?.includes("[1]") ? "Unhealthy" : "Healthy"}
          /> */}

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="AI Analysis Results"
            content={geminiResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default DiabetesTest;