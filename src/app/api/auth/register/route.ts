import { jsonBadRequest } from "@/shared/utils/http";

export async function POST(req: Request) {
  try {
    await req.json();
    throw new Error("Registration disabled");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    return jsonBadRequest(message);
  }
}
