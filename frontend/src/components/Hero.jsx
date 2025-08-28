import { Button } from "@/components/ui/button";
import { getData } from "@/context/userContext";
import { Eye, LockOpen, NotepadTextIcon, WatchIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const { user } = getData();
  return (
    <section className="bg-gray-50 min-h-[90vh] flex items-center justify-center text-center">
      <div className="max-w-3xl px-6">
        <h1 className=" text-2xl font-bold text-gray-600">
          Welcome {user.username}
        </h1>
        <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
          Organize Your Notes with{" "}
          <span className="text-green-600">NoteApp</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          Save, manage, and access your notes anytime, anywhere. Stay productive
          and never lose your ideas again!
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/signup">
              <NotepadTextIcon />
              Get Started
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/demo">
              <Eye />
              Demo
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
