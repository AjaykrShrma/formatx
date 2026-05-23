// src/components/Editor.jsx

import { highlight } from "../utils/highlight";
import "./Editor.css";

export function Editor({
  input,
  onInputChange,
  output,
  error,
  isLoading,
  toolId,
  stats, // optional — key count, line count etc
}) {
  // Determine which language to highlight
  const highlightLang = ["json", "xml", "html", "css", "sql"].includes(toolId)
    ? toolId
    : null;

  // Show syntax highlighted output
  const outputHTML = highlightLang
    ? highlight(output, highlightLang)
    : output.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return (
    <div className="editor">
      {/* INPUT PANEL */}
      <div className="editor-panel input-panel">
        {/* PANEL HEADER */}
        <div className="panel-header">
          <span className="panel-label">Input</span>
          <div className="panel-meta">
            <span className="char-count">{input.length} chars</span>
            {input && (
              <span className="line-count">
                {input.split("\n").length} lines
              </span>
            )}
          </div>
        </div>

        {/* INPUT TEXTAREA */}
        <textarea
          className="editor-input"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={`Paste your data here…`}
          spellCheck={false}
          aria-label="Input"
        />
      </div>

      {/* OUTPUT PANEL */}
      <div className="editor-panel output-panel">
        {/* PANEL HEADER */}
        <div className="panel-header">
          <span className="panel-label">Output</span>
          <div className="panel-meta">
            {output && (
              <>
                <span className="line-count">
                  {output.split("\n").length} lines
                </span>
                <span className="char-count">{output.length} chars</span>
              </>
            )}
            {!error && output && <span className="status-badge valid">✓ Valid</span>}
            {error && <span className="status-badge error">✗ Error</span>}
          </div>
        </div>

        {/* OUTPUT CONTENT */}
        <div className="editor-output">
          {isLoading && (
            <div className="loading-state">
              <span className="spinner"></span>
              <p>Formatting...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <span className="error-icon">⚠️</span>
              <div className="error-content">
                <div className="error-title">Parse Error</div>
                <div className="error-message">{error}</div>
              </div>
            </div>
          )}

          {!isLoading && !error && output && (
            <pre
              className="output-content"
              dangerouslySetInnerHTML={{ __html: outputHTML }}
            />
          )}

          {!isLoading && !error && !output && input && (
            <div className="empty-state">
              <span className="empty-icon">⏳</span>
              <p>Ready to format...</p>
            </div>
          )}

          {!isLoading && !error && !output && !input && (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <p>Paste your data to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}