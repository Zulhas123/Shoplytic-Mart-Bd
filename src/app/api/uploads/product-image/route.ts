import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { requireAdmin } from "@/infrastructure/api/auth/session";
import { jsonBadRequest, jsonForbidden, jsonOk, jsonUnauthorized } from "@/shared/utils/http";

export const dynamic = "force-dynamic";

function safeExtFromType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/jpeg") return "jpg";
  if (type === "image/webp") return "webp";
  return null;
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("Missing file");

    const ext = safeExtFromType(file.type);
    if (!ext) throw new Error("Unsupported image type (use PNG/JPG/WebP)");
    if (file.size > 3 * 1024 * 1024) throw new Error("Image too large (max 3MB)");

    const bytes = Buffer.from(await file.arrayBuffer());
    const fileName = `product-${crypto.randomUUID()}.${ext}`;

    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(join(uploadsDir, fileName), bytes);

    return jsonOk({ url: `/uploads/${fileName}` });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    if (message === "Unauthorized") return jsonUnauthorized();
    if (message === "Forbidden") return jsonForbidden();
    return jsonBadRequest(message);
  }
}

