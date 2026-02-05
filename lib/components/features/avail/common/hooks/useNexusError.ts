import { NexusError } from "@avail-project/nexus-core";

function handler(err: unknown) {
  if (err instanceof NexusError) {
    return {
      code: err?.code,
      message: err?.message,
      context: err?.data?.context,
      details: err?.data?.details,
    };
  } else {
    console.error("Unexpected error:", err);
    return {
      code: "unexpected_error",
      message: "Oops! Something went wrong. Please try again.",
      context: undefined,
      details: undefined,
    };
  }
}
export function useNexusError() {
  return handler;
}
