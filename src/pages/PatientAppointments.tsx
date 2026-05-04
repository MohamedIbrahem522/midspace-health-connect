import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar, Clock, MapPin, Stethoscope, Video,
  CheckCircle2, XCircle, AlertCircle, ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" } }),
};

const appointments = [
  {
    id: "a1",
    doctor: "Dr. Ahmed Hassan",
    specialty: "Cardiology",
    initials: "AH",
    date: "May 6, 2026",
    time: "10:00 AM",
    duration: "30 min",
    type: "In-person",
    location: "Cairo Medical Center, Room 204",
    status: "confirmed",
    notes: "Follow-up on blood pressure",
  },
  {
    id: "a2",
    doctor: "Dr. Sara Mohamed",
    specialty: "Dermatology",
    initials: "SM",
    date: "May 9, 2026",
    time: "2:30 PM",
    duration: "20 min",
    type: "Video Call",
    location: "Online",
    status: "pending",
    notes: "Skin rash consultation",
  },
  {
    id: "a3",
    doctor: "Dr. Omar Khaled",
    specialty: "Orthopedics",
    initials: "OK",
    date: "May 15, 2026",
    time: "11:00 AM",
    duration: "45 min",
    type: "In-person",
    location: "Giza Hospital, Clinic 5",
    status: "confirmed",
    notes: "Knee pain evaluation",
  },
  {
    id: "a4",
    doctor: "Dr. Ahmed Hassan",
    specialty: "Cardiology",
    initials: "AH",
    date: "Apr 28, 2026",
    time: "10:00 AM",
    duration: "30 min",
    type: "In-person",
    location: "Cairo Medical Center, Room 204",
    status: "completed",
    notes: "Regular check-up, all good",
  },
  {
    id: "a5",
    doctor: "Dr. Nour Ali",
    specialty: "Neurology",
    initials: "NA",
    date: "Apr 15, 2026",
    time: "3:00 PM",
    duration: "45 min",
    type: "In-person",
    location: "Nile Clinic, Floor 3",
    status: "completed",
    notes: "Headache assessment",
  },
  {
    id: "a6",
    doctor: "Dr. Sara Mohamed",
    specialty: "Dermatology",
    initials: "SM",
    date: "Mar 30, 2026",
    time: "1:00 PM",
    duration: "20 min",
    type: "Video Call",
    location: "Online",
    status: "cancelled",
    notes: "Rescheduled to May 9",
  },
];

const statusConfig = {
  confirmed: { label: "Confirmed", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700/50" },
  pending: { label: "Pending", icon: AlertCircle, className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-700/50" },
  completed: { label: "Completed", icon: CheckCircle2, className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-700/50" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-700/50" },
};

export default function PatientAppointments() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");

  const now = new Date();
  const filtered = appointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    if (filter === "upcoming") return aptDate >= now && apt.status !== "cancelled";
    if (filter === "past") return aptDate < now || apt.status === "cancelled";
    return true;
  });

  const counts = {
    all: appointments.length,
    upcoming: appointments.filter(a => { const d = new Date(a.date); return d >= now && a.status !== "cancelled"; }).length,
    past: appointments.filter(a => { const d = new Date(a.date); return d < now || a.status === "cancelled"; }).length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-5xl px-4 h-14 flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary" />
          <h1 className="font-semibold">Appointments</h1>
          <span className="text-xs text-muted-foreground ml-auto">{counts.all} total</span>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-5">
        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/50 mb-5">
          {(["upcoming", "past", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                filter === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "all" ? "All" : tab === "upcoming" ? "Upcoming" : "Past"}
              <span className="text-muted-foreground/70 ml-1">({counts[tab]})</span>
            </button>
          ))}
        </div>

        {/* Appointments List */}
        <motion.div className="space-y-3">
          {filtered.map((apt, i) => {
            const config = statusConfig[apt.status];
            const StatusIcon = config.icon;
            const isUpcoming = new Date(apt.date) >= now && apt.status !== "cancelled";

            return (
              <motion.div
                key={apt.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className={`rounded-xl border bg-card p-5 transition-all duration-200 ${
                  isUpcoming ? "hover:border-primary/30 hover:shadow-sm" : "opacity-80"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Doctor avatar */}
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                    apt.status === "completed"
                      ? "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                      : apt.status === "cancelled"
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {apt.initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{apt.doctor}</h3>
                          <Badge variant="outline" className={`text-xs gap-1 ${config.className}`}>
                            <StatusIcon className="h-3 w-3" />
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Stethoscope className="h-3 w-3" />
                          {apt.specialty}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> {apt.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {apt.time} ({apt.duration})
                      </span>
                      <span className="flex items-center gap-1.5">
                        {apt.type === "Video Call" ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                        {apt.type} · {apt.location}
                      </span>
                    </div>

                    {/* Notes */}
                    {apt.notes && (
                      <p className="text-xs text-muted-foreground mt-2.5 p-2 rounded-lg bg-muted/50">
                        {apt.notes}
                      </p>
                    )}

                    {/* Actions for upcoming */}
                    {isUpcoming && (
                      <div className="flex items-center gap-2 mt-3">
                        {apt.status === "confirmed" && (
                          <>
                            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                              <Video className="h-3.5 w-3.5" />
                              Join Call
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              Reschedule
                            </Button>
                          </>
                        )}
                        {apt.status === "pending" && (
                          <>
                            <Button size="sm" className="h-8 text-xs gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Confirm
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 text-destructive hover:bg-destructive/10">
                              <XCircle className="h-3.5 w-3.5" />
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    )}

                    {apt.status === "completed" && (
                      <div className="mt-3">
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5">
                          View Summary <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Calendar className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <h3 className="font-medium text-muted-foreground">
              {filter === "upcoming" ? "No upcoming appointments" : filter === "past" ? "No past appointments" : "No appointments"}
            </h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {filter === "upcoming" ? "Book your next appointment" : "Your appointment history will appear here"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
