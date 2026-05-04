import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { specializations } from "@/data/mockData";
import {
  Save,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Building2,
  Briefcase,
  Star,
  MessageSquare,
  Camera,
  Plus,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";
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
    <div className="container mx-auto max-w-4xl px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Complete your professional profile</p>
        </div>
        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleSave}>
          <Save className="h-3.5 w-3.5 mr-1" />
          Save draft
        </Button>
      </motion.div>

      {/* Step indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 mb-6 p-4 rounded-xl border bg-card"
      >
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(i)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                i === step
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                  : i < step
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </motion.button>
            <span className={`hidden text-sm font-medium sm:block ${
              i === step ? "text-foreground" : i < step ? "text-primary" : "text-muted-foreground"
            }`}>
              {s}
            </span>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-2 ${i < step ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        ))}
      </motion.div>

      {/* Profile Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border bg-card overflow-hidden mb-6"
      >
        {/* Cover */}
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-cyan-400/20 relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-border"
          >
            <Camera className="h-3.5 w-3.5 text-muted-foreground" />
          </motion.button>
        </div>

        {/* Avatar + Info */}
        <div className="px-5 pb-5 -mt-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-xl border-4 border-background bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {form.name.charAt(0).toUpperCase()}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center border-2 border-background"
              >
                <Camera className="h-3 w-3 text-white" />
              </motion.button>
            </div>

            <div className="flex-1 pt-10 sm:pt-0">
              <h2 className="text-xl font-semibold">{form.name}</h2>
              <p className="text-sm text-primary font-medium">{form.specialization}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {form.location}</span>
                <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {form.workplace}</span>
                <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {form.experience} years</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400 fill-amber-400" /> 4.8</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border bg-card"
      >
        <div className="p-6">
          {/* Step 0: Personal Info */}
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="font-semibold text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Personal Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Full Name</Label>
                  <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="mt-1 h-10 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="mt-1 h-10 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Location</Label>
                  <Input value={form.location} onChange={(e) => update("location", e.target.value)} className="mt-1 h-10 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Specialization</Label>
                  <Select value={form.specialization} onValueChange={(v) => update("specialization", v)}>
                    <SelectTrigger className="mt-1 h-10 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {specializations.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Bio</Label>
                <Textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} rows={3} className="mt-1 text-sm" placeholder="Tell patients and hospitals about yourself..." />
              </div>
            </motion.div>
          )}

          {/* Step 1: Qualifications */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="font-semibold text-base flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Qualifications
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Degree</Label>
                  <Input value={form.degree} onChange={(e) => update("degree", e.target.value)} className="mt-1 h-10 text-sm" placeholder="MD, MBBS, etc." />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">University</Label>
                  <Input value={form.university} onChange={(e) => update("university", e.target.value)} className="mt-1 h-10 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-xs text-muted-foreground">Certifications</Label>
                  <Input value={form.certifications} onChange={(e) => update("certifications", e.target.value)} className="mt-1 h-10 text-sm" placeholder="Board certified, ACLS, etc." />
                </div>
              </div>

              {/* Upload area */}
              <motion.div
                whileHover={{ borderColor: "hsl(var(--primary) / 0.3)" }}
                className="flex items-center gap-4 rounded-xl border-2 border-dashed p-6 cursor-pointer"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Upload your CV</p>
                  <p className="text-xs text-muted-foreground">PDF, DOC up to 10MB</p>
                </div>
                <Button variant="outline" size="sm">Browse</Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Experience */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Experience
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Years of Experience</Label>
                  <Input value={form.experience} onChange={(e) => update("experience", e.target.value)} className="mt-1 h-10 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Current Workplace</Label>
                  <Input value={form.workplace} onChange={(e) => update("workplace", e.target.value)} className="mt-1 h-10 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Previous Workplace</Label>
                  <Input value={form.previousWorkplace} onChange={(e) => update("previousWorkplace", e.target.value)} className="mt-1 h-10 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-xs text-muted-foreground">Key Skills</Label>
                  <Input value={form.skills} onChange={(e) => update("skills", e.target.value)} className="mt-1 h-10 text-sm" placeholder="Separate with commas" />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="h-9 text-sm gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)} className="h-9 text-sm gap-1">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={handleSave} className="h-9 text-sm gap-1 bg-primary hover:bg-primary/90">
                <Save className="h-4 w-4" /> Save Profile
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
