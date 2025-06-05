import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../config";
import DcotorsDropDown from "../../DoctorDropDown/DoctorDropDown";
import Modal from "../../Modal/Modal";
import { formatDiseasePrompt } from "../../../utils/diseasePrompts";

const KidneyDiseaseTest = ({ onPrediction, onAnalysis }) => {
  const [inputData, setInputData] = useState({
    "blood pressure": "",
    "specific gravity": "",
    "albumin": "",
    "sugar": "",
    "red blood cells": "",
    "pus cell": "",
    "pus cell clumps": "",
    "bacteria": "",
    "blood glucose random": "",
    "blood urea": "",
    "serum creatinine": "",
    "sodium": "",
    "potassium": "",
    "hemoglobin": "",
    "packed cell volume": "",
    "white blood cell count": "",
    "red blood cell count": "",
    "hypertension": "",
    "diabetes mellitus": "",
    "coronary artery disease": "",
    "appetite": "",
    "pedal edema": "",
    "anemia": ""
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
      const mlResponse = await axios.post(`${BASE_URL}/kidney`, {
        data: inputData,
      });
      setPrediction(mlResponse.data.prediction);
      onPrediction(mlResponse.data.prediction);

      // Get Gemini analysis
      const prompt = formatDiseasePrompt("Kidney Disease Test", inputData);
      const geminiResponse = await axios.post(`${BASE_URL}/analyze-disease`, {
        disease: "Kidney Disease Test",
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
          Kidney Disease Predictor
        </h1>
        <div className="card border border-black rounded-lg p-8">
          <form className="form-horizontal" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(inputData).map(([name, value]) => (
                <div key={name} className="col-span-1">
                  <input
                    className="border border-black p-2 w-full"
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
            </div>
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
            testName="Kidney Disease Test"
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

export default KidneyDiseaseTest;
