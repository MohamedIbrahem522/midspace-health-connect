import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HeartPulse, Pill, FileText, Droplets, Eye, Scale,
  AlertTriangle, Activity, Calendar, Edit, Shield,
  Clock, User, MapPin, Phone, Mail,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function PatientProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "records" | "medications" | "allergies">("overview");

  if (!user) return null;

  const patient = {
    name: user.name,
    email: user.email,
    phone: "+20 123 456 7890",
    location: "Cairo, Egypt",
    dob: "Mar 15, 1995",
    bloodType: "A+",
    gender: "Male",
    height: "175 cm",
    weight: "78 kg",
    bmi: "25.5",

    conditions: ["Mild Hypertension", "Seasonal Allergies"],
    allergies: ["Penicillin", "Peanuts", "Dust"],
    medications: [
      { name: "Amlodipine 5mg", dosage: "Once daily", prescribed: "Dr. Ahmed Hassan", startDate: "Jan 15, 2026", status: "active" },
      { name: "Cetirizine 10mg", dosage: "As needed", prescribed: "Dr. Sara Mohamed", startDate: "Mar 1, 2026", status: "active" },
      { name: "Vitamin D3", dosage: "5000 IU weekly", prescribed: "Dr. Omar Khaled", startDate: "Feb 10, 2026", status: "active" },
    ],
    records: [
      { type: "Blood Test", date: "Apr 25, 2026", doctor: "Dr. Ahmed Hassan", status: "Normal", details: "All values within normal range" },
      { type: "X-Ray Chest", date: "Apr 10, 2026", doctor: "Dr. Omar Khaled", status: "Reviewed", details: "No abnormalities detected" },
      { type: "ECG", date: "Mar 20, 2026", doctor: "Dr. Ahmed Hassan", status: "Normal", details: "Regular sinus rhythm" },
      { type: "Blood Pressure Log", date: "Mar 15, 2026", doctor: "Dr. Ahmed Hassan", status: "Monitored", details: "Average: 130/85 mmHg" },
    ],
    appointments: { total: 12, upcoming: 2, completed: 10, cancelled: 0 },
    lastVisit: "Apr 28, 2026",
  };

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: User },
    { id: "records" as const, label: "Records", icon: FileText },
    { id: "medications" as const, label: "Medications", icon: Pill },
    { id: "allergies" as const, label: "Allergies", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-primary" />
            <h1 className="font-semibold">My Health</h1>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Edit className="h-3.5 w-3.5" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-6">
        <motion.div initial="hidden" animate="visible" variants={stagger}>

          {/* Profile Header */}
          <motion.div variants={fadeInUp} className="rounded-xl border bg-card overflow-hidden mb-5">
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-amber-400/15" />
            <div className="px-5 pb-5 -mt-12">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="h-24 w-24 rounded-xl border-4 border-background bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shrink-0">
                  {patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 pt-10 sm:pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h2 className="text-xl font-bold">{patient.name}</h2>
                      <p className="text-sm text-muted-foreground">Patient since 2024</p>
                    </div>
                    <Badge variant="outline" className="text-xs gap-1 border-primary/30 bg-primary/10 text-primary shrink-0">
                      <Shield className="h-3 w-3" />
                      Verified
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {patient.location}</span>
                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {patient.email}</span>
                    <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {patient.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { label: "Appointments", value: patient.appointments.total, icon: Calendar },
              { label: "Upcoming", value: patient.appointments.upcoming, icon: Clock },
              { label: "Doctors", value: 5, icon: User },
              { label: "Active Meds", value: patient.medications.length, icon: Pill },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border bg-card p-4">
                <div className="flex items-center gap-2">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-muted/50 mb-5 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-4">
              {/* Vitals */}
              <div className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Vitals
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Blood Type", value: patient.bloodType, icon: Droplets, color: "text-red-500" },
                    { label: "Height", value: patient.height, icon: Scale, color: "text-blue-500" },
                    { label: "Weight", value: patient.weight, icon: Scale, color: "text-emerald-500" },
                    { label: "BMI", value: patient.bmi, icon: Activity, color: "text-amber-500" },
                  ].map((vital) => (
                    <div key={vital.label} className="rounded-lg bg-muted/50 p-3">
                      <vital.icon className={`h-4 w-4 ${vital.color} mb-2`} />
                      <p className="text-lg font-bold">{vital.value}</p>
                      <p className="text-xs text-muted-foreground">{vital.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Info */}
              <div className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Personal Info
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Full Name", value: patient.name },
                    { label: "Date of Birth", value: patient.dob },
                    { label: "Gender", value: patient.gender },
                    { label: "Email", value: patient.email },
                    { label: "Phone", value: patient.phone },
                    { label: "Location", value: patient.location },
                  ].map((info) => (
                    <div key={info.label} className="flex justify-between py-2 border-b border-border/30 last:border-0">
                      <span className="text-xs text-muted-foreground">{info.label}</span>
                      <span className="text-sm font-medium">{info.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conditions */}
              <div className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-primary" />
                  Active Conditions
                </h3>
                <div className="space-y-2.5">
                  {patient.conditions.map((condition) => (
                    <div key={condition} className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="text-sm">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Summary */}
              <div className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Appointment Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Total</span>
                    <span className="text-sm font-bold">{patient.appointments.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Completed</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{patient.appointments.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Upcoming</span>
                    <span className="text-sm font-bold text-primary">{patient.appointments.upcoming}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Cancelled</span>
                    <span className="text-sm font-bold text-muted-foreground">{patient.appointments.cancelled}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-xs text-muted-foreground">Last visit</span>
                    <p className="text-sm font-medium mt-0.5">{patient.lastVisit}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "records" && (
            <motion.div variants={fadeInUp} className="space-y-3">
              {patient.records.map((record, i) => (
                <div key={i} className="rounded-xl border bg-card p-5 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-sm">{record.type}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{record.doctor} · {record.date}</p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">{record.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">{record.details}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 shrink-0">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "medications" && (
            <motion.div variants={fadeInUp} className="space-y-3">
              {patient.medications.map((med, i) => (
                <div key={i} className="rounded-xl border bg-card p-5 hover:border-primary/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Pill className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-sm">{med.name}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{med.dosage} · Prescribed by {med.prescribed}</p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700/50">
                          {med.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Started {med.startDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "allergies" && (
            <motion.div variants={fadeInUp} className="space-y-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800/30 dark:bg-amber-950/20 p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Important: Allergy Information</h4>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Make sure to inform your doctor about these allergies before any treatment.</p>
                </div>
              </div>
              {patient.allergies.map((allergy, i) => (
                <div key={i} className="rounded-xl border bg-card p-5 flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-red-100 dark:bg-red-950/30 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{allergy}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Documented allergy</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
