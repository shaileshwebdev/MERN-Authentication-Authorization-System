import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getData } from "@/context/userContext";
const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const { setUser } = getData();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoding, setIsLoding] = useState(false);
  const [formData, setFormData] = useState({
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
      const res = await axios.post(`${apiUrl}/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("response", res.data);

      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center gap-6">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login into your Account</h1>
        </div>

        {/* Card */}
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className=" text-2xl text-center font-bold">
              Login
            </CardTitle>
            <CardDescription>
              Login into your account to get started with Note App
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  className="text-sm font-medium text-gray-700 hover:text-green-600"
                  to={"/forgot-password"}
                >
                  Forgot Password!
                </Link>
              </div>
              <div className="relative w-80">
                <Input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" onClick={handleSubmit}>
              {isLoding ? (
                <>
                  <Loader2 className=" mr-2 h-4 w-4 animate-spin" />
                  Login into Account ..
                </>
              ) : (
                "Login"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
