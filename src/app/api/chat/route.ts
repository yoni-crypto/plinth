import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: `You are Plinth AI, a helpful assistant for developers using the Plinth SaaS starter template. You help with:
- Setting up authentication
- Configuring billing
- Managing organizations
- Using feature flags
- API documentation
- Best practices for SaaS development

Be concise, helpful, and focus on practical solutions.`,
    messages,
  });

  return result.toTextStreamResponse();
}
