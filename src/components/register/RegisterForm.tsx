import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInputs } from "./FormInputs";
import { User } from "@supabase/supabase-js";

type FormData = {
  name: string;
  usn: string;
  email: string;
  department: string;
  year: string;
  eventId: string;
};

type FormErrors = {
  name: string;
  usn: string;
  email: string;
  department: string;
  year: string;
  eventId: string;
};

type Event = {
  id: string;
  title: string;
  date: string;
  description?: string | null;
  [key: string]: unknown;
};

interface RegisterFormProps {
  user: any; // Change from User to any to fix type error
  authenticated: boolean;
  userIsAdmin: boolean;
  events: Event[];
  eventsLoading: boolean;
}

export function RegisterForm({ user, authenticated, userIsAdmin, events, eventsLoading }: RegisterFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    usn: "",
    email: user?.email || "",
    department: "",
    year: "",
    eventId: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    usn: "",
    email: "",
    department: "",
    year: "",
    eventId: "",
  });

  const [formLoading, setFormLoading] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    } else {
      newErrors.name = "";
    }

    if (!formData.usn.trim()) {
      newErrors.usn = "USN is required";
      valid = false;
    } else if (
      !/^\d{1}\w{2}\d{2}\w{2}\d{3}$/i.test(formData.usn.trim())
    ) {
      newErrors.usn = "USN format not valid";
      valid = false;
    } else {
      newErrors.usn = "";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Email format not valid";
      valid = false;
    } else {
      newErrors.email = "";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
      valid = false;
    } else {
      newErrors.department = "";
    }

    if (!formData.year) {
      newErrors.year = "Year is required";
      valid = false;
    } else {
      newErrors.year = "";
    }

    if (!formData.eventId) {
      newErrors.eventId = "Event selection is required";
      valid = false;
    } else {
      newErrors.eventId = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (formLoading) return;
    if (!validateForm()) return;

    // Check authentication
    if (!authenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in before registering for events.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setFormLoading(true);

    try {
      let userId = user?.id;
      
      // If admin user, generate a random user ID
      if (userIsAdmin) {
        userId = crypto.randomUUID();
      }

      console.log("Submitting registration with user ID:", userId);

      // Insert registration in Supabase
      const { error } = await supabase.from("registrations").insert([
        {
          event_id: formData.eventId,
          user_id: userId,
          name: formData.name.trim(),
          email: formData.email.trim(),
          usn: formData.usn.trim().toUpperCase(),
          department: formData.department,
          year: formData.year,
        },
      ]);

      if (error) {
        console.error("Registration error:", error);
        throw error;
      }

      toast({
        title: "Registration Successful!",
        description: "You have successfully registered for the event.",
      });

      // Log this activity
      await supabase.from("activity_logs").insert([
        {
          user_id: userId,
          activity_type: "event_registration",
          description: `Registered for event`,
        },
      ]);

      setFormData({
        name: "",
        usn: "",
        email: user?.email || "",
        department: "",
        year: "",
        eventId: "",
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description:
          error.message ??
          "Could not register. You may already be registered or there is a server error.",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {!authenticated && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please <Button variant="link" onClick={() => navigate("/auth")} className="p-0">log in</Button> to register for events.
          </AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Student Registration</CardTitle>
          <CardDescription>
            Please fill in all the required fields.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormInputs 
              formData={formData}
              errors={errors}
              events={events}
              eventsLoading={eventsLoading}
              authenticated={authenticated}
              user={user}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
            />
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full btn-primary"
            disabled={formLoading || !authenticated}
            onClick={handleSubmit}
          >
            {formLoading ? "Registering..." : "Register Now"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
