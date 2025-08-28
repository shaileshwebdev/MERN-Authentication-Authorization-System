import React from "react";

const Verifymail = () => {
  return (
    <div className="relative w-full h-[760px] flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold mb-4">✅ Check Your Mail</h2>
        <p className="text-gray-600">
          We sent a verification email to verify your account. Please check your
          inbox and follow the link to complete registration.
        </p>
      </div>
    </div>
  );
};

export default Verifymail;
