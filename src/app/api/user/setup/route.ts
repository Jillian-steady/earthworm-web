import jsonResponse from "@/utils/jsonResponse";
import { isMockMode } from "@/data/mock";

export const dynamic = "force-dynamic";

const BACKEND = process.env.API_BACKEND_URL || "http://localhost:3001";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization");
    const body = await req.json();

    if (isMockMode) {
      return jsonResponse(body);
    }

    if (!token) {
      return jsonResponse({ message: "Unauthorized" }, 401);
    }

    const data = await fetch(`${BACKEND}/user/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    }).then((res) => res.json());

    return jsonResponse(data);
  } catch (e) {
    console.error(e);
    return jsonResponse({ message: "Server error" }, 500);
  }
}
