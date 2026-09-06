import { createFileRoute } from "@tanstack/react-router";
import { corsHeaders, handleResult } from "@/lib/club-api.server";

export const Route = createFileRoute("/api/result")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) =>
        new Response(null, { status: 204, headers: corsHeaders(request) }),
      POST: async ({ request }) => handleResult(request),
    },
  },
});
