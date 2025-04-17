
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Mock data for events
const events = [
  { id: 1, title: "Web Development Workshop" },
  { id: 2, title: "AI & Machine Learning Hackathon" },
  { id: 3, title: "Mobile App Development Series" },
  { id: 4, title: "Cybersecurity Workshop" }
];

// Mock data for departments
const departments = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology"
];

// Mock data for years
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"];

export default function RegisterPage() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    usn: "",
    email: "",
    department: "",
    year: "",
    eventId: ""
  });
  
  const [errors, setErrors] = useState({
    name: "",
    usn: "",
    email: "",
    department: "",
    year: "",
    eventId: ""
  });

  useEffect(() => {
    // Check if there's an event ID in the URL params
    const params = new URLSearchParams(location.search);
    const eventId = params.get("event");
    if (eventId) {
      setFormData(prev => ({ ...prev, eventId }));
    }
  }, [location.search]);

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
    } else if (!/^\d{1}\w{2}\d{2}\w{2}\d{3}$/i.test(formData.usn.trim())) {
      newErrors.usn = "USN format not valid";
      valid = false;
    } else {
      newErrors.usn = "";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you would send the data to a server here
      console.log("Form data submitted:", formData);
      
      // Show success toast
      toast({
        title: "Registration Successful!",
        description: "You have successfully registered for the event.",
      });
      
      // Reset form
      setFormData({
        name: "",
        usn: "",
        email: "",
        department: "",
        year: "",
        eventId: ""
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Register for an Event</h1>
          <p className="mt-3 text-xl text-gray-600 dark:text-gray-300">
            Join our workshops and events by filling out the form below
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle>Student Registration</CardTitle>
              <CardDescription>Please fill in all the required fields.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                
                {/* USN */}
                <div className="space-y-2">
                  <Label htmlFor="usn">University Seat Number (USN)</Label>
                  <Input 
                    id="usn"
                    name="usn"
                    placeholder="e.g., 1AB21CS001"
                    value={formData.usn}
                    onChange={handleChange}
                    className={errors.usn ? "border-red-500" : ""}
                  />
                  {errors.usn && <p className="text-red-500 text-sm">{errors.usn}</p>}
                </div>
                
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                
                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                </div>
                
                {/* Year */}
                <div className="space-y-2">
                  <Label htmlFor="year">Year of Study</Label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => handleSelectChange("year", value)}
                  >
                    <SelectTrigger className={errors.year ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
                </div>
                
                {/* Event Selection */}
                <div className="space-y-2">
                  <Label htmlFor="event">Select Event/Workshop</Label>
                  <Select
                    value={formData.eventId}
                    onValueChange={(value) => handleSelectChange("eventId", value)}
                  >
                    <SelectTrigger className={errors.eventId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Choose an event to attend" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map(event => (
                        <SelectItem key={event.id} value={event.id.toString()}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.eventId && <p className="text-red-500 text-sm">{errors.eventId}</p>}
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className="w-full btn-primary" onClick={handleSubmit}>
                Register Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
