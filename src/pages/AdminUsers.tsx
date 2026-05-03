import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Edit, Trash2, Ban, CheckCircle2 } from "lucide-react";
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
  doctor: "bg-blue-100 text-blue-800",
  hospital: "bg-purple-100 text-purple-800",
  patient: "bg-green-100 text-green-800",
};

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setUsers(users.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } as MockUser : u));
    toast({ title: "User status updated" });
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    setDeleteDialog(null);
    toast({ title: "User deleted" });
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">User Management</h1>
      <p className="mt-1 text-muted-foreground">View, edit, and manage all platform users</p>

      <div className="mt-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="mt-4 rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleBadge[u.role]}>{u.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={u.status === "active" ? "default" : "destructive"} className="gap-1">
                    {u.status === "active" ? <CheckCircle2 className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                    {u.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{u.joined}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => toggleStatus(u.id)} title={u.status === "active" ? "Suspend" : "Activate"}>
                      {u.status === "active" ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteDialog(u.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to permanently delete this user? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteDialog && deleteUser(deleteDialog)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
