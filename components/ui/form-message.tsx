import type { FormState } from "@/lib/schemas";

// The outcome of an action: an error, a confirmation, or nothing.
export function FormMessage({ error, success }: FormState) {
  if (error) {
    return (
      <p
        role="alert"
        className="rounded-xl bg-destructive/10 px-4 py-3 text-center text-sm font-medium text-destructive"
      >
        {error}
      </p>
    );
  }
  if (success) {
    return (
      <p
        role="status"
        className="rounded-xl bg-primary/10 px-4 py-3 text-center text-sm font-medium text-primary"
      >
        {success}
      </p>
    );
  }
  return null;
}
