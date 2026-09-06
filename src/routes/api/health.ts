import { createFileRoute } from "@tanstack/react-router";
import { corsHeaders, json } from "@/lib/club-api.server";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) =>
        new Response(null, { status: 204, headers: corsHeaders(request) }),
      GET: async ({ request }) => json({ status: "ok" }, 200, request),
    },
  },
});
