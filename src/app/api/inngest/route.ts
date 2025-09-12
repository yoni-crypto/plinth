import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { syncUser, sendWeeklyDigest, processWebhook } from "@/lib/jobs/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUser, sendWeeklyDigest, processWebhook],
});
