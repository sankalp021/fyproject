import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import { authContext } from "../context/AuthContext.jsx";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(authContext);

  const [formData, setFormData] = useState({
    email: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Simulate successful password reset request
    setTimeout(() => {
      setLoading(false);
      toast.success("Password reset link sent to your email!");
      navigate("/login");
    }, 1000);
  };

  return (
    <section className="px-5 lg:px-0">
      <div className="w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-10">
          Forgot
          <span className="text-primaryColor"> Password </span> ❗
        </h3>
        <form action="" className="py-4 md:py-0" onSubmit={submitHandler}>
          <div className="mb-5">
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
              required
            />
          </div>

          <div className="mt-7">
            <button
              disabled={loading && true}
              type="submit"
              className="w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3"
            >
              {loading ? "Loading..." : "Send Reset Link"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
