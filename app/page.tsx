"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

function Shell({
  title,
  subtitle,
  badge = "Portfolio demo · local-only",
  children,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{badge}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        </header>
        {children}
        <footer className="mt-10 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800">
          Honest demo: no multi-tenant backend. State (if any) stays in this browser.
        </footer>
      </div>
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50 " +
    className;
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      : variant === "secondary"
        ? "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700"
        : variant === "danger"
          ? "bg-red-600 text-white hover:bg-red-500"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900";
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950";

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, ready]);
  return [value, setValue] as const;
}

function uid() {
  return crypto.randomUUID();
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}


type Rem = { id: string; text: string; when: string; done: boolean };
export default function Home() {
  const [items, setItems] = useLocalStorage<Rem[]>("reminders-v1", [
    { id: "1", text: "Ship portfolio batch", when: new Date().toISOString().slice(0, 16), done: false },
  ]);
  const [text, setText] = useState("");
  const [when, setWhen] = useState(new Date().toISOString().slice(0, 16));
  return (
    <Shell title="Reminders" subtitle="Datetime reminders list stored in localStorage.">
      <div className="mb-4 flex flex-wrap gap-2">
        <input className={`${inputClass} min-w-[12rem] flex-1`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Reminder" />
        <input type="datetime-local" className={inputClass} value={when} onChange={(e) => setWhen(e.target.value)} />
        <Button onClick={() => { if (!text.trim()) return; setItems((p) => [{ id: uid(), text: text.trim(), when, done: false }, ...p]); setText(""); }}>Add</Button>
      </div>
      <ul className="space-y-2">
        {items.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
            <input type="checkbox" checked={r.done} onChange={() => setItems((p) => p.map((x) => x.id === r.id ? { ...x, done: !x.done } : x))} />
            <span className={`flex-1 ${r.done ? "line-through text-zinc-400" : ""}`}>{r.text}</span>
            <span className="text-xs text-zinc-500">{r.when.replace("T", " ")}</span>
            <Button variant="ghost" onClick={() => setItems((p) => p.filter((x) => x.id !== r.id))}>×</Button>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
