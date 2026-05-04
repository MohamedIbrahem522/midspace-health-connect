export interface MockDoctor {
  id: string;
  name: string;
  specialization: string;
  location: string;
  rating: number;
  experience: number;
  workplace: string;
  degree?: string;
  bio: string;
}

export interface MockJob {
  id: string;
  title: string;
  hospital: string;
  location: string;
  specialization: string;
  salary: string;
  requirements: string;
  postedDate: string;
  applicants: number;
  type?: string;
  posted?: string;
}

export interface MockMessage {
  id: string;
  from: string;
  preview: string;
  time: string;
  unread: boolean;
  initials: string;
}

export interface MockApplicant {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  jobTitle: string;
  appliedDate: string;
  status: "pending" | "accepted" | "rejected";
}

export const mockDoctors: MockDoctor[] = [
  { id: "d1", name: "Dr. Sarah Chen", specialization: "Cardiology", location: "New York", rating: 4.9, experience: 12, workplace: "Mount Sinai Hospital", bio: "Board-certified cardiologist specializing in interventional cardiology and heart failure management." },
  { id: "d2", name: "Dr. James Wilson", specialization: "Neurology", location: "Boston", rating: 4.7, experience: 8, workplace: "Mass General", bio: "Neurologist with focus on movement disorders and neurodegenerative diseases." },
  { id: "d3", name: "Dr. Amira Patel", specialization: "Pediatrics", location: "Chicago", rating: 4.8, experience: 15, workplace: "Children's Memorial", bio: "Pediatrician dedicated to preventive care and childhood development." },
  { id: "d4", name: "Dr. Michael Torres", specialization: "Orthopedics", location: "Los Angeles", rating: 4.6, experience: 10, workplace: "UCLA Medical", bio: "Orthopedic surgeon specializing in sports medicine and joint replacement." },
  { id: "d5", name: "Dr. Emily Nakamura", specialization: "Dermatology", location: "San Francisco", rating: 4.9, experience: 7, workplace: "UCSF Health", bio: "Dermatologist focused on medical and cosmetic dermatology." },
  { id: "d6", name: "Dr. Robert Kim", specialization: "Cardiology", location: "Seattle", rating: 4.5, experience: 20, workplace: "Virginia Mason", bio: "Veteran cardiologist with expertise in electrophysiology." },
];

export const mockJobs: MockJob[] = [
  { id: "j1", title: "Senior Cardiologist", hospital: "Mount Sinai Hospital", location: "New York", specialization: "Cardiology", salary: "$350K - $450K", requirements: "MD, Board Certified, 5+ years experience", postedDate: "2026-04-10", applicants: 12, type: "Full-time", posted: "3 days ago" },
  { id: "j2", title: "Pediatric Neurologist", hospital: "Boston Children's", location: "Boston", specialization: "Neurology", salary: "$280K - $380K", requirements: "MD, Pediatric Neurology fellowship, 3+ years", postedDate: "2026-04-08", applicants: 8, type: "Full-time", posted: "5 days ago" },
  { id: "j3", title: "ER Physician", hospital: "Chicago General", location: "Chicago", specialization: "Emergency Medicine", salary: "$300K - $400K", requirements: "MD, ABEM Board Certified, ACLS/ATLS", postedDate: "2026-04-12", applicants: 15, type: "Contract", posted: "1 day ago" },
  { id: "j4", title: "Dermatologist", hospital: "UCSF Medical Center", location: "San Francisco", specialization: "Dermatology", salary: "$320K - $420K", requirements: "MD, Board Certified Dermatology, 2+ years", postedDate: "2026-04-11", applicants: 6, type: "Part-time", posted: "2 days ago" },
  { id: "j5", title: "Orthopedic Surgeon", hospital: "UCLA Health", location: "Los Angeles", specialization: "Orthopedics", salary: "$400K - $550K", requirements: "MD, Fellowship trained, 5+ years surgical experience", postedDate: "2026-04-09", applicants: 9, type: "Full-time", posted: "4 days ago" },
];

export const mockMessages: MockMessage[] = [
  { id: "m1", from: "Mount Sinai Hospital", preview: "We'd like to schedule an interview for the Senior Cardiologist position...", time: "2h ago", unread: true, initials: "MS" },
  { id: "m2", from: "Patient: John Smith", preview: "Thank you for the consultation. I wanted to follow up about...", time: "5h ago", unread: true, initials: "JS" },
  { id: "m3", from: "Dr. Sarah Chen", preview: "I'll be available for the conference next week. Let me know...", time: "1d ago", unread: false, initials: "SC" },
  { id: "m4", from: "Boston Children's", preview: "Your application has been received. Our team will review...", time: "2d ago", unread: false, initials: "BC" },
];

export const mockApplicants: MockApplicant[] = [
  { id: "a1", name: "Dr. Sarah Chen", specialization: "Cardiology", experience: 12, jobTitle: "Senior Cardiologist", appliedDate: "2026-04-12", status: "pending" },
  { id: "a2", name: "Dr. Robert Kim", specialization: "Cardiology", experience: 20, jobTitle: "Senior Cardiologist", appliedDate: "2026-04-11", status: "pending" },
  { id: "a3", name: "Dr. Emily Nakamura", specialization: "Dermatology", experience: 7, jobTitle: "Dermatologist", appliedDate: "2026-04-13", status: "accepted" },
];

export const specializations = [
  "Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Dermatology",
  "Emergency Medicine", "Internal Medicine", "Surgery", "Psychiatry", "Radiology",
];

export const locations = [
  "New York", "Boston", "Chicago", "Los Angeles", "San Francisco", "Seattle", "Houston", "Miami",
];
