"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

type Reminder = { id: string; text: string; when: string; done: boolean };

const STARTER: Reminder[] = [
  { id: "1", text: "Ship portfolio batch", when: "2026-08-24T09:00", done: false },
  { id: "2", text: "Review the next route", when: "2026-08-24T14:30", done: false },
  { id: "3", text: "Archive loose notes", when: "2026-08-25T10:00", done: true },
];

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setValue(JSON.parse(saved) as T);
    } catch {
      // Keep the sample list usable when browser storage is unavailable.
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (ready) localStorage.setItem(key, JSON.stringify(value));
  }, [key, ready, value]);

  return [value, setValue] as const;
}

function readableWhen(value: string) {
  const pieces = value.split("T");
  return pieces[0].replaceAll("-", ".") + " / " + (pieces[1] || "00:00");
}

export default function Home() {
  const [items, setItems] = useLocalStorage<Reminder[]>("reminders-v1", STARTER);
  const [text, setText] = useState("");
  const [when, setWhen] = useState("2026-08-24T16:00");
  const ordered = useMemo(
    () => [...items].sort((a, b) => a.when.localeCompare(b.when)),
    [items],
  );
  const next = ordered.find((item) => !item.done);

  function addReminder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;
    setItems((current) => [
      { id: crypto.randomUUID(), text: text.trim(), when, done: false },
      ...current,
    ]);
    setText("");
  }

  return (
    <main className="tide-shell">
      <div className="tide-frame">
        <header className="tide-masthead">
          <div className="tide-brand">
            <span className="tide-mark" aria-hidden="true">TB</span>
            <span>TIDEBOARD / REMINDERS</span>
          </div>
          <div className="tide-meta">
            <span>LOCAL CURRENT</span>
            <span>NO ALERTS</span>
          </div>
        </header>

        <section className="tide-hero">
          <div>
            <h1>
              Keep the next thing
              <br />
              <em>in sight.</em>
            </h1>
            <p>
              A quiet local board for the messages and dates that should surface
              before they drift out of reach.
            </p>
          </div>
          <div className="tide-horizon">
            <span className="tide-horizon-label">NEXT MARK</span>
            <strong>{next ? readableWhen(next.when).split(" / ")[1] : "--:--"}</strong>
            <span>{next ? next.text : "The board is clear."}</span>
          </div>
        </section>

        <section className="tide-dock">
          <div className="tide-section-head">
            <span className="tide-index">A / MARK</span>
            <span>{items.filter((item) => !item.done).length} open reminders</span>
          </div>
          <h2>Set the next mark.</h2>
          <form className="tide-form" onSubmit={addReminder}>
            <label className="tide-message-field">
              <span>MESSAGE</span>
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="What should stay in view?"
              />
            </label>
            <label>
              <span>WHEN</span>
              <input type="datetime-local" value={when} onChange={(event) => setWhen(event.target.value)} />
            </label>
            <button type="submit">Set reminder</button>
          </form>
          <p className="tide-note">
            This board stores entries in localStorage. It does not send a notification
            or sync to another device.
          </p>
        </section>

        <section className="tide-list" aria-labelledby="tide-list-title">
          <div className="tide-section-head">
            <span className="tide-index">B / CURRENT</span>
            <span>{items.length.toString().padStart(2, "0")} marks on chart</span>
          </div>
          <h2 id="tide-list-title">The current chart.</h2>
          <ol className="tide-rows">
            {ordered.map((item, index) => (
              <li key={item.id} className={"tide-row " + (item.done ? "is-done" : "")}>
                <span className="tide-row-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="tide-row-notch" aria-hidden="true" />
                <div className="tide-row-copy">
                  <strong>{item.text}</strong>
                  <span>{readableWhen(item.when)}</span>
                </div>
                <label className="tide-complete">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() =>
                      setItems((current) =>
                        current.map((value) =>
                          value.id === item.id ? { ...value, done: !value.done } : value,
                        ),
                      )
                    }
                    aria-label={"Complete " + item.text}
                  />
                  <span>{item.done ? "LOGGED" : "OPEN"}</span>
                </label>
                <button
                  className="tide-delete"
                  type="button"
                  onClick={() => setItems((current) => current.filter((value) => value.id !== item.id))}
                  aria-label={"Delete " + item.text}
                >
                  Clear
                </button>
              </li>
            ))}
          </ol>
        </section>

        <footer className="tide-footer">
          <span>BOOK / DEV TOOLS</span>
          <span>MARK · WATCH · CLEAR</span>
        </footer>
      </div>
    </main>
  );
}
