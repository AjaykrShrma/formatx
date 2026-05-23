// src/App.jsx

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Editor } from "./components/Editor";
import { StatusBar } from "./components/StatusBar";
import { useFormatter } from "./hooks/useFormatter";
import TOOLS from "./tools/index";
import * as jsonTools from "./tools/json";
import * as xmlTools from "./tools/xml";
import * as htmlTools from "./tools/html";
import * as cssTools from "./tools/css";
import * as sqlTools from "./tools/sql";
import * as base64Tools from "./tools/base64";
import * as urlTools from "./tools/url";
import * as jwtTools from "./tools/jwt";
import "./App.css";

// ─────────────────────────────────────────────────────────────────
// REUSABLE TOOL PAGE LAYOUT
// ─────────────────────────────────────────────────────────────────

function ToolPage({
  tool,
  input,
  setInput,
  output,
  error,
  isLoading,
  indent,
  setIndent,
  mode,
  onModeChange,
  onCopy,
  onClear,
  onLoadSample,
  onMinify,
  copied,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-layout">
      <Sidebar
        activeTool={tool.id}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="app-main">
        <TopBar
          activeTool={tool.id}
          toolLabel={tool.label}
          toolDesc={tool.description}
          input={input}
          output={output}
          error={error}
          indent={indent}
          onIndentChange={setIndent}
          mode={mode}
          onModeChange={onModeChange}
          onMinify={onMinify}
          onCopy={onCopy}
          onClear={onClear}
          onLoadSample={onLoadSample}
          copied={copied}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <Editor
          input={input}
          onInputChange={setInput}
          output={output}
          error={error}
          isLoading={isLoading}
          toolId={tool.id}
        />

        <StatusBar
          toolId={tool.id}
          toolLabel={tool.label}
          input={input}
          output={output}
          error={error}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// INDIVIDUAL TOOL COMPONENTS
// ─────────────────────────────────────────────────────────────────

function JSONFormatter() {
  const { input, setInput, output, error, isLoading, indent, setIndent, copy, clear, loadSample, copied } =
    useFormatter("json", (raw, opts) => jsonTools.formatJSON(raw, opts.indent || 2));

  const tool = TOOLS.find((t) => t.id === "json");

  return (
    <>
      <Helmet>
        <title>JSON Formatter & Validator — FormatX | Format JSON Online Free</title>
        <meta name="description" content="Free online JSON formatter and validator. Format, beautify, and validate JSON with custom indentation. No installation required. Perfect for developers." />
        <meta name="keywords" content="json formatter, json validator, json beautifier, format json, pretty print json" />
        <meta property="og:title" content="JSON Formatter — FormatX" />
        <meta property="og:description" content="Format and validate JSON instantly with custom indentation options." />
        <link rel="canonical" href="https://formatx.vercel.app/json-formatter" />
      </Helmet>
      <ToolPage
        tool={tool}
        input={input}
        setInput={setInput}
        output={output}
        error={error}
        isLoading={isLoading}
        indent={indent}
        setIndent={setIndent}
        onCopy={copy}
        onClear={clear}
        onLoadSample={() => loadSample(tool.sampleInput)}
        onMinify={() => {
          try {
            const minified = jsonTools.minifyJSON(input);
            setInput(minified);
          } catch (e) {
            console.error(e);
          }
        }}
        copied={copied}
      />
    </>
  );
}

function XMLFormatter() {
  const { input, setInput, output, error, isLoading, copy, clear, loadSample, copied } = useFormatter(
    "xml",
    (raw) => xmlTools.formatXML(raw)
  );

  const tool = TOOLS.find((t) => t.id === "xml");

  return (
    <>
      <Helmet>
        <title>XML Formatter & Validator — FormatX | Format XML Online Free</title>
        <meta name="description" content="Free online XML formatter and validator. Format and beautify XML documents with proper indentation and validation. No installation needed." />
        <meta name="keywords" content="xml formatter, xml validator, xml beautifier, format xml, pretty print xml" />
        <meta property="og:title" content="XML Formatter — FormatX" />
        <meta property="og:description" content="Format and validate XML documents instantly with proper tag matching." />
        <link rel="canonical" href="https://formatx.vercel.app/xml-formatter" />
      </Helmet>
      <ToolPage
        tool={tool}
        input={input}
        setInput={setInput}
        output={output}
        error={error}
        isLoading={isLoading}
        onCopy={copy}
        onClear={clear}
        onLoadSample={() => loadSample(tool.sampleInput)}
        copied={copied}
      />
    </>
  );
}

function HTMLFormatter() {
  const { input, setInput, output, error, isLoading, copy, clear, loadSample, copied } = useFormatter(
    "html",
    (raw) => htmlTools.formatHTML(raw)
  );

  const tool = TOOLS.find((t) => t.id === "html");

  return (
    <>
      <Helmet>
        <title>{tool.label} — FormatX</title>
        <meta name="description" content={tool.description} />
        <meta name="keywords" content={tool.keywords} />
      </Helmet>
      <ToolPage
        tool={tool}
        input={input}
        setInput={setInput}
        output={output}
        error={error}
        isLoading={isLoading}
        onCopy={copy}
        onClear={clear}
        onLoadSample={() => loadSample(tool.sampleInput)}
        copied={copied}
      />
    </>
  );
}

function CSSFormatter() {
  const { input, setInput, output, error, isLoading, copy, clear, loadSample, copied } = useFormatter(
    "css",
    (raw) => cssTools.formatCSS(raw)
  );

  const tool = TOOLS.find((t) => t.id === "css");

  return (
    <>
      <Helmet>
        <title>{tool.label} — FormatX</title>
        <meta name="description" content={tool.description} />
        <meta name="keywords" content={tool.keywords} />
      </Helmet>
      <ToolPage
        tool={tool}
        input={input}
        setInput={setInput}
        output={output}
        error={error}
        isLoading={isLoading}
        onCopy={copy}
        onClear={clear}
        onLoadSample={() => loadSample(tool.sampleInput)}
        copied={copied}
      />
    </>
  );
}

function SQLFormatter() {
  const { input, setInput, output, error, isLoading, copy, clear, loadSample, copied } = useFormatter(
    "sql",
    (raw) => sqlTools.formatSQL(raw)
  );

  const tool = TOOLS.find((t) => t.id === "sql");

  return (
    <>
      <Helmet>
        <title>{tool.label} — FormatX</title>
        <meta name="description" content={tool.description} />
        <meta name="keywords" content={tool.keywords} />
      </Helmet>
      <ToolPage
        tool={tool}
        input={input}
        setInput={setInput}
        output={output}
        error={error}
        isLoading={isLoading}
        onCopy={copy}
        onClear={clear}
        onLoadSample={() => loadSample(tool.sampleInput)}
        onMinify={() => {
          try {
            const minified = sqlTools.minifySQL(input);
            setInput(minified);
          } catch (e) {
            console.error(e);
          }
        }}
        copied={copied}
      />
    </>
  );
}

function Base64Encoder() {
  const [mode, setMode] = useState("encode");
  const { input, setInput, output, error, isLoading, copy, clear, loadSample, copied } = useFormatter(
    "base64",
    (raw) => (mode === "encode" ? base64Tools.encodeBase64(raw) : base64Tools.decodeBase64(raw))
  );

  const tool = TOOLS.find((t) => t.id === "base64");

  return (
    <>
      <Helmet>
        <title>{tool.label} — FormatX</title>
        <meta name="description" content={tool.description} />
        <meta name="keywords" content={tool.keywords} />
      </Helmet>
      <ToolPage
        tool={tool}
        input={input}
        setInput={setInput}
        output={output}
        error={error}
        isLoading={isLoading}
        mode={mode}
        onModeChange={setMode}
        onCopy={copy}
        onClear={clear}
        onLoadSample={() => loadSample(tool.sampleInput)}
        copied={copied}
      />
    </>
  );
}

function URLEncoder() {
  const [mode, setMode] = useState("encode");
  const { input, setInput, output, error, isLoading, copy, clear, loadSample, copied } = useFormatter(
    "url",
    (raw) => (mode === "encode" ? urlTools.encodeURL(raw) : urlTools.decodeURL(raw))
  );

  const tool = TOOLS.find((t) => t.id === "url");

  return (
    <>
      <Helmet>
        <title>{tool.label} — FormatX</title>
        <meta name="description" content={tool.description} />
        <meta name="keywords" content={tool.keywords} />
      </Helmet>
      <ToolPage
        tool={tool}
        input={input}
        setInput={setInput}
        output={output}
        error={error}
        isLoading={isLoading}
        mode={mode}
        onModeChange={setMode}
        onCopy={copy}
        onClear={clear}
        onLoadSample={() => loadSample(tool.sampleInput)}
        copied={copied}
      />
    </>
  );
}

function JWTDecoder() {
  const { input, setInput, output, error, isLoading, copy, clear, loadSample, copied } = useFormatter(
    "jwt",
    (raw) => jwtTools.decodeJWT(raw)
  );

  const tool = TOOLS.find((t) => t.id === "jwt");

  return (
    <>
      <Helmet>
        <title>{tool.label} — FormatX</title>
        <meta name="description" content={tool.description} />
        <meta name="keywords" content={tool.keywords} />
      </Helmet>
      <ToolPage
        tool={tool}
        input={input}
        setInput={setInput}
        output={output}
        error={error}
        isLoading={isLoading}
        onCopy={copy}
        onClear={clear}
        onLoadSample={() => loadSample(tool.sampleInput)}
        copied={copied}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN APP WITH ROUTES
// ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>FormatX — All-in-One Developer Formatter Toolkit</title>
        <meta name="description" content="Free online formatter for JSON, XML, HTML, CSS, SQL, Base64, URL and JWT tokens. Fast, clean, no signup required." />
        <meta name="keywords" content="formatter, json formatter, xml formatter, html formatter, css formatter, sql formatter, online tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<JSONFormatter />} />
          <Route path="/json-formatter" element={<JSONFormatter />} />
          <Route path="/xml-formatter" element={<XMLFormatter />} />
          <Route path="/html-formatter" element={<HTMLFormatter />} />
          <Route path="/css-formatter" element={<CSSFormatter />} />
          <Route path="/sql-formatter" element={<SQLFormatter />} />
          <Route path="/base64-encoder" element={<Base64Encoder />} />
          <Route path="/url-encoder" element={<URLEncoder />} />
          <Route path="/jwt-decoder" element={<JWTDecoder />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}