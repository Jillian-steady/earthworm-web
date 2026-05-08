import jsonResponse from "@/utils/jsonResponse";
import { isMockMode } from "@/data/mock";

export const dynamic = "force-dynamic";

const BACKEND = process.env.API_BACKEND_URL || "http://localhost:3001";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ elementId: string }> },
) {
  if (isMockMode) {
    return jsonResponse(true);
  }

  try {
    const { elementId } = await params;
    const token = req.headers.get("Authorization");

    if (!token) {
      return jsonResponse({ message: "Unauthorized" }, 401);
    }

    const data = await fetch(`${BACKEND}/mastered-elements/${elementId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }).then((res) => res.json());

    return jsonResponse(data);
  } catch (e) {
    console.error(e);
    return jsonResponse({ message: "Server error" }, 500);
  }
}
