import { createFileRoute } from "@tanstack/react-router";
import { corsHeaders, handleLeaderboard } from "@/lib/club-api.server";

export const Route = createFileRoute("/api/leaderboard")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) =>
        new Response(null, { status: 204, headers: corsHeaders(request) }),
      GET: async ({ request }) => handleLeaderboard(request),
    },
  },
});
