import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * This component is a simple wrapper that doesn't include a sidebar
 * since the main Layout component already provides a sidebar.
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="w-full">
      {children}
    </div>
  );
};

export default DashboardLayout;