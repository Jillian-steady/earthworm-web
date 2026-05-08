import jsonResponse from "@/utils/jsonResponse";
import { isMockMode, mockRecentCoursePacks } from "@/data/mock";

export const dynamic = "force-dynamic";

const BACKEND = process.env.API_BACKEND_URL || "http://localhost:3001";

export async function GET(req: Request) {
  if (isMockMode) {
    return jsonResponse(mockRecentCoursePacks);
  }

  try {
    const token = req.headers.get("Authorization");

    if (!token) {
      return jsonResponse({ message: "Unauthorized" }, 401);
    }

    const data = await fetch(`${BACKEND}/user-course-progress/recent-course-packs`, {
      method: "GET",
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
