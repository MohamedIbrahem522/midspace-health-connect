import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { specializations } from "@/data/mockData";
import { Save, Upload, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const steps = ["Personal Info", "Qualifications", "Experience"];

export default function DoctorProfile() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Board-certified physician with a passion for patient care and medical innovation.",
    specialization: "Cardiology",
    degree: "MD",
    university: "Harvard Medical School",
    certifications: "Board Certified Cardiologist, ACLS",
    experience: "10",
    workplace: "Mount Sinai Hospital",
    previousWorkplace: "NYU Langone Health",
    skills: "Interventional Cardiology, Heart Failure Management, Echocardiography",
  });

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSave = () => {
    toast({ title: "Profile saved", description: "Your profile has been updated successfully." });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <p className="mt-1 text-muted-foreground">Complete your professional profile</p>

      {/* Step indicator */}
      <div className="mt-6 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(i)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </button>
            <span className={`hidden text-sm font-medium sm:inline ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
              {s}
            </span>
            {i < steps.length - 1 && <div className={`h-px w-8 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border bg-card p-8 card-shadow">
        {/* Step 0: Personal Info */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                {form.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{form.name}</h2>
                <p className="text-sm text-muted-foreground">Personal Information</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={form.location} onChange={(e) => update("location", e.target.value)} className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={form.bio} onChange={(e) => update("bio", e.target.value)} rows={3} className="mt-1" />
            </div>
          </div>
        )}

        {/* Step 1: Qualifications */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Qualifications</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Specialization</Label>
                <Select value={form.specialization} onValueChange={(v) => update("specialization", v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {specializations.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="degree">Degree</Label>
                <Input id="degree" value={form.degree} onChange={(e) => update("degree", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="university">University</Label>
                <Input id="university" value={form.university} onChange={(e) => update("university", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="certifications">Certifications</Label>
                <Input id="certifications" value={form.certifications} onChange={(e) => update("certifications", e.target.value)} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>CV / Resume</Label>
              <div className="mt-2 flex items-center gap-4 rounded-xl border-2 border-dashed p-6">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Upload your CV</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC up to 10MB</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">Browse</Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Experience */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">Experience</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" value={form.experience} onChange={(e) => update("experience", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="workplace">Current Workplace</Label>
                <Input id="workplace" value={form.workplace} onChange={(e) => update("workplace", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="previousWorkplace">Previous Workplace</Label>
                <Input id="previousWorkplace" value={form.previousWorkplace} onChange={(e) => update("previousWorkplace", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="skills">Key Skills</Label>
                <Input id="skills" value={form.skills} onChange={(e) => update("skills", e.target.value)} className="mt-1" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} className="gap-1">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSave} className="gap-1">
              <Save className="h-4 w-4" /> Save Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
