import { createFileRoute } from "@tanstack/react-router";
import { corsHeaders, handleRegister } from "@/lib/club-api.server";

export const Route = createFileRoute("/api/register")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) =>
        new Response(null, { status: 204, headers: corsHeaders(request) }),
      POST: async ({ request }) => handleRegister(request),
    },
  },
});
