import { useState } from "react";
import { mockMessages } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send } from "lucide-react";

export default function Messages() {
  const [selected, setSelected] = useState(mockMessages[0]);
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState<{ text: string; sent: boolean }[]>([
    { text: selected.preview, sent: false },
  ]);

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setMessages([...messages, { text: newMsg, sent: true }]);
    setNewMsg("");
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold">Messages</h1>
      <p className="mt-1 text-muted-foreground">Communicate with your network</p>

      <div className="mt-6 grid h-[500px] grid-cols-1 overflow-hidden rounded-2xl border bg-card card-shadow md:grid-cols-3">
        {/* Sidebar */}
        <div className="border-r">
          <div className="border-b p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
          </div>
          <div className="overflow-y-auto">
            {mockMessages.map((m) => (
              <button
                key={m.id}
                onClick={() => { setSelected(m); setMessages([{ text: m.preview, sent: false }]); }}
                className={`w-full border-b p-4 text-left transition-colors hover:bg-muted/50 ${selected.id === m.id ? "bg-muted" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{m.from}</span>
                  <span className="text-xs text-muted-foreground">{m.time}</span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{m.preview}</p>
                {m.unread && <div className="mt-1 h-2 w-2 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="col-span-2 flex flex-col">
          <div className="border-b p-4">
            <h3 className="font-semibold">{selected.from}</h3>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sent ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${m.sent ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button size="icon" onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
