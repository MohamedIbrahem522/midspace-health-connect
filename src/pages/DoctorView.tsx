import { useParams, Link } from "react-router-dom";
import { mockDoctors } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Briefcase, Building2, ArrowLeft, MessageSquare } from "lucide-react";

export default function DoctorView() {
  const { id } = useParams();
  const doctor = mockDoctors.find((d) => d.id === id);

  if (!doctor) {
    return <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">Doctor not found.</div>;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Link to="/search-doctors" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to search
      </Link>

      <div className="mt-6 rounded-2xl border bg-card p-8 card-shadow">
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-3xl font-bold text-primary">
            {doctor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{doctor.name}</h1>
            <p className="mt-1 text-lg text-primary">{doctor.specialization}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {doctor.location}</span>
              <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {doctor.workplace}</span>
              <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {doctor.experience} years</span>
              <span className="flex items-center gap-1"><Star className="h-4 w-4 text-primary" /> {doctor.rating}/5.0</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold">About</h2>
          <p className="mt-2 text-muted-foreground">{doctor.bio}</p>
        </div>

        <div className="mt-8">
          <Button className="gap-2" asChild>
            <Link to={`/contact/${doctor.id}`}><MessageSquare className="h-4 w-4" /> Contact Doctor</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
