
import { User } from "@supabase/supabase-js";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departments, years } from "./constants";

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

interface FormInputsProps {
  formData: FormData;
  errors: FormErrors;
  events: Event[];
  eventsLoading: boolean;
  authenticated: boolean;
  user: User | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function FormInputs({
  formData,
  errors,
  events,
  eventsLoading,
  authenticated,
  user,
  handleChange,
  handleSelectChange,
}: FormInputsProps) {
  return (
    <>
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
          disabled={!authenticated}
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
          disabled={!authenticated}
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
          readOnly={!!user?.email}
          disabled={!authenticated}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* Department */}
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select
          value={formData.department}
          onValueChange={(value) => handleSelectChange("department", value)}
          disabled={!authenticated}
        >
          <SelectTrigger className={errors.department ? "border-red-500" : ""}>
            <SelectValue placeholder="Select your department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.department && (
          <p className="text-red-500 text-sm">{errors.department}</p>
        )}
      </div>

      {/* Year */}
      <div className="space-y-2">
        <Label htmlFor="year">Year of Study</Label>
        <Select
          value={formData.year}
          onValueChange={(value) => handleSelectChange("year", value)}
          disabled={!authenticated}
        >
          <SelectTrigger className={errors.year ? "border-red-500" : ""}>
            <SelectValue placeholder="Select your year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
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
          disabled={eventsLoading || !authenticated}
          onValueChange={(value) => handleSelectChange("eventId", value)}
        >
          <SelectTrigger className={errors.eventId ? "border-red-500" : ""}>
            <SelectValue
              placeholder={
                eventsLoading
                  ? "Loading events..."
                  : "Choose an event to attend"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.eventId && (
          <p className="text-red-500 text-sm">{errors.eventId}</p>
        )}
        {events.length === 0 && !eventsLoading && (
          <p className="text-sm text-gray-500">
            No events available for registration.
          </p>
        )}
      </div>
    </>
  );
}
