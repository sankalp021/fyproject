import { useEffect, useState } from "react";
import { token } from "../config.js";

// Mock data for different API endpoints
const mockDataMap = {
  // Mock user profile data
  "/users/profile/me": {
    name: "Demo User",
    email: "demo@example.com",
    photo: "https://randomuser.me/api/portraits/women/79.jpg",
    bloodType: "O+",
    gender: "female"
  },
  // Mock doctor profile data
  "/doctors/profile/me": {
    name: "Dr. Example",
    email: "doctor@example.com",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    specialization: "Cardiologist",
    bio: "Experienced doctor with 10 years of practice",
    experiences: [],
    qualifications: [],
    timeSlots: []
  },
  // Mock appointments data
  "/users/appointments/my-appointments": []
};

const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Extract the endpoint path from the URL
    const urlPath = url.replace(/^.*\/api\/v1/, "");
    
    // Simulate loading
    setLoading(true);
    
    setTimeout(() => {
      // Check if we have mock data for this endpoint
      if (mockDataMap[urlPath]) {
        setData(mockDataMap[urlPath]);
      } else {
        // Default to empty array for unknown endpoints to prevent map errors
        setData([]);
      }
      setLoading(false);
    }, 500);
  }, [url]);
  return { data, loading, error };
};

export default useFetchData;
