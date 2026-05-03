import StatCard from "@/components/StatCard";
import { Users, Briefcase, Activity, ShieldCheck, Stethoscope, Building2, User, TrendingUp } from "lucide-react";

const stats = [
  { title: "Total Users", value: "12,458", icon: Users, trend: "+342 this month" },
  { title: "Active Doctors", value: "3,241", icon: Stethoscope, trend: "+86 this month" },
  { title: "Registered Hospitals", value: "512", icon: Building2, trend: "+12 this month" },
  { title: "Active Patients", value: "8,705", icon: User, trend: "+244 this month" },
  { title: "Open Jobs", value: "189", icon: Briefcase, trend: "+23 this week" },
  { title: "Applications", value: "1,847", icon: TrendingUp, trend: "+156 this week" },
  { title: "System Health", value: "99.9%", icon: Activity },
  { title: "Security Score", value: "A+", icon: ShieldCheck },
];

const recentActivity = [
  "Dr. Sarah Chen registered as a new doctor",
  "Mount Sinai Hospital posted 3 new jobs",
  "15 new patient registrations today",
  "System backup completed successfully",
  "Security scan passed — no vulnerabilities found",
];

export default function AdminInsights() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">System Insights</h1>
      <p className="mt-1 text-muted-foreground">Platform metrics and system health overview</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="mt-8 rounded-2xl border bg-card p-6 card-shadow">
        <h2 className="text-lg font-semibold">Recent System Activity</h2>
        <div className="mt-4 space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-primary" />
              {a}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
