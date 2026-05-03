import { useAuth } from "@/contexts/AuthContext";
import StatCard from "@/components/StatCard";
import { Briefcase, MessageSquare, Users, Star, Building2, FileText, UserCheck, ClipboardList, Activity, ShieldCheck, Stethoscope, User, TrendingUp, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const doctorStats = [
  { title: "Applications Sent", value: 8, icon: Briefcase, trend: "+2 this week" },
  { title: "Messages", value: 12, icon: MessageSquare, trend: "3 unread" },
  { title: "Profile Views", value: 156, icon: Users, trend: "+24% this month" },
  { title: "Rating", value: "4.8", icon: Star },
];

const hospitalStats = [
  { title: "Active Listings", value: 5, icon: ClipboardList, trend: "2 new this week" },
  { title: "Total Applicants", value: 47, icon: UserCheck, trend: "+12 this week" },
  { title: "Messages", value: 18, icon: MessageSquare, trend: "5 unread" },
  { title: "Hired This Month", value: 3, icon: FileText },
];

const patientStats = [
  { title: "Doctors Found", value: 24, icon: Users },
  { title: "Appointments", value: 3, icon: ClipboardList, trend: "1 upcoming" },
  { title: "Messages", value: 5, icon: MessageSquare, trend: "1 unread" },
  { title: "Saved Doctors", value: 8, icon: Star },
];

const adminStats = [
  { title: "Total Users", value: "12,458", icon: Users, trend: "+342 this month" },
  { title: "Active Doctors", value: "3,241", icon: Stethoscope, trend: "+86" },
  { title: "Open Jobs", value: 189, icon: Briefcase, trend: "+23 this week" },
  { title: "System Health", value: "99.9%", icon: Activity },
];

const statsMap = { doctor: doctorStats, hospital: hospitalStats, patient: patientStats, admin: adminStats };
const greetingMap = { doctor: "Doctor", hospital: "Hospital Admin", patient: "Patient", admin: "System Admin" };

const quickActionsMap = {
  doctor: [
    { icon: Briefcase, label: "Browse Jobs", to: "/jobs" },
    { icon: MessageSquare, label: "Messages", to: "/messages" },
    { icon: ClipboardList, label: "Applications", to: "/my-applications" },
    { icon: UserCheck, label: "Profile", to: "/profile" },
  ],
  hospital: [
    { icon: PlusCircle, label: "Post Job", to: "/post-job" },
    { icon: ClipboardList, label: "Manage Jobs", to: "/manage-jobs" },
    { icon: UserCheck, label: "Applicants", to: "/applicants" },
    { icon: Users, label: "Doctor Directory", to: "/doctor-directory" },
  ],
  patient: [
    { icon: Users, label: "Find Doctors", to: "/search-doctors" },
    { icon: MessageSquare, label: "Messages", to: "/messages" },
  ],
  admin: [
    { icon: Users, label: "Users", to: "/admin/users" },
    { icon: Activity, label: "Insights", to: "/admin/insights" },
  ],
};


export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const stats = statsMap[user.role];
  const quickActions = quickActionsMap[user.role];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
        <p className="mt-1 text-muted-foreground">{greetingMap[user.role]} Dashboard</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 card-shadow">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <div className="mt-4 space-y-3">
            {["Application reviewed by Mount Sinai", "New message from Dr. Chen", "Profile updated successfully"].map((a, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-primary" />
                {a}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 card-shadow">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                <a.icon className="h-5 w-5 text-primary" />
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
