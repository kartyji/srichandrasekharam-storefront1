export async function onRequestPost({ request, env }) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return json({ error: "Invalid request." }, 415);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Quietly accept honeypot submissions without storing them.
  if (typeof body.website === "string" && body.website.trim()) {
    return json({ ok: true });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (message.length < 3 || message.length > 3000) {
    return json({ error: "Feedback must be between 3 and 3,000 characters." }, 400);
  }

  if (!env.FEEDBACK_DB) {
    return json({ error: "Feedback service is not configured." }, 503);
  }

  try {
    await env.FEEDBACK_DB.prepare(
      "INSERT INTO feedback (message, permission_to_feature, status) VALUES (?, ?, 'pending')"
    ).bind(message, body.permission === true ? 1 : 0).run();
    return json({ ok: true }, 201);
  } catch {
    return json({ error: "Could not save feedback." }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
