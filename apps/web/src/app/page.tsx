import { Sidebar } from "@/components/layout/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default function DashboardPage() {
  return (
    <main className="flex h-screen w-full overflow-hidden bg-paper-50">
      <Sidebar />
      <div className="flex-1">
        <ChatWindow />
      </div>
    </main>
  );
}
