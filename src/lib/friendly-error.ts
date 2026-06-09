/**
 * Converts technical error messages into user-friendly messages
 * suitable for toast notifications.
 */
export function getFriendlyError(err: unknown): string {
  if (!err) return "Something went wrong. Please try again.";

  // Extract message from error
  let message = "";
  if (err && typeof err === "object") {
    const e = err as any;
    // Handle Supabase/PostgrestError or generic error objects
    if (e.message && typeof e.message === "string") {
      message = e.message;
    } else if (e.error && typeof e.error === "string") {
      message = e.error;
    } else {
      message = String(err);
    }
  } else if (typeof err === "string") {
    message = err;
  } else {
    message = String(err);
  }

  // Clean the message (remove typical prefixes from error wrappers)
  const cleanPrefixes = ["Error: ", "Server Function Error: ", "PostgrestError: "];
  let checkMessage = message;
  for (const prefix of cleanPrefixes) {
    if (checkMessage.startsWith(prefix)) {
      checkMessage = checkMessage.slice(prefix.length);
    }
  }

  // Check for common error signatures first
  if (checkMessage.includes("Unauthorized") || checkMessage.includes("Forbidden")) {
    return "You don't have permission to do this. Please contact your admin.";
  }
  if (checkMessage.includes("Invalid credentials") || checkMessage.includes("invalid_credentials")) {
    return "Incorrect username or password. Please check and try again.";
  }
  if (checkMessage.includes("session") || checkMessage.includes("not authenticated")) {
    return "Your session has expired. Please log in again.";
  }
  if (checkMessage.includes("already taken") || checkMessage.includes("already exists") || checkMessage.includes("duplicate key")) {
    return "This record already exists or the unique identifier is taken.";
  }
  if (checkMessage.includes("password is too short") || checkMessage.includes("Password should be")) {
    return "Your password must be at least 8 characters long.";
  }
  if (checkMessage.includes("logo_url") || (checkMessage.includes("column") && checkMessage.includes("does not exist"))) {
    return "Database columns are missing. Please execute the SQL script in your Supabase SQL Editor: ALTER TABLE agencies ADD COLUMN IF NOT EXISTS logo_url text;";
  }
  if (checkMessage.includes("PGRST") || checkMessage.includes("relation") || checkMessage.includes("column")) {
    return `A database schema/RLS error occurred: ${checkMessage}`;
  }
  if (checkMessage.includes("network") || checkMessage.includes("fetch") || checkMessage.toLowerCase().includes("failed to fetch")) {
    return "Network connection issue. Please check your internet and try again.";
  }
  if (checkMessage.includes("not found")) {
    return "The requested record was not found. Please refresh the page.";
  }
  if (checkMessage.includes("User not found in your agency")) {
    return "This user is not part of your agency.";
  }
  if (checkMessage.includes("Missing SUPABASE_URL or LPG_SERVICE_ROLE_KEY")) {
    return "Missing SUPABASE_URL or LPG_SERVICE_ROLE_KEY environment variables. Please check your .env configuration.";
  }

  // Try parsing JSON if the message contains JSON
  let parsed: any = null;
  const firstBrace = checkMessage.indexOf("{");
  const firstBracket = checkMessage.indexOf("[");
  let startIdx = -1;
  let endIdx = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    endIdx = checkMessage.lastIndexOf("}");
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    endIdx = checkMessage.lastIndexOf("]");
  }

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const jsonCandidate = checkMessage.slice(startIdx, endIdx + 1);
    try {
      parsed = JSON.parse(jsonCandidate);
    } catch (_) {}
  }

  if (parsed) {
    // Zod validation errors
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0] && typeof parsed[0] === "object") {
      const isZod = "path" in parsed[0] && "message" in parsed[0];
      if (isZod) {
        return parsed
          .map((issue: any) => {
            const field = issue.path?.join(".") || "input";
            const label = field.charAt(0).toUpperCase() + field.slice(1);
            return `${label}: ${issue.message}`;
          })
          .join(", ");
      }
    }

    // JSON error object
    if (typeof parsed === "object") {
      if (parsed.message && typeof parsed.message === "string") {
        return parsed.message;
      }
      if (parsed.error) {
        if (typeof parsed.error === "string") {
          return parsed.error;
        }
        if (typeof parsed.error === "object" && parsed.error.message) {
          return String(parsed.error.message);
        }
      }
    }
  }

  // If the message is already reasonably short and readable, return it directly
  if (checkMessage.length < 150 && !checkMessage.includes("at ") && !checkMessage.includes("stack")) {
    return checkMessage;
  }

  return "Something went wrong. Please check your inputs and try again.";
}
