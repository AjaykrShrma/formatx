// src/components/StatusBar.jsx

import "./StatusBar.css";

export function StatusBar({
  toolId,
  toolLabel,
  input,
  output,
  error,
  stats, // optional object with custom stats like { keys: 42 }
}) {
  // Calculate basic stats
  const inputLines = input ? input.split("\n").length : 0;
  const outputLines = output ? output.split("\n").length : 0;
  const inputChars = input.length;
  const outputChars = output.length;

  // Determine status
  let status = "ready";
  let statusText = "Ready";
  let statusColor = "default";

  if (error) {
    status = "error";
    statusText = "Parse Error";
    statusColor = "error";
  } else if (input && output && !error) {
    status = "success";
    statusText = "Formatted Successfully";
    statusColor = "success";
  } else if (input && !output && !error) {
    status = "processing";
    statusText = "Processing...";
    statusColor = "info";
  }

  return (
    <footer className="statusbar">
      {/* LEFT SECTION - Status indicator */}
      <div className="status-left">
        <span className={`status-dot ${statusColor}`}></span>
        <span className="status-text">{statusText}</span>
      </div>

      {/* CENTER SECTION - Quick stats */}
      <div className="status-center">
        {input && (
          <>
            <div className="stat-group">
              <span className="stat-label">Input:</span>
              <span className="stat-value">
                {inputChars} chars, {inputLines} line{inputLines !== 1 ? "s" : ""}
              </span>
            </div>

            {output && (
              <>
                <span className="stat-separator">•</span>
                <div className="stat-group">
                  <span className="stat-label">Output:</span>
                  <span className="stat-value">
                    {outputChars} chars, {outputLines} line{outputLines !== 1 ? "s" : ""}
                  </span>
                </div>
              </>
            )}

            {/* TOOL-SPECIFIC STATS */}
            {stats && stats.keys !== undefined && (
              <>
                <span className="stat-separator">•</span>
                <div className="stat-group">
                  <span className="stat-label">Keys:</span>
                  <span className="stat-value">{stats.keys}</span>
                </div>
              </>
            )}

            {stats && stats.elements !== undefined && (
              <>
                <span className="stat-separator">•</span>
                <div className="stat-group">
                  <span className="stat-label">Elements:</span>
                  <span className="stat-value">{stats.elements}</span>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* RIGHT SECTION - App info */}
      <div className="status-right">
        <span className="app-name">FormatX</span>
        <span className="app-version">v1.0</span>
      </div>
    </footer>
  );
}