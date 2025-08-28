import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PageNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[400px] text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-red-500">404</CardTitle>
          <CardDescription>
            Oops! The page you’re looking for doesn’t exist.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link to="/">Go Back Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
