import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HeartPulse, Calendar, Users, MessageSquare,
  Clock, ChevronRight, Pill, FileText, Activity,
  ArrowRight, Stethoscope, Shield, Sun, Moon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const stats = [
  { title: "Upcoming", value: 2, icon: Calendar, trend: "This week", color: "text-primary" },
  { title: "Doctors", value: 5, icon: Stethoscope, trend: "Connected", color: "text-emerald-600 dark:text-emerald-400" },
  { title: "Messages", value: 3, icon: MessageSquare, trend: "1 new", color: "text-blue-600 dark:text-blue-400" },
  { title: "Prescriptions", value: 2, icon: Pill, trend: "Active", color: "text-amber-600 dark:text-amber-400" },
];

const upcomingAppointments = [
  {
    id: "a1",
    doctor: "Dr. Ahmed Hassan",
    specialty: "Cardiology",
    date: "May 6, 2026",
    time: "10:00 AM",
    type: "In-person",
    status: "confirmed",
    initials: "AH",
  },
  {
    id: "a2",
    doctor: "Dr. Sara Mohamed",
    specialty: "Dermatology",
    date: "May 9, 2026",
    time: "2:30 PM",
    type: "Video Call",
    status: "pending",
    initials: "SM",
  },
];

const recentDoctors = [
  { id: "d1", name: "Dr. Ahmed Hassan", specialty: "Cardiology", lastVisit: "Apr 28", initials: "AH" },
  { id: "d2", name: "Dr. Nour Ali", specialty: "Neurology", lastVisit: "Apr 15", initials: "NA" },
  { id: "d3", name: "Dr. Sara Mohamed", specialty: "Dermatology", lastVisit: "Mar 30", initials: "SM" },
  { id: "d4", name: "Dr. Omar Khaled", specialty: "Orthopedics", lastVisit: "Mar 22", initials: "OK" },
];

const healthRecords = [
  { type: "Blood Test", date: "Apr 25, 2026", status: "Normal", icon: Activity },
  { type: "X-Ray Report", date: "Apr 10, 2026", status: "Reviewed", icon: FileText },
  { type: "Prescription", date: "Apr 28, 2026", status: "Active", icon: Pill },
];

const activityFeed = [
  { text: "Dr. Ahmed confirmed your appointment for May 6", time: "2h ago", dot: "bg-emerald-500" },
  { text: "New lab results available — Blood Test (Normal)", time: "1d ago", dot: "bg-primary" },
  { text: "Dr. Nour replied to your follow-up message", time: "3d ago", dot: "bg-blue-500" },
  { text: "Prescription renewed for 30 days", time: "5d ago", dot: "bg-amber-500" },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  if (!user) return null;

  const firstName = user.name.split(" ")[0];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="container mx-auto max-w-5xl px-4 py-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs font-medium border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
              Patient
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here's your health overview</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
          >
            {theme === "light" ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
          </button>
          <Button size="sm" variant="outline" className="h-8 text-sm gap-1.5" asChild>
            <Link to="/patient/appointments">
              <Calendar className="h-4 w-4" />
              Appointments
            </Link>
          </Button>
          <Button size="sm" className="h-8 text-sm gap-1.5" asChild>
            <Link to="/search-doctors">
              <Stethoscope className="h-4 w-4" />
              Find Doctor
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((s) => (
          <motion.div key={s.title} variants={fadeUp}>
            <div className="rounded-xl border bg-card p-4 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                <span className={`text-xs font-medium ${s.color}`}>{s.trend}</span>
              </div>
              <p className="text-2xl font-bold mt-3">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">

          {/* Upcoming Appointments */}
          <motion.div variants={fadeUp} className="rounded-xl border bg-card">
            <div className="px-5 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm">Upcoming Appointments</h2>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" asChild>
                <Link to="/patient/appointments">
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
            <div className="divide-y">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-secondary/40 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {apt.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{apt.doctor}</p>
                      <Badge variant="outline" className={`text-xs ${
                        apt.status === "confirmed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700/50"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-700/50"
                      }`}>
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{apt.specialty}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {apt.date}, {apt.time}</span>
                      <span className="text-primary/70">{apt.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Health Records */}
          <motion.div variants={fadeUp} className="rounded-xl border bg-card">
            <div className="px-5 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm">Recent Health Records</h2>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" asChild>
                <Link to="/patient/profile">
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
            <div className="divide-y">
              {healthRecords.map((record, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-3 hover:bg-secondary/40 transition-colors">
                  <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <record.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{record.type}</p>
                    <p className="text-xs text-muted-foreground">{record.date}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs ${
                    record.status === "Normal" || record.status === "Reviewed"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700/50"
                      : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-700/50"
                  }`}>
                    {record.status}
                  </Badge>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity */}
          <motion.div variants={fadeUp} className="rounded-xl border bg-card">
            <div className="px-5 py-3 border-b flex items-center justify-between">
              <h2 className="font-semibold text-sm">Recent activity</h2>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Updated live
              </span>
            </div>
            <div className="divide-y">
              {activityFeed.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-secondary/40 transition-colors">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">{a.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <motion.div variants={fadeUp} className="rounded-xl border bg-card">
            <div className="px-5 py-3 border-b">
              <h2 className="font-semibold text-sm">Quick actions</h2>
            </div>
            <div className="p-3 space-y-1">
              {[
                { icon: Stethoscope, label: "Find a doctor", to: "/search-doctors", desc: "Search specialists" },
                { icon: Calendar, label: "Book appointment", to: "/search-doctors", desc: "Schedule a visit" },
                { icon: MessageSquare, label: "Messages", to: "/messages", desc: "Chat with doctors" },
                { icon: HeartPulse, label: "My health", to: "/patient/profile", desc: "Medical records" },
                { icon: FileText, label: "Prescriptions", to: "/patient/profile", desc: "View medications" },
              ].map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <a.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Connected Doctors */}
          <motion.div variants={fadeUp} className="rounded-xl border bg-card">
            <div className="px-5 py-3 border-b flex items-center justify-between">
              <h2 className="font-semibold text-sm">My Doctors</h2>
              <Badge variant="outline" className="text-xs">{recentDoctors.length}</Badge>
            </div>
            <div className="p-3 space-y-1">
              {recentDoctors.map((doc) => (
                <Link
                  key={doc.id}
                  to={`/doctor/${doc.id}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors group"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {doc.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.specialty} · Last: {doc.lastVisit}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="px-3 pb-3">
              <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1.5" asChild>
                <Link to="/search-doctors">
                  <Users className="h-3.5 w-3.5" />
                  Browse all doctors
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Health Tip */}
          <motion.div variants={fadeUp} className="rounded-xl border bg-gradient-to-br from-primary/5 to-cyan-400/5 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Health Tip</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Stay hydrated! Aim for 8 glasses of water daily. Regular check-ups help catch issues early.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
