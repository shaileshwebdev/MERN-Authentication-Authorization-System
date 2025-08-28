import { useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { RotateCcw } from "lucide-react";
const apiUrl = import.meta.env.VITE_API_URL;

const ForgotOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill("")); // otp array
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const { email } = useParams();
  const navigate = useNavigate();

  

  // OTP Input change handler
  const handleChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${apiUrl}/verify-otp/${email}`,
        { otp: finalOtp }
      );
      setSuccessMessage(res.data.message);
      setIsVerified(true);
      setTimeout(() => {
        navigate(`/change-password/${email}`);
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const clearOtp = () => {
    setOtp(new Array(6).fill(""));
    setError("");
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-green-600">
            Verify OTP
          </CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit OTP sent to your email
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex justify-center gap-3 mb-4">
            {otp.map((data, index) => (
              <Input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(index, e.target.value)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 text-center text-lg font-bold"
              />
            ))}
          </div>

          {/* Error / Success */}
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-center text-sm">
              {successMessage}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            onClick={handleVerify}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
          <Button
            variant="outline"
            onClick={clearOtp}
            className="w-full bg-transparent"
            disabled={isLoading || isVerified}
          >
            <RotateCcw className="mr-2 w-4 h-4" />
            Clear
          </Button>

          <p className="text-center">
            Wrong email?{" "}
            <Link
              to={"/forgot-password"}
              className="hover:text-green-600 font-medium"
            >
              Go Back
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotOtp;
