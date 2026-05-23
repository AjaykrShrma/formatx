// src/hooks/useFormatter.js

import { useState, useCallback } from "react";

export function useFormatter(toolId, formatFunction) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  // Format function
  const format = useCallback(
    (rawInput) => {
      if (!rawInput || !rawInput.trim()) {
        setOutput("");
        setError("");
        return;
      }

      setIsLoading(true);

      setTimeout(() => {
        try {
          const result = formatFunction(rawInput, { indent });
          setOutput(result);
          setError("");
        } catch (err) {
          console.error("Format error:", err);
          setOutput("");
          setError(err.message || "Formatting failed");
        } finally {
          setIsLoading(false);
        }
      }, 50);
    },
    [formatFunction, indent]
  );

  const handleInputChange = useCallback(
    (newInput) => {
      setInput(newInput);
      format(newInput);
    },
    [format]
  );

  const minify = useCallback((minifyFn) => {
    if (!input.trim()) return;
    try {
      const minified = minifyFn(input);
      setInput(minified);
      setOutput(minified);
      setError("");
    } catch (err) {
      setError(err.message);
      setOutput("");
    }
  }, [input]);

  // COPY WITH VISUAL FEEDBACK
  const copy = useCallback(async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      
      // Show "Copied!" for 2 seconds then hide
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  const clear = useCallback(() => {
    setInput("");
    setOutput("");
    setError("");
  }, []);

  const loadSample = useCallback((sampleText) => {
    setInput(sampleText);
    setTimeout(() => {
      try {
        const result = formatFunction(sampleText, { indent });
        setOutput(result);
        setError("");
      } catch (err) {
        setError(err.message);
        setOutput("");
      }
    }, 0);
  }, [formatFunction, indent]);

  const download = useCallback(() => {
    if (!output) return;
    const element = document.createElement("a");
    const file = new Blob([output], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${toolId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [output, toolId]);

  return {
    input,
    setInput: handleInputChange,
    output,
    error,
    isLoading,
    copied,
    indent,
    setIndent,
    format,
    minify,
    copy,
    clear,
    loadSample,
    download,
  };
}