import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-rose-50 border-t py-12 text-center text-sm text-muted-foreground overflow-hidden">
      {/* Gradient background shape */}
      <div
        className="absolute bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-30 blur-xl"

      />

      {/* Footer content */}
      <div className="max-w-5xl mx-auto px-4 relative">
        <h2 className="text-xl font-bold text-primary mb-2">EclairAI</h2>
        <p className="mb-4">
          Empowering businesses with intelligent AI-driven solutions.
        </p>

        <div className="flex justify-center space-x-5 mb-4">
          {([
            ["Facebook", Facebook],
            ["Twitter", Twitter],
            ["Instagram", Instagram],
            ["LinkedIn", Linkedin],
          ] as [string, React.ComponentType<{ size?: number }>][]).map(([label, Icon]) => (
            <a
              key={label}
              href={`https://${label.toLowerCase()}.com`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="hover:text-primary transition-colors"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>

        <div className="mb-2">
          <a href="mailto:princedoriya691@gmail.com" className="hover:text-primary">
            princedoriya691@gmail.com
          </a>
        </div>

        <div className="mt-4 border-t pt-4 border-border">
          &copy; {new Date().getFullYear()} EclairAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
