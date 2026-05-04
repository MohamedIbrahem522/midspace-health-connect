import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, CheckCircle2, XCircle, Eye, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const initialApplications = [
  { id: "a1", jobTitle: "Senior Cardiologist", hospital: "Mount Sinai Hospital", location: "New York", appliedDate: "2026-04-10", status: "pending" as const, type: "Full-time" },
  { id: "a2", jobTitle: "ER Physician", hospital: "Chicago General", location: "Chicago", appliedDate: "2026-04-08", status: "accepted" as const, type: "Full-time" },
  { id: "a3", jobTitle: "Pediatric Neurologist", hospital: "Boston Children's", location: "Boston", appliedDate: "2026-04-05", status: "rejected" as const, type: "Part-time" },
  { id: "a4", jobTitle: "Dermatologist", hospital: "UCSF Medical Center", location: "San Francisco", appliedDate: "2026-04-12", status: "pending" as const, type: "Remote" },
  { id: "a5", jobTitle: "Orthopedic Surgeon", hospital: "Mayo Clinic", location: "Rochester", appliedDate: "2026-04-14", status: "pending" as const, type: "Full-time" },
];

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-700/50" },
  accepted: { label: "Accepted", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700/50" },
  rejected: { label: "Rejected", icon: XCircle, className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-700/50" },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" } }),
};

export default function MyApplications() {
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  const filtered = filter === "all" ? initialApplications : initialApplications.filter(a => a.status === filter);
  const counts = {
    all: initialApplications.length,
    pending: initialApplications.filter(a => a.status === "pending").length,
    accepted: initialApplications.filter(a => a.status === "accepted").length,
    rejected: initialApplications.filter(a => a.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-5xl px-4 h-14 flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-primary" />
          <h1 className="font-semibold">My Applications</h1>
          <span className="text-xs text-muted-foreground ml-auto">{counts.all} total</span>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-5">
        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/50 mb-5 overflow-x-auto">
          {(["all", "pending", "accepted", "rejected"] as const).map((tab) => {
            const Config = statusConfig[tab === "all" ? "pending" : tab];
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  filter === tab
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab !== "all" && <Config.icon className="h-3.5 w-3.5" />}
                {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="text-muted-foreground/70">({counts[tab]})</span>
              </button>
            );
          })}
        </div>

        {/* List */}
        <motion.div className="space-y-2.5">
          {filtered.map((app, i) => {
            const config = statusConfig[app.status];
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={app.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                layout
                className="group rounded-xl border bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm">{app.jobTitle}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{app.hospital}</p>
                      </div>
                      <Badge variant="outline" className={`gap-1 text-xs shrink-0 ${config.className}`}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {app.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Applied {app.appliedDate}</span>
                    </div>

                    {app.status === "accepted" && (
                      <div className="mt-3 flex items-center gap-1.5 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/30">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          Congratulations! Next step: Interview scheduling
                        </span>
                      </div>
                    )}
                  </div>

                  <button className="shrink-0 h-8 w-8 rounded-lg border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Briefcase className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <h3 className="font-medium text-muted-foreground">No {filter === "all" ? "" : filter} applications</h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {filter === "all" ? "Start by browsing available jobs" : `No ${filter} applications yet`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
