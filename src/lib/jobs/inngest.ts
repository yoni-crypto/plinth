import { inngest } from "@/lib/inngest";

export const syncUser = inngest.createFunction(
  { id: "sync-user" },
  async ({ event, step }) => {
    const { user } = event.data as { user: { email: string; id: string } };

    await step.run("send-welcome-email", async () => {
      console.log(`Welcome email sent to ${user.email}`);
    });

    return { userId: user.id };
  }
);

export const sendWeeklyDigest = inngest.createFunction(
  { id: "weekly-digest" },
  async ({ step }) => {
    await step.run("send-digest-emails", async () => {
      console.log("Weekly digest sent");
    });

    return { success: true };
  }
);

export const processWebhook = inngest.createFunction(
  { id: "process-webhook" },
  async ({ event, step }) => {
    const { payload, source } = event.data as { payload: any; source: string };

    await step.run("process-event", async () => {
      console.log(`Processing webhook from ${source}`);
    });

    return { processed: true };
  }
);
