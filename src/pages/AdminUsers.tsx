import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Search, Ban, CheckCircle2, UserMinus, Users, Shield, AlertTriangle, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended";
  joined: string;
}

const initialUsers: MockUser[] = [
  { id: "u1", name: "Dr. Sarah Chen", email: "sarah@hospital.com", role: "doctor", status: "active", joined: "2026-01-15" },
  { id: "u2", name: "Mount Sinai Hospital", email: "admin@mountsinai.com", role: "hospital", status: "active", joined: "2025-11-20" },
  { id: "u3", name: "John Smith", email: "john@email.com", role: "patient", status: "active", joined: "2026-03-10" },
  { id: "u4", name: "Dr. James Wilson", email: "james@clinic.com", role: "doctor", status: "suspended", joined: "2026-02-01" },
  { id: "u5", name: "Boston Children's", email: "info@bostonch.com", role: "hospital", status: "active", joined: "2025-12-05" },
  { id: "u6", name: "Emily Rodriguez", email: "emily@email.com", role: "patient", status: "active", joined: "2026-04-01" },
];

const roleBadge: Record<string, string> = {
  doctor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-700/50",
  hospital: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-700/50",
  patient: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700/50",
};

const roleIcon: Record<string, typeof Users> = {
  doctor: Shield,
  hospital: AlertTriangle,
  patient: Users,
};

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleStatus = (id: string) => {
    const user = users.find(u => u.id === id);
    setUsers(users.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } as MockUser : u));
    toast({
      title: user?.status === "active" ? "User suspended" : "User activated",
      description: `${user?.name} has been ${user?.status === "active" ? "suspended" : "activated"}.`,
    });
  };

  const deleteUser = (id: string) => {
    const user = users.find(u => u.id === id);
    setUsers(users.filter((u) => u.id !== id));
    setDeleteDialog(null);
    toast({ title: "User deleted", description: `${user?.name} has been permanently removed.` });
  };

  const counts = {
    all: users.length,
    doctor: users.filter(u => u.role === "doctor").length,
    hospital: users.filter(u => u.role === "hospital").length,
    patient: users.filter(u => u.role === "patient").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="font-semibold">User Management</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-5">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total", value: counts.all, icon: Users },
            { label: "Doctors", value: counts.doctor, icon: Shield },
            { label: "Hospitals", value: counts.hospital, icon: AlertTriangle },
            { label: "Patients", value: counts.patient, icon: Users },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-card p-4">
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl border-border/60"
            />
          </div>
          <div className="flex gap-1 p-1 rounded-xl bg-muted/50">
            {(["all", "doctor", "hospital", "patient"] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  roleFilter === role ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {role === "all" ? "All" : role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => {
                const RoleIcon = roleIcon[u.role] || Users;
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="font-medium text-sm">{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs gap-1 ${roleBadge[u.role]}`}>
                        <RoleIcon className="h-3 w-3" />
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`gap-1 text-xs ${
                        u.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-700/50"
                          : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-700/50"
                      }`}>
                        {u.status === "active" ? <CheckCircle2 className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                        {u.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden md:table-cell">{u.joined}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="View details">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStatus(u.id)} title={u.status === "active" ? "Suspend" : "Activate"}>
                          {u.status === "active" ? <Ban className="h-4 w-4 text-muted-foreground hover:text-amber-600" /> : <CheckCircle2 className="h-4 w-4 text-muted-foreground hover:text-emerald-600" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteDialog(u.id)}>
                          <UserMinus className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">No users found.</div>
          )}
        </motion.div>
      </div>

      {/* Delete dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to permanently delete this user?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteDialog && deleteUser(deleteDialog)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
