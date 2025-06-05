import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../config";
import DcotorsDropDown from "../../DoctorDropDown/DoctorDropDown";
import Modal from "../../Modal/Modal";
import { formatDiseasePrompt } from "../../../utils/diseasePrompts";

const HeartDiseaseTest = ({ onPrediction, onAnalysis }) => {
  const [inputData, setInputData] = useState({
    "Age": "",
    "Sex (1=male, 0=female)": "",
    "Chest pain type (1-4)": "",
    "Resting BP (mmHg)": "",
    "Cholesterol (mg/dl)": "",
    "Fasting blood sugar > 120 mg/dl (1=true, 0=false)": "",
    "Resting ECG (0=normal, 1=ST-T wave abnormality, 2=LV hypertrophy)": "",
    "Maximum heart rate": "",
    "Exercise induced angina (1=yes, 0=no)": "",
    "ST depression induced by exercise": "",
    "Peak exercise ST segment (1=up, 2=flat, 3=down)": "",
    "Number of major vessels (0-3)": "",
    "Thal (3=normal, 6=fixed defect, 7=reversible defect)": ""
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
      const mlResponse = await axios.post(`${BASE_URL}/heart`, {
        data: inputData,
      });
      setPrediction(mlResponse.data.prediction);
      onPrediction(mlResponse.data.prediction);

      // Get Gemini analysis
      const prompt = formatDiseasePrompt("Heart Disease Test", inputData);
      const geminiResponse = await axios.post(`${BASE_URL}/analyze-disease`, {
        disease: "Heart Disease Test",
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
    <div className="m-5 row mb-32">
      <div className="col-md-2"></div>
      <div className="col-md-8">
        <h1 className="text-center text-3xl font-bold mb-8">
          Heart Disease Predictor
        </h1>
        <div className="card border border-black rounded-lg p-8">
          <form className="form-horizontal" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(inputData).map(([name, value]) => (
                <div key={name} className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {name}
                  </label>
                  <input
                    className="border border-black p-2 w-full rounded"
                    type="text"
                    name={name}
                    placeholder="Enter value"
                    value={value}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              {formError && (
                <div className="col-span-2 text-red-500 mb-4">{formError}</div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`mt-4 w-full bg-primaryColor hover:bg-irisBlueColor text-white font-bold py-2 px-4 rounded ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Analyzing..." : "Analyze"}
            </button>
          </form>

          {prediction !== null && (
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
            testName="Heart Disease Test"
            testResult={prediction?.includes("[1]") ? "Unhealthy" : "Healthy"}
          />

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

export default HeartDiseaseTest;
