import { Sidebar } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1"> {/* Or your main content area */}
        {children} {/* Render the children here */}
      </main>
    </div>
  );
};
export default DashboardLayout;