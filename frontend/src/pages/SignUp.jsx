import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoding, setIsLoding] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoding(true);
      console.log(formData);
      const res = await axios.post(`${apiUrl}/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        navigate(`/verify/${res.data.token}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error.res?.data);
    } finally {
      setIsLoding(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center gap-6">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create Your Account</h1>
      </div>

      {/* Card */}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className=" text-2xl text-center font-bold">
            Sign Up
          </CardTitle>
          <CardDescription>
            Create your account to get started with Note App
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                name="username"
                value={formData.username}
                onChange={handleChange}
                type="text"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative w-80">
                <Input
                  id="password"
                  name="password"
                  placeholder="Create your password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            {isLoding ? (
              <>
                <Loader2 className=" mr-2 h-4 w-4 animate-spin" />
                Creating Account ..
              </>
            ) : (
              "SignUp"
            )}
          </Button>
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
