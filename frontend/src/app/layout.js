import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import AppShell from "@/components/shared/AppShell";

export const metadata = {
  title: "Virtual Learning Environment",
  description: "University virtual learning application"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SocketProvider>
            <AppShell>{children}</AppShell>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
