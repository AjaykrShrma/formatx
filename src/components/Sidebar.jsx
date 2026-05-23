// src/components/Sidebar.jsx

import { Link } from "react-router-dom";
import TOOLS from "../tools/index";
import "./Sidebar.css";

export function Sidebar({ activeTool, isOpen, onToggle }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* SIDEBAR HEADER */}
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">⌘</span>
          <div className="logo-text">
            <div className="logo-name">FormatX</div>
            <div className="logo-tagline">Dev Toolkit</div>
          </div>
        </div>
        {/* Close button for mobile */}
        <button className="close-btn" onClick={onToggle} aria-label="Close sidebar">
          ✕
        </button>
      </div>

      {/* TOOLS LIST */}
      <nav className="tools-nav">
        <div className="nav-label">Formatters</div>
        
        <div className="tools-list">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className={`tool-item ${activeTool === tool.id ? "active" : ""}`}
              onClick={onToggle} // Close sidebar on mobile after clicking
            >
              {/* TOOL ICON */}
              <span className="tool-icon">{tool.icon}</span>

              {/* TOOL INFO */}
              <div className="tool-info">
                <div className="tool-name">{tool.label}</div>
                <div className="tool-desc">{tool.description}</div>
              </div>

              {/* ACTIVE INDICATOR DOT */}
              {activeTool === tool.id && <span className="active-dot"></span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* SIDEBAR FOOTER */}
      <div className="sidebar-footer">
        <div className="footer-stat">
          <span className="stat-number">{TOOLS.length}</span>
          <span className="stat-label">Tools</span>
        </div>
        <a href="https://github.com" className="footer-link" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </aside>
  );
}