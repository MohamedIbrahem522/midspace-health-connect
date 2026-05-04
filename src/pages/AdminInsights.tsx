import { Users, Briefcase, Activity, ShieldCheck, Stethoscope, Building2, User, TrendingUp, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { title: "Total Users", value: "12,458", icon: Users, trend: "+342", up: true },
  { title: "Active Doctors", value: "3,241", icon: Stethoscope, trend: "+86", up: true },
  { title: "Registered Hospitals", value: "512", icon: Building2, trend: "+12", up: true },
  { title: "Active Patients", value: "8,705", icon: User, trend: "+244", up: true },
  { title: "Open Jobs", value: "189", icon: Briefcase, trend: "+23", up: true },
  { title: "Applications", value: "1,847", icon: TrendingUp, trend: "+156", up: true },
  { title: "System Health", value: "99.9%", icon: Activity, trend: "Stable", up: null },
  { title: "Security Score", value: "A+", icon: ShieldCheck, trend: "Excellent", up: null },
];

const recentActivity = [
  { text: "Dr. Sarah Chen registered as a new doctor", time: "2 min ago", type: "user" },
  { text: "Mount Sinai Hospital posted 3 new jobs", time: "15 min ago", type: "job" },
  { text: "15 new patient registrations today", time: "1 hour ago", type: "patient" },
  { text: "System backup completed successfully", time: "3 hours ago", type: "system" },
  { text: "Security scan passed — no vulnerabilities", time: "6 hours ago", type: "system" },
  { text: "New hospital application pending review", time: "8 hours ago", type: "hospital" },
];

const typeColors: Record<string, string> = {
  user: "bg-blue-500",
  job: "bg-emerald-500",
  patient: "bg-amber-500",
  system: "bg-gray-400",
  hospital: "bg-purple-500",
};

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.05, ease: "easeOut" } }),
};

export default function AdminInsights() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
          <Activity className="h-5 w-5 text-primary" />
          <h1 className="font-semibold">System Insights</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-5">
        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-5"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.title}
              custom={i}
              variants={fadeInUp}
              className="rounded-xl border bg-card p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="h-4 w-4 text-primary" />
                </div>
                {s.up !== null && (
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${s.up ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                    {s.trend}
                    {s.up && <ArrowUpRight className="h-3 w-3" />}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold mt-3">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border bg-card p-5"
        >
          <h2 className="font-semibold text-sm mb-4">Recent System Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${typeColors[a.type] || "bg-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
