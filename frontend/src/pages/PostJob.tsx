import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { specializations, locations } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Plus, Sparkles, MapPin, DollarSign, Building2, FileText, Check } from "lucide-react";
import api from "@/services/api";

const steps = [
  { id: "details", label: "Details", icon: FileText },
  { id: "requirements", label: "Requirements", icon: Building2 },
  { id: "review", label: "Review", icon: Check },
];

export default function PostJob() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", specialization: "", location: "", salary: "", requirements: "", description: "", type: "Full-time",
  });

  const updateForm = (field: string, value: string) => setForm({ ...form, [field]: value });

  const canProceed = () => {
    if (step === 0) return form.title && form.specialization && form.location;
    if (step === 1) return form.requirements && form.description;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post("/jobs", {
        title: form.title,
        description: form.description,
        specialty: form.specialization,
        location: form.location,
        salary: form.salary,
        employmentType: form.type
      });
      toast({ title: "Job posted!", description: `"${form.title}" has been published.` });
      navigate("/manage-jobs");
    } catch {
      toast({ title: "Error", description: "Failed to post job. Make sure you are logged in as a Hospital." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-4xl px-4 h-14 flex items-center gap-3">
          <Plus className="h-5 w-5 text-primary" />
          <h1 className="font-semibold">Post a Job</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isComplete = i < step;
            const isCurrent = i === step;
            return (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isComplete
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : "text-muted-foreground"
                }`}>
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-px mx-2 ${isComplete ? "bg-emerald-400" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl border bg-card p-6 md:p-8">
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input id="title" value={form.title} onChange={(e) => updateForm("title", e.target.value)} placeholder="e.g. Senior Cardiologist" className="mt-1.5 h-10" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Specialization *</Label>
                    <Select value={form.specialization} onValueChange={(v) => updateForm("specialization", v)}>
                      <SelectTrigger className="mt-1.5 h-10"><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>{specializations.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Job Type</Label>
                    <Select value={form.type} onValueChange={(v) => updateForm("type", v)}>
                      <SelectTrigger className="mt-1.5 h-10"><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        {["Full-time", "Part-time", "Remote", "Contract"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Location *</Label>
                  <Select value={form.location} onValueChange={(v) => updateForm("location", v)}>
                    <SelectTrigger className="mt-1.5 h-10"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>{locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input id="salary" value={form.salary} onChange={(e) => updateForm("salary", e.target.value)} placeholder="e.g. $300K - $400K" className="mt-1.5 h-10" />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="requirements">Requirements *</Label>
                  <Textarea id="requirements" value={form.requirements} onChange={(e) => updateForm("requirements", e.target.value)} placeholder="MD, Board Certified, 5+ years experience..." rows={4} className="mt-1.5 resize-none" />
                  <p className="text-xs text-muted-foreground mt-1.5">List the key qualifications and skills required</p>
                </div>

                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea id="description" value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Describe the role, responsibilities, and benefits..." rows={6} className="mt-1.5 resize-none" />
                  <p className="text-xs text-muted-foreground mt-1.5">Provide a detailed overview of the position</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">Preview your job listing</h3>
                <div className="rounded-lg border bg-muted/30 p-5 space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold">{form.title}</h4>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {form.specialization}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {form.location}</span>
                      {form.salary && <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> {form.salary}</span>}
                    </div>
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs">{form.type}</Badge>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Requirements</p>
                    <p className="text-sm whitespace-pre-line">{form.requirements}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                    <p className="text-sm whitespace-pre-line">{form.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-5 border-t">
              {step > 0 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
              ) : <div />}

              {step < 2 ? (
                <Button onClick={() => canProceed() && setStep(step + 1)} disabled={!canProceed()}>
                  Continue
                  <Sparkles className="h-4 w-4 ml-1.5" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Publish Job
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
