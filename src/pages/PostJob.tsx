import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { specializations, locations } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

export default function PostJob() {
  const [form, setForm] = useState({
    title: "", specialization: "", location: "", salary: "", requirements: "", description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Job posted!", description: `"${form.title}" has been published.` });
    setForm({ title: "", specialization: "", location: "", salary: "", requirements: "", description: "" });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold">Post a Job</h1>
      <p className="mt-1 text-muted-foreground">Create a new job listing for your hospital</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border bg-card p-8 card-shadow">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Senior Cardiologist" required className="mt-1" />
          </div>
          <div>
            <Label>Specialization</Label>
            <Select value={form.specialization} onValueChange={(v) => setForm({ ...form, specialization: v })}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>{specializations.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Location</Label>
            <Select value={form.location} onValueChange={(v) => setForm({ ...form, location: v })}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>{locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="salary">Salary Range</Label>
            <Input id="salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="$300K - $400K" className="mt-1" />
          </div>
        </div>
        <div>
          <Label htmlFor="requirements">Requirements</Label>
          <Textarea id="requirements" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="MD, Board Certified, 5+ years..." rows={3} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="description">Job Description</Label>
          <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the role..." rows={5} className="mt-1" />
        </div>
        <Button type="submit" className="gap-2"><Plus className="h-4 w-4" /> Publish Job</Button>
      </form>
    </div>
  );
}
