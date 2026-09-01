import React from "react";

// Turn an arbitrary submitted-form value into something readable instead of a
// raw JSON blob. Used by the admin company / professional / event "Details"
// modals, which dump whatever the user submitted.

export const prettyLabel = (key: string): string =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bUrl\b/g, "URL")
    .replace(/\bId\b/g, "ID")
    .trim();

const isEmpty = (v: unknown) =>
  v === null ||
  v === undefined ||
  v === "" ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === "object" && v !== null && Object.keys(v).length === 0);

const Dash = () => <span className="text-ink-caption italic">—</span>;

export const PrettyValue: React.FC<{ value: unknown; depth?: number }> = ({
  value,
  depth = 0,
}) => {
  if (isEmpty(value)) return <Dash />;

  if (typeof value === "boolean")
    return <>{value ? "Yes" : "No"}</>;

  if (typeof value === "number") return <>{String(value)}</>;

  if (typeof value === "string") {
    if (/^https?:\/\//i.test(value)) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-status-info hover:underline break-all"
        >
          {value}
        </a>
      );
    }
    return <>{value}</>;
  }

  if (Array.isArray(value)) {
    // Simple list — join with commas.
    if (value.every((x) => x === null || typeof x !== "object")) {
      return <>{value.filter((x) => x !== null && x !== "").join(", ") || <Dash />}</>;
    }
    // List of objects — stack them.
    return (
      <div className="flex flex-col gap-2">
        {value.map((item, i) => (
          <div
            key={i}
            className="pl-3 border-l-2 border-ink-light"
          >
            <PrettyValue value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    return (
      <div className={depth > 0 ? "flex flex-col gap-1" : "flex flex-col gap-1.5"}>
        {Object.entries(value as Record<string, unknown>)
          .filter(([, v]) => !isEmpty(v))
          .map(([k, v]) => (
            <div key={k} className="text-sm">
              <span className="text-ink-caption">{prettyLabel(k)}: </span>
              <span className="text-ink break-words">
                <PrettyValue value={v} depth={depth + 1} />
              </span>
            </div>
          ))}
      </div>
    );
  }

  return <>{String(value)}</>;
};
