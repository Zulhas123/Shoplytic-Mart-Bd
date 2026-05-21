import { ZodError } from "zod";

function formatZodIssuePath(path: Array<string | number>) {
  if (path.length === 0) return "";
  return path
    .map((p) => (typeof p === "number" ? `[${p}]` : `${p}`))
    .join(".")
    .replaceAll(".[", "[");
}

export function errorMessageFromUnknown(err: unknown) {
  if (err instanceof ZodError) {
    const issue = err.issues[0];
    if (!issue) return "Invalid input";
    const path = formatZodIssuePath(issue.path);
    return path ? `${path}: ${issue.message}` : issue.message;
  }

  if (err instanceof SyntaxError && (err.message.includes("JSON") || err.message.includes("Unexpected end"))) {
    return "Invalid JSON body";
  }

  if (err instanceof Error) return err.message;
  return "Invalid request";
}

