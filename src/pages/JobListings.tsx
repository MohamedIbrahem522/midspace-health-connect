import { useState } from "react";
import { mockJobs, specializations } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Building2, DollarSign, Search, Briefcase } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function JobListings() {
  const [search, setSearch] = useState("");
  const [spec, setSpec] = useState("all");

  const filtered = mockJobs.filter((j) => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.hospital.toLowerCase().includes(search.toLowerCase());
    const matchSpec = spec === "all" || j.specialization === spec;
    return matchSearch && matchSpec;
  });

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">Job Listings</h1>
      <p className="mt-1 text-muted-foreground">Find your next opportunity in healthcare</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={spec} onValueChange={setSpec}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Specialization" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            {specializations.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.map((job) => (
          <div key={job.id} className="rounded-2xl border bg-card p-6 card-shadow transition-shadow hover:card-shadow-hover">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {job.hospital}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> {job.salary}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{job.specialization}</span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{job.applicants} applicants</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{job.requirements}</p>
              </div>
              <Button
                className="gap-2 shrink-0"
                onClick={() => toast({ title: "Application submitted!", description: `You applied for ${job.title} at ${job.hospital}.` })}
              >
                <Briefcase className="h-4 w-4" /> Apply
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">No jobs found matching your criteria.</div>
        )}
      </div>
    </div>
  );
}
