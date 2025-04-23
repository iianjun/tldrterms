import { NextResponse } from "next/server";

// stub out your actual AI calls however you like:
async function performFetching() {
  await new Promise((r) => setTimeout(r, 5000));
}
async function performAnalyzing() {
  await new Promise((r) => setTimeout(r, 5000));
}
async function performSummarizing() {
  await new Promise((r) => setTimeout(r, 5000));
}
export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // 1) fetching
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ status: "fetching" })}\n\n`)
      );
      await performFetching(); // ← your AI “fetch” logic

      // 2) analyzing
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ status: "analyzing" })}\n\n`)
      );
      await performAnalyzing(); // ← your AI “analyze” logic

      // 3) summarizing
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ status: "summarizing" })}\n\n`)
      );
      const summary = await performSummarizing(); // ← your AI “summarize” logic

      // done + payload
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ status: "done", summary })}\n\n`
        )
      );
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
