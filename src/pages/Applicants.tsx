import { useState } from "react";
import { mockApplicants } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Check, X, Briefcase, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Applicants() {
  const [applicants, setApplicants] = useState<{ id: string; name: string; specialization: string; experience: number; jobTitle: string; appliedDate: string; status: string }[]>(mockApplicants);

  const updateStatus = (id: string, status: "accepted" | "rejected") => {
    setApplicants(applicants.map((a) => a.id === id ? { ...a, status } : a));
    toast({ title: status === "accepted" ? "Applicant accepted" : "Applicant rejected" });
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">Applicants</h1>
      <p className="mt-1 text-muted-foreground">Review and manage job applications</p>

      <div className="mt-6 space-y-4">
        {applicants.map((a) => (
          <div key={a.id} className="rounded-2xl border bg-card p-6 card-shadow">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                  {a.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{a.name}</h3>
                  <p className="text-sm text-muted-foreground">{a.specialization} • {a.experience} years</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Briefcase className="h-3 w-3" /> Applied for: {a.jobTitle}
                    <Clock className="ml-2 h-3 w-3" /> {a.appliedDate}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {a.status === "pending" ? (
                  <>
                    <Button size="sm" className="gap-1" onClick={() => updateStatus(a.id, "accepted")}>
                      <Check className="h-4 w-4" /> Accept
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 text-destructive hover:bg-destructive/10" onClick={() => updateStatus(a.id, "rejected")}>
                      <X className="h-4 w-4" /> Reject
                    </Button>
                  </>
                ) : (
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    a.status === "accepted" ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"
                  }`}>
                    {a.status === "accepted" ? "Accepted" : "Rejected"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
