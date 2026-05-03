import { useState } from "react";
import { mockJobs } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ManageJobs() {
  const [jobs, setJobs] = useState(mockJobs);

  const handleDelete = (id: string) => {
    setJobs(jobs.filter((j) => j.id !== id));
    toast({ title: "Job deleted", description: "The listing has been removed." });
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">Manage Jobs</h1>
      <p className="mt-1 text-muted-foreground">Edit or remove your active listings</p>

      <div className="mt-6 space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-2xl border bg-card p-6 card-shadow">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {job.applicants} applicants</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{job.specialization}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={() => toast({ title: "Edit mode", description: "Editing functionality coming soon." })}>
                  <Edit className="h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" size="sm" className="gap-1 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(job.id)}>
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
        {jobs.length === 0 && <div className="py-12 text-center text-muted-foreground">No active job listings.</div>}
      </div>
    </div>
  );
}
