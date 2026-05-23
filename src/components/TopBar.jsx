// src/components/TopBar.jsx

import { useState } from "react";
import "./TopBar.css";

export function TopBar({
  activeTool,
  toolLabel,
  toolDesc,
  input,
  output,
  error,
  indent,
  onIndentChange,
  mode,
  onModeChange,
  onFormat,
  onMinify,
  onCopy,
  onClear,
  onLoadSample,
  copied,
  sidebarOpen,
  onToggleSidebar,
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="topbar">
      {/* LEFT SECTION */}
      <div className="topbar-left">
        <button
          className="menu-btn"
          onClick={onToggleSidebar}
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        <div className="topbar-title">
          <h1 className="tool-title">{toolLabel}</h1>
          <p className="tool-subtitle">{toolDesc}</p>
        </div>
      </div>

      {/* CENTER SECTION */}
      <div className="topbar-center">
        {activeTool === "json" && (
          <div className="setting-group">
            <label className="setting-label">Indent</label>
            <div className="indent-buttons">
              {[2, 4, 8].map((size) => (
                <button
                  key={size}
                  className={`indent-btn ${indent === size ? "active" : ""}`}
                  onClick={() => onIndentChange(size)}
                  title={`Indent with ${size} spaces`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {(activeTool === "base64" || activeTool === "url") && (
          <div className="setting-group">
            <label className="setting-label">
              {activeTool === "base64" ? "Base64" : "URL"}
            </label>
            <div className="mode-toggle">
              <button
                className={`mode-btn ${mode === "encode" ? "active" : ""}`}
                onClick={() => onModeChange("encode")}
                title="Encode"
              >
                Encode
              </button>
              <button
                className={`mode-btn ${mode === "decode" ? "active" : ""}`}
                onClick={() => onModeChange("decode")}
                title="Decode"
              >
                Decode
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="topbar-right">
        <button
          className="action-btn secondary"
          onClick={onLoadSample}
          title="Load sample data"
        >
          <span className="btn-icon">📄</span>
          <span className="btn-text">Sample</span>
        </button>

        <button
          className="action-btn secondary"
          onClick={onClear}
          title="Clear input and output"
        >
          <span className="btn-icon">🗑</span>
          <span className="btn-text">Clear</span>
        </button>

        {(activeTool === "json" || activeTool === "sql") && (
          <button
            className="action-btn secondary"
            onClick={onMinify}
            disabled={!input}
            title="Minify output"
          >
            <span className="btn-icon">📦</span>
            <span className="btn-text">Minify</span>
          </button>
        )}

        {/* COPY BUTTON WITH VISUAL FEEDBACK */}
        <button
          className={`action-btn primary ${copied ? "success" : ""}`}
          onClick={onCopy}
          disabled={!output}
          title={copied ? "Copied to clipboard!" : "Copy to clipboard"}
        >
          <span className="btn-icon">{copied ? "✓" : "📋"}</span>
          <span className="btn-text">{copied ? "Copied!" : "Copy"}</span>
        </button>

        <div className="menu-wrapper">
          <button
            className="action-btn secondary menu-toggle"
            onClick={() => setShowMenu(!showMenu)}
            title="More options"
          >
            <span className="btn-icon">⋮</span>
          </button>

          {showMenu && (
            <div className="dropdown-menu">
              <a href="#download" className="menu-item" onClick={onLoadSample}>
                📥 Download
              </a>
              <a href="#settings" className="menu-item">
                ⚙️ Settings
              </a>
              <a href="#help" className="menu-item">
                ❓ Help
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}