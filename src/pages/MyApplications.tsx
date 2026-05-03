import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, CheckCircle2, XCircle } from "lucide-react";

const initialApplications = [
  { id: "a1", jobTitle: "Senior Cardiologist", hospital: "Mount Sinai Hospital", location: "New York", appliedDate: "2026-04-10", status: "pending" as const },
  { id: "a2", jobTitle: "ER Physician", hospital: "Chicago General", location: "Chicago", appliedDate: "2026-04-08", status: "accepted" as const },
  { id: "a3", jobTitle: "Pediatric Neurologist", hospital: "Boston Children's", location: "Boston", appliedDate: "2026-04-05", status: "rejected" as const },
  { id: "a4", jobTitle: "Dermatologist", hospital: "UCSF Medical Center", location: "San Francisco", appliedDate: "2026-04-12", status: "pending" as const },
];

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  accepted: { label: "Accepted", icon: CheckCircle2, variant: "default" as const, className: "bg-green-100 text-green-800 border-green-200" },
  rejected: { label: "Rejected", icon: XCircle, variant: "destructive" as const, className: "bg-red-100 text-red-800 border-red-200" },
};

export default function MyApplications() {
  const [applications] = useState(initialApplications);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold">My Applications</h1>
      <p className="mt-1 text-muted-foreground">Track the status of your job applications</p>

      <div className="mt-6 space-y-4">
        {applications.map((app) => {
          const config = statusConfig[app.status];
          const StatusIcon = config.icon;
          return (
            <div key={app.id} className="rounded-2xl border bg-card p-6 card-shadow transition-all hover:card-shadow-hover">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{app.jobTitle}</h3>
                    <p className="text-sm text-muted-foreground">{app.hospital} • {app.location}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Applied: {app.appliedDate}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`gap-1.5 ${config.className}`}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {config.label}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
