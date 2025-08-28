import { Button } from "@/components/ui/button";
import { BookA, BookOpen, IndianRupee, LogOut, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { getData } from "@/context/userContext";
import axios from "axios";
import { toast } from "sonner";

const Navbar = () => {
  const { user, setUser } = getData();
  const accessToken = localStorage.getItem("accessToken");
  console.log("access token", accessToken);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.data.success) {
        setUser(null);
        toast.success(res.data.message);
        localStorage.removeItem("accessToken");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <nav className="border-b bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo Left */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-green-600"
          >
            <BookOpen className="h-6 w-6" />
            <span>Note App</span>
          </Link>
        </div>

        {/* Links / Avatar - Right */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-green-600"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-gray-600 hover:text-green-600"
          >
            About
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>
                  <User2 /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IndianRupee /> Pricing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookA /> Notes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logoutHandler}>
                  <LogOut /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-green-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
