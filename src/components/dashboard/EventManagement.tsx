
import { useState, useEffect } from "react";
import { Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { EventModal } from "./EventModal";
import { toast } from "@/components/ui/use-toast";

type Event = {
  id: string;
  title: string;
  date: string;
  description?: string | null;
  location?: string | null;
  max_participants?: number | null;
  status?: string | null;
  registrations_count?: number;
};

export const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // Fetch events from Supabase
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });

      if (eventsError) throw eventsError;

      // Fetch registration counts for each event
      const eventsWithRegistrations = await Promise.all(
        (eventsData || []).map(async (event) => {
          const { count, error: countError } = await supabase
            .from("registrations")
            .select("*", { count: "exact", head: true })
            .eq("event_id", event.id);

          if (countError) throw countError;

          return {
            ...event,
            registrations_count: count || 0,
          };
        })
      );

      setEvents(eventsWithRegistrations);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      toast({
        title: "Failed to Load Events",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEditEvent = (eventId: string) => {
    console.log("Edit event:", eventId);
    // Implement edit functionality in the future
    toast({
      title: "Edit Event",
      description: "Edit functionality will be implemented in a future update.",
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Events Management</h3>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} /> Add New Event
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow-sm border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Registrations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">Loading events...</TableCell>
                  </TableRow>
                ) : events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">No events found. Create your first event!</TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{formatDate(event.date)}</TableCell>
                      <TableCell>
                        {event.registrations_count} {event.max_participants ? `/ ${event.max_participants}` : ""}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            event.status === "active" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : event.status === "completed"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }
                        >
                          {event.status === "active" ? "Active" : 
                           event.status === "completed" ? "Completed" : "Planning"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-amura-purple"
                          onClick={() => handleEditEvent(event.id)}
                        >
                          <Edit size={16} className="mr-1" /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onEventAdded={fetchEvents} 
      />
    </div>
  );
};
