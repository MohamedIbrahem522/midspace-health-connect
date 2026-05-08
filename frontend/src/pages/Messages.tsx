import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, MoreVertical, Paperclip, Phone, Video } from "lucide-react";
import api from "@/services/api";

interface ChatMessage {
  id: number;
  content: string;
  sent: boolean;
  sentAt: string;
}

interface MessageContact {
  userId: number;
  userName: string;
  profileImage?: string;
  lastMessage?: string;
  lastMessageAt: string;
  initials: string;
}

export default function Messages() {
  const [contacts, setContacts] = useState<MessageContact[]>([]);
  const [selected, setSelected] = useState<MessageContact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/messages/conversations");
        const mapped = res.data.map((c: { userId: number; userName: string; profileImage?: string; lastMessage?: string; lastMessageAt: string }) => ({
          ...c,
          initials: c.userName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase(),
        }));
        setContacts(mapped);
        if (mapped.length > 0) {
          setSelected(mapped[0]);
          fetchMessagesWithUser(mapped[0].userId);
        }
      } catch {
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const fetchMessagesWithUser = async (userId: number) => {
    try {
      const res = await api.get(`/messages/${userId}`);
      const currentUserId = parseInt(localStorage.getItem("userId") || "0");
      const mapped = res.data.map((m: { id: number; senderId: number; content: string; sentAt: string }) => ({
        id: m.id,
        content: m.content,
        sent: m.senderId === currentUserId,
        sentAt: new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }));
      setMessages(mapped);
    } catch {
      setMessages([]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelect = (contact: MessageContact) => {
    setSelected(contact);
    fetchMessagesWithUser(contact.userId);
  };

  const handleSend = async () => {
    if (!newMsg.trim() || !selected) return;
    try {
      await api.post("/messages", { receiverId: selected.userId, content: newMsg });
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages([...messages, { id: Date.now(), content: newMsg, sent: true, sentAt: now }]);
      setNewMsg("");
      fetchMessagesWithUser(selected.userId);
    } catch {
      // silently fail
    }
  };

  const filteredContacts = contacts.filter((m) =>
    m.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="h-[calc(100vh-1rem)] flex items-center justify-center">Loading messages...</div>;

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
                key={m.userId}
                onClick={() => handleSelect(m)}
                className={`w-full p-3 text-left border-b border-border/30 transition-colors hover:bg-muted/50 ${
                  selected?.userId === m.userId ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {m.initials}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate font-medium">
                        {m.userName}
                      </span>
                      <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                        {new Date(m.lastMessageAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">{m.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {selected ? (
            <>
              <div className="h-13 px-4 border-b flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {selected.initials}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selected.userName}</p>
                    <p className="text-[11px] text-muted-foreground">Chat</p>
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
                        {msg.content}
                      </div>
                      <p className={`text-[11px] text-muted-foreground/60 mt-1 ${msg.sent ? "text-right" : ""}`}>
                        {msg.sentAt}
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
