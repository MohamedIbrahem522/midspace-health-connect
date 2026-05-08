import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar, Clock, MapPin, Stethoscope, Video,
  CheckCircle2, XCircle, AlertCircle, ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/services/api";

interface Appointment {
  id: number;
  doctorName?: string;
  patientName?: string;
  specialty?: string;
  dateTime: string;
  status: string;
  notes?: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" } }),
};

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  Confirmed: { label: "Confirmed", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700/50" },
  Pending: { label: "Pending", icon: AlertCircle, className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-700/50" },
  Completed: { label: "Completed", icon: CheckCircle2, className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-700/50" },
  Cancelled: { label: "Cancelled", icon: XCircle, className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-700/50" },
};

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments/my");
        setAppointments(res.data);
      } catch {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const now = new Date();
  const filtered = appointments.filter((apt) => {
    const aptDate = new Date(apt.dateTime);
    if (filter === "upcoming") return aptDate >= now && apt.status !== "Cancelled";
    if (filter === "past") return aptDate < now || apt.status === "Cancelled";
    return true;
  });

  const counts = {
    all: appointments.length,
    upcoming: appointments.filter(a => { const d = new Date(a.dateTime); return d >= now && a.status !== "Cancelled"; }).length,
    past: appointments.filter(a => { const d = new Date(a.dateTime); return d < now || a.status === "Cancelled"; }).length,
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading appointments...</div>;

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
            const config = statusConfig[apt.status] ?? statusConfig.Pending;
            const StatusIcon = config.icon;
            const aptDate = new Date(apt.dateTime);
            const isUpcoming = aptDate >= now && apt.status !== "Cancelled";
            const dateStr = aptDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const timeStr = aptDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const initials = apt.doctorName?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() ?? "??";

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
                    apt.status === "Completed"
                      ? "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                      : apt.status === "Cancelled"
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{apt.doctorName || apt.patientName}</h3>
                          <Badge variant="outline" className={`text-xs gap-1 ${config.className}`}>
                            <StatusIcon className="h-3 w-3" />
                            {config.label}
                          </Badge>
                        </div>
                        {apt.specialty && (
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Stethoscope className="h-3 w-3" />
                            {apt.specialty}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> {dateStr}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {timeStr}
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
                        {apt.status === "Confirmed" && (
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
                        {apt.status === "Pending" && (
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

                    {apt.status === "Completed" && (
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
