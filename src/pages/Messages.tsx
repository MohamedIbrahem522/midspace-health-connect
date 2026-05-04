import { useState, useRef, useEffect } from "react";
import { mockMessages } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, MoreVertical, Paperclip, Phone, Video } from "lucide-react";

interface ChatMessage {
  id: string;
  text: string;
  sent: boolean;
  time: string;
}

interface MessageContact {
  id: string;
  from: string;
  preview: string;
  time: string;
  unread: boolean;
  initials: string;
  online: boolean;
}

const contacts: MessageContact[] = mockMessages.map((m) => ({
  ...m,
  online: Math.random() > 0.5,
}));

const chatHistory: Record<string, ChatMessage[]> = {
  m1: [
    { id: "c1", text: "Hi Dr. Sarah, reaching out about the cardiology research project.", sent: false, time: "9:15 AM" },
    { id: "c2", text: "Hello! I'd be happy to discuss. I've been looking into similar cases recently.", sent: true, time: "9:22 AM" },
    { id: "c3", text: "That's great! Would you be available for a call next week?", sent: false, time: "9:25 AM" },
    { id: "c4", text: "Absolutely. Let me check my schedule and get back to you with some available slots.", sent: true, time: "9:30 AM" },
  ],
  m2: [
    { id: "c1", text: "The patient's post-op reports are ready for your review.", sent: false, time: "Yesterday" },
    { id: "c2", text: "Thank you, I'll go through them this afternoon.", sent: true, time: "Yesterday" },
  ],
  m3: [
    { id: "c1", text: "Can you share the lab results from last week?", sent: true, time: "Mon" },
    { id: "c2", text: "Sure, I'll send them over by end of day.", sent: false, time: "Mon" },
  ],
};

export default function Messages() {
  const [selected, setSelected] = useState(contacts[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(chatHistory[contacts[0].id] || []);
  const [newMsg, setNewMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelect = (m: MessageContact) => {
    setSelected(m);
    setMessages(chatHistory[m.id] || [{ id: "c1", text: m.preview, sent: false, time: m.time }]);
  };

  const handleSend = () => {
    if (!newMsg.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages([...messages, { id: `c${Date.now()}`, text: newMsg, sent: true, time: now }]);
    setNewMsg("");
  };

  const filteredContacts = contacts.filter((m) =>
    m.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-1rem)] flex flex-col">

      <div className="border-b bg-background/80 backdrop-blur-sm px-5 py-3 flex items-center justify-between shrink-0">
        <h1 className="font-semibold">Messages</h1>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar */}
        <div className="w-72 border-r flex flex-col shrink-0">
          <div className="p-2.5 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm rounded-lg"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((m) => (
              <button
                key={m.id}
                onClick={() => handleSelect(m)}
                className={`w-full p-3 text-left border-b border-border/30 transition-colors hover:bg-muted/50 ${
                  selected.id === m.id ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {m.initials}
                    </div>
                    {m.unread && (
                      <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm truncate ${m.unread ? "font-semibold" : "font-medium"}`}>
                        {m.from}
                      </span>
                      <span className="text-[11px] text-muted-foreground shrink-0 ml-2">{m.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">{m.preview}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-13 px-4 border-b flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {selected.initials}
                </div>
                {selected.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{selected.from}</p>
                <p className={`text-[11px] ${selected.online ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                  {selected.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Video className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${msg.sent ? "order-1" : ""}`}>
                  <div
                    className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.sent
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className={`text-[11px] text-muted-foreground/60 mt-1 ${msg.sent ? "text-right" : ""}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-3 py-2.5 border-t shrink-0">
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Write a message..."
                className="h-9 rounded-lg text-sm"
              />
              <Button
                size="icon"
                className="h-8 w-8 shrink-0 rounded-lg"
                onClick={handleSend}
                disabled={!newMsg.trim()}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
