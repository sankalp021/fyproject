import React, { useState } from "react";
import Loader from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import { BASE_URL } from "../../config.js";
import Tabs from "./Tabs.jsx";
import starIcon from "../../assets/images/Star.png";
import DoctorAbout from "../../pages/Doctors/DoctorAbout.jsx";
import Profile from "./Profile.jsx";
import Appointments from "./Appointments.jsx";

const Dashboard = () => {
  const [tab, setTab] = useState("overview");
  
  // Mock loading and error states
  const loading = false;
  const error = null;
  
  // Mock doctor data
  const data = {
    name: "Dr. Example",
    email: "doctor@example.com",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    specialization: "Cardiologist",
    bio: "Experienced doctor with 10 years of practice",
    about: "Dedicated healthcare professional with a focus on patient care and preventive medicine",
    qualifications: [
      { startingDate: "2010", endingDate: "2015", degree: "M.D. Medicine", university: "Harvard Medical School" }
    ],
    experiences: [
      { startingDate: "2015", endingDate: "Present", position: "Senior Cardiologist", hospital: "Metro Hospital" }
    ],
    timeSlots: [
      { day: "Monday", startingTime: "10:00", endingTime: "16:00" }
    ],
    appointments: [],
    averageRating: 4.8,
    totalRating: 28,
    isApproved: "approved"
  };

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {loading && !error && <Loader />}
        {error && !loading && <Error />}

        {!loading && !error && (
          <div className="grid lg:grid-cols-3 gap-[30px] lg:gap-[50px]">
            <Tabs tab={tab} setTab={setTab} />
            <div className="lg:col-span-2">
              <div className="mt-8">
                {tab === "overview" && (
                  <div>
                    <div className="flex items-center gap-4 mb-10">
                      <figure className="max-w-[200px] max-h-[200px]">
                        <img src={data?.photo} alt="" className="w-full" />
                      </figure>

                      <div>
                        <span className="bg-[#CCF2F3] text-irisBlueColor py-1 px-4 lg:py-2 lg:px-5 rounded text-[12px] leading-4 lg:text-[16px] lg:leading-6 font-semibold">
                          {data.specialization}
                        </span>

                        <h3 className="text-[22px] leading-9 font-bold text-headingColor mt-3">
                          {data.name}
                        </h3>

                        <div className="flex items-center gap-[6px]">
                          <span className="flex items-center gap-[6px] text-headingColor text-[14px] leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                            <img src={starIcon} alt="" />
                            {data.averageRating}
                          </span>

                          <span className="text-textColor text-[14px] leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                            {data.totalRating}
                          </span>
                        </div>
                        <p className="text__para font-[15px] lg:max-w-[390px] leading-6">
                          {data?.bio}
                        </p>
                      </div>
                    </div>
                    <DoctorAbout
                      name={data.name}
                      about={data.about}
                      qualifications={data.qualifications}
                      experiences={data.experiences}
                    />
                  </div>
                )}
                {tab === "appointments" && (
                  <div>
                    <Appointments appointments={data.appointments || []} />
                  </div>
                )}
                {tab === "settings" && (
                  <div>
                    <Profile doctorData={data} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
