import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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
const apiUrl = import.meta.env.VITE_API_URL;

export default function ChangePassword() {
  const { email } = useParams(); // email from URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${apiUrl}/change-password/${email}`, {
        newPassword,
        confirmPassword,
      });
      setSuccess(response.data.message || "Password changed successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to change password. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Set a strong password for{" "}
            <span className="font-medium">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            onClick={handleChangePassword}
            disabled={isLoading}
          >
            {isLoading ? "Changing..." : "Change Password"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
