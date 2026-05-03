import { useState } from "react";
import { mockDoctors, specializations } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Star, MapPin, Briefcase, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function DoctorDirectory() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("all");

  const filtered = mockDoctors.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchSpec = specialty === "all" || d.specialization === specialty;
    return matchSearch && matchSpec;
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Doctor Directory</h1>
      <p className="mt-1 text-muted-foreground">Browse and connect with medical professionals</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search doctors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Specialty" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {specializations.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d) => (
          <div key={d.id} className="rounded-2xl border bg-card p-6 card-shadow transition-all hover:card-shadow-hover">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                {d.name.split(" ").pop()?.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{d.name}</h3>
                <p className="text-sm text-muted-foreground">{d.specialization}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Star className="h-4 w-4 text-primary" /> {d.rating} rating</div>
              <div className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> {d.experience} years</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {d.location}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 gap-1" asChild>
                <Link to={`/doctor/${d.id}`}>View Profile</Link>
              </Button>
              <Button size="sm" className="gap-1" asChild>
                <Link to={`/contact/${d.id}`}><MessageSquare className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
