import { doctors as doctorsData } from "./../../assets/data/doctors";
import DoctorCard from "./DoctorCard";

import { BASE_URL } from "../../config";
import useFetchData from "../../hooks/useFetchData";
import Loader from "../../components/Loader/Loading";
import Error from "../Error/Error";

const DoctorList = () => {
  // For development, use the static data instead of fetching
  const doctors = doctorsData;
  const loading = false;
  const error = null;

  return (
    <>
      {loading && <Loader />}
      {error && <Error />}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
          {doctors && doctors.map((doctor) => (
            <DoctorCard key={doctor.id || doctor._id} doctor={doctor} />
          ))}
        </div>
      )}
    </>
  );
};

export default DoctorList;
