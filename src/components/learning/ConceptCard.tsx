"use client";

import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp, Code, Lightbulb, CheckCircle2 } from "lucide-react";

interface ConceptCardProps {
  title: string;
  badge: string;
  type: "csr" | "ssr" | "auth" | "routing" | "api";
  summary: string;
  keyPoints: string[];
  codeSnippet?: string;
  defaultExpanded?: boolean;
}

export default function ConceptCard({
  title,
  badge,
  type,
  summary,
  keyPoints,
  codeSnippet,
  defaultExpanded = false,
}: ConceptCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getTheme = () => {
    switch (type) {
      case "csr":
        return {
          border: "border-sky-200 dark:border-sky-900/60",
          bg: "bg-sky-50/70 dark:bg-sky-950/20",
          badgeBg: "bg-sky-100 text-sky-800 dark:bg-sky-900/80 dark:text-sky-300",
          iconColor: "text-sky-600 dark:text-sky-400",
        };
      case "ssr":
        return {
          border: "border-emerald-200 dark:border-emerald-900/60",
          bg: "bg-emerald-50/70 dark:bg-emerald-950/20",
          badgeBg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300",
          iconColor: "text-emerald-600 dark:text-emerald-400",
        };
      case "auth":
        return {
          border: "border-violet-200 dark:border-violet-900/60",
          bg: "bg-violet-50/70 dark:bg-violet-950/20",
          badgeBg: "bg-violet-100 text-violet-800 dark:bg-violet-900/80 dark:text-violet-300",
          iconColor: "text-violet-600 dark:text-violet-400",
        };
      case "routing":
        return {
          border: "border-amber-200 dark:border-amber-900/60",
          bg: "bg-amber-50/70 dark:bg-amber-950/20",
          badgeBg: "bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-300",
          iconColor: "text-amber-600 dark:text-amber-400",
        };
      default:
        return {
          border: "border-indigo-200 dark:border-indigo-900/60",
          bg: "bg-indigo-50/70 dark:bg-indigo-950/20",
          badgeBg: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/80 dark:text-indigo-300",
          iconColor: "text-indigo-600 dark:text-indigo-400",
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`rounded-2xl border ${theme.border} ${theme.bg} p-4 sm:p-5 transition-all duration-200`}
    >
      <div
        className="flex items-start justify-between cursor-pointer gap-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm ${theme.iconColor} shrink-0`}>
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {title}
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badgeBg}`}>
                {badge}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {summary}
            </p>
          </div>
        </div>

        <button
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 space-y-3 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
              Key Concepts & How it Works:
            </span>
            <ul className="space-y-1.5">
              {keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {codeSnippet && (
            <div className="mt-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-1.5">
                <Code className="w-3.5 h-3.5" />
                <span>Next.js Code Example:</span>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-3.5 rounded-xl text-xs overflow-x-auto font-mono border border-slate-800 leading-relaxed">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
