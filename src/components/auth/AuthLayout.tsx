// src/components/auth/AuthLayout.tsx
import { motion } from 'framer-motion';
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, description }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          {/* You can replace this with an actual logo component if you have one */}
          <h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">
            Fin<span className="text-primary">Wise</span>
          </h1>
          <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300">{title}</h2>
          {description && (
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">{description}</p>
          )}
        </div>
        {children}
      </motion.div>
      <footer className="absolute bottom-4 text-center text-sm text-zinc-500 dark:text-zinc-400 w-full">
        © {new Date().getFullYear()} FinWise. All rights reserved. (Nigeria)
      </footer>
    </div>
  );
};

export default AuthLayout;