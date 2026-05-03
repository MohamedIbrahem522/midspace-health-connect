import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { mockDoctors } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ContactDoctor() {
  const { id } = useParams();
  const doctor = mockDoctors.find((d) => d.id === id);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  if (!doctor) {
    return <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">Doctor not found.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message sent!", description: `Your inquiry has been sent to ${doctor.name}.` });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Link to={`/doctor/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to profile
      </Link>

      <div className="mt-6 rounded-2xl border bg-card p-8 card-shadow">
        <h1 className="text-2xl font-bold">Contact {doctor.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{doctor.specialization} • {doctor.location}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Your Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} placeholder="Describe your inquiry..." required className="mt-1" />
          </div>
          <Button type="submit" className="gap-2"><Send className="h-4 w-4" /> Send Message</Button>
        </form>
      </div>
    </div>
  );
}
