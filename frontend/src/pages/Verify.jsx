import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const Verify = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying ..");
  useEffect(() => {
    const verifyMail = async () => {
      try {
        const res = await axios.post(
          `${apiUrl}/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.success) {
          setStatus("✅ Email is verified successfully");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setStatus("❌ Email is not verified");
        }
      } catch (error) {
        console.log(error);
        setStatus("❌ Email is not verified");
      }
    };
    verifyMail();
  }, [token, navigate]);
  return (
    <div className="relative w-full h-[760px] flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold mb-4">{status} </h2>
      </div>
    </div>
  );
};

export default Verify;
