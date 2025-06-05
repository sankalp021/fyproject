export const formatDiseasePrompt = (disease, inputData) => {
  const prompts = {
    "Diabetes Test": (data) => `[CONTEXT]
Patient Data:
- Number of Pregnancies: ${data["Number of Pregnancies eg. 0"]}
- Glucose Level: ${data["Glucose (mg/dL) eg. 80"]} mg/dL
- Blood Pressure: ${data["Blood Pressure (mmHg) eg. 80"]} mmHg
- Skin Thickness: ${data["Skin Thickness (mm) eg. 20"]} mm
- Insulin Level: ${data["Insulin Level (IU/mL) eg. 80"]} IU/mL
- BMI: ${data["Body Mass Index (kg/m²) eg. 23.1"]} kg/m²
- Diabetes Pedigree Function: ${data["Diabetes Pedigree Function eg. 0.52"]}
- Age: ${data["Age (years) eg. 34"]} years

[INSTRUCTIONS]
Analyze the diabetes risk indicators and provide a structured assessment.

[RISK ASSESSMENT]
Evaluate the overall risk level for diabetes based on these indicators.

[KEY FACTORS]
Identify the most significant factors affecting the risk level.

[LIFESTYLE RECOMMENDATIONS]
Provide specific actionable lifestyle changes.

[WARNING SIGNS]
List symptoms requiring immediate medical attention.`,

    "Heart Disease Test": (data) => `[CONTEXT]
Patient Indicators:
Age: ${data["Age"]}
Sex: ${data["Sex (1=male, 0=female)"] === "1" ? "Male" : "Female"}
Chest Pain: Type ${data["Chest pain type (1-4)"]}
Blood Pressure: ${data["Resting BP (mmHg)"]} mmHg
Cholesterol: ${data["Cholesterol (mg/dl)"]} mg/dl
Fasting Blood Sugar: ${data["Fasting blood sugar > 120 mg/dl (1=true, 0=false)"] === "1" ? "Above 120 mg/dl" : "Normal"}
ECG Results: ${data["Resting ECG (0=normal, 1=ST-T wave abnormality, 2=LV hypertrophy)"]}
Max Heart Rate: ${data["Maximum heart rate"]}
Exercise Angina: ${data["Exercise induced angina (1=yes, 0=no)"] === "1" ? "Present" : "Absent"}
ST Depression: ${data["ST depression induced by exercise"]}
ST Slope: ${data["Peak exercise ST segment (1=up, 2=flat, 3=down)"]}
Major Vessels: ${data["Number of major vessels (0-3)"]}
Thalassemia: ${data["Thal (3=normal, 6=fixed defect, 7=reversible defect)"]}

[INSTRUCTIONS]
Provide a clear analysis of the cardiac indicators in four sections. Use bullet points where needed and avoid any special characters or symbols.

[RISK ASSESSMENT]
Provide a single, clear paragraph assessing the overall heart disease risk based on the most critical indicators. Do not use bullet points here.

[KEY FACTORS]
Present the top 3 factors affecting heart health:
• Factor 1 and its impact
• Factor 2 and its impact
• Factor 3 and its impact

[LIFESTYLE RECOMMENDATIONS]
List 3-4 specific actions the patient should take:
• Recommendation 1
• Recommendation 2
• Recommendation 3
• Recommendation 4 (if needed)

[WARNING SIGNS]
Watch for these critical symptoms:
• Warning sign 1
• Warning sign 2
• Warning sign 3

Avoid using any asterisks or special characters. Keep responses direct and concise.`,

    "Kidney Disease Test": (data) => `[CONTEXT]
Patient Data:
- Blood Pressure: ${data["blood pressure"]}
- Specific Gravity: ${data["specific gravity"]}
- Albumin: ${data["albumin"]}
- Sugar: ${data["sugar"]}
- Red Blood Cells: ${data["red blood cells"]}
- Pus Cell: ${data["pus cell"]}
- Pus Cell Clumps: ${data["pus cell clumps"]}
- Bacteria: ${data["bacteria"]}
- Blood Glucose Random: ${data["blood glucose random"]}
- Blood Urea: ${data["blood urea"]}
- Serum Creatinine: ${data["serum creatinine"]}
- Sodium: ${data["sodium"]}
- Potassium: ${data["potassium"]}
- Hemoglobin: ${data["hemoglobin"]}
- Packed Cell Volume: ${data["packed cell volume"]}
- White Blood Cell Count: ${data["white blood cell count"]}
- Red Blood Cell Count: ${data["red blood cell count"]}
- Hypertension: ${data["hypertension"]}
- Diabetes Mellitus: ${data["diabetes mellitus"]}
- Coronary Artery Disease: ${data["coronary artery disease"]}
- Appetite: ${data["appetite"]}
- Pedal Edema: ${data["pedal edema"]}
- Anemia: ${data["anemia"]}

[INSTRUCTIONS]
Analyze the kidney disease indicators and provide a structured assessment.

[RISK ASSESSMENT]
Evaluate the overall kidney health risk level.

[KEY FACTORS]
Identify the most significant factors affecting kidney health.

[LIFESTYLE RECOMMENDATIONS]
Provide specific actionable lifestyle changes.

[WARNING SIGNS]
List renal symptoms requiring immediate medical attention.`,

    "Liver Disease Test": (data) => `[CONTEXT]
Patient Data:
- Age: ${data["Age"]}
- Gender: ${data["Gender"]}
- Total Bilirubin: ${data["Total_Bilirubin"]}
- Direct Bilirubin: ${data["Direct_Bilirubin"]}
- Alkaline Phosphotase: ${data["Alkaline_Phosphotase"]}
- Alamine Aminotransferase: ${data["Alamine_Aminotransferase"]}
- Aspartate Aminotransferase: ${data["Aspartate_Aminotransferase"]}
- Total Proteins: ${data["Total_Protiens"]}
- Albumin: ${data["Albumin"]}
- Albumin Globulin Ratio: ${data["Albumin_and_Globulin_Ratio"]}

[INSTRUCTIONS]
Analyze the liver disease indicators and provide a structured assessment.

[RISK ASSESSMENT]
Evaluate the overall liver health risk level.

[KEY FACTORS]
Identify the most significant factors affecting liver health.

[LIFESTYLE RECOMMENDATIONS]
Provide specific actionable lifestyle changes.

[WARNING SIGNS]
List hepatic symptoms requiring immediate medical attention.`,
  };

  // Default prompt for any other disease type
  const defaultPrompt = (data) => `[CONTEXT]
Patient Data:
${Object.entries(data)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

[INSTRUCTIONS]
Analyze the health indicators and provide a structured assessment.

[RISK ASSESSMENT]
Evaluate the overall health risk level.

[KEY FACTORS]
Identify the most significant factors affecting health.

[LIFESTYLE RECOMMENDATIONS]
Provide specific actionable lifestyle changes.

[WARNING SIGNS]
List symptoms requiring immediate medical attention.`;

  return (prompts[disease] || defaultPrompt)(inputData);
};
