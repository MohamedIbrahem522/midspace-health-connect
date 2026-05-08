import { useState, useEffect } from "react";
import { Users, Briefcase, Activity, ShieldCheck, Stethoscope, Building2, User, TrendingUp, Calendar, MessageSquare, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/services/api";

interface StatItem {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

interface ActivityItem {
  text: string;
  time: string;
  color: string;
}

const iconMap: Record<string, typeof Users> = {
  "Total users": Users,
  "Doctors": Stethoscope,
  "Patients": User,
  "Hospitals": Building2,
  "Open jobs": Briefcase,
  "Applications": TrendingUp,
  "Appointments": Calendar,
  "Messages": MessageSquare,
};

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.05, ease: "easeOut" } }),
};

export default function AdminInsights() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data.stats || []);
      setActivity(res.data.recentActivity || []);
    } catch {
      // fallback to empty
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading insights...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <motion.div
              initial="hidden"
              animate="visible"
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-5"
            >
              {stats.map((s, i) => {
                const Icon = iconMap[s.title] || Activity;
                return (
                  <motion.div
                    key={s.title}
                    custom={i}
                    variants={fadeInUp}
                    className="rounded-xl border bg-card p-4 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      {s.trend && (
                        <span className={`text-xs font-medium flex items-center gap-0.5 ${s.trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                          {s.trend}
                          {s.trendUp && <ArrowUpRight className="h-3 w-3" />}
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold mt-3">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.title}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border bg-card p-5"
            >
              <h2 className="font-semibold text-sm mb-4">Recent System Activity</h2>
              {activity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              ) : (
                <div className="space-y-3">
                  {activity.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 py-2">
                      <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${a.color || "bg-muted-foreground"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{a.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
