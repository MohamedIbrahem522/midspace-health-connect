import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { mockDoctors } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, MapPin, Star, Clock, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
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
    <div className="container mx-auto max-w-3xl px-4 py-6">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-4"
      >
        <Link to={`/doctor/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to profile
        </Link>
      </motion.div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Doctor Info Card */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2"
        >
          <div className="rounded-xl border bg-card p-5 sticky top-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                {doctor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h3 className="font-semibold text-sm">{doctor.name}</h3>
                <p className="text-xs text-primary font-medium">{doctor.specialization}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{doctor.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{doctor.rating}/5.0 rating</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Usually responds within 24h</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/30">
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5" />
                Verified doctor
              </p>
              <p className="text-[11px] text-emerald-600/70 dark:text-emerald-500/60 mt-0.5">
                This doctor's credentials have been verified by MidSpace.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="md:col-span-3"
        >
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold">Send a message</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Describe your inquiry and {doctor.name} will respond.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-xs text-muted-foreground">Your Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="mt-1.5 h-10 text-sm"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs text-muted-foreground">Your Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="mt-1.5 h-10 text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-xs text-muted-foreground">Message</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  placeholder="Describe your inquiry, symptoms, or appointment request..."
                  required
                  className="mt-1.5 text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block mr-1" />
                  Your message is secure and private
                </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="h-10 text-sm bg-primary hover:bg-primary/90 gap-2">
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </motion.div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
