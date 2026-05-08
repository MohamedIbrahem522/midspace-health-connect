import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Loader2, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";

export default function ContactDoctor() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    if (id) {
      api.get(`/doctors/${id}`).then(r => setDoctorName(r.data.name)).catch(() => {});
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !id) return;
    setSending(true);
    try {
      await api.post("/messages", { receiverId: parseInt(id), content: message });
      navigate("/messages");
    } catch {
      setSending(false);
    }
  };

  if (!user) return <div className="container mx-auto px-4 py-12 text-center">Please login first</div>;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-4">
        <Link to={`/doctors/${id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to profile
        </Link>
      </motion.div>

      <div className="rounded-xl border bg-card p-6 max-w-xl mx-auto">
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
              {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">Send a message</h2>
              {doctorName && <p className="text-xs text-muted-foreground">To: {doctorName}</p>}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            Sending as <strong>{user.name}</strong> ({user.email})
          </div>

          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Type your message..." required className="text-sm resize-none" />

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" /> Your message is secure
            </p>
            <Button type="submit" disabled={sending || !message.trim()} className="h-10 text-sm gap-2">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
