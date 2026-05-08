import jsonResponse from "@/utils/jsonResponse";
import { isMockMode, mockTotalLearningTime } from "@/data/mock";

export const dynamic = "force-dynamic";

const BACKEND = process.env.API_BACKEND_URL || "http://localhost:3001";

export async function GET(req: Request) {
  if (isMockMode) {
    return jsonResponse(mockTotalLearningTime);
  }

  try {
    const token = req.headers.get("Authorization");

    if (!token) {
      return jsonResponse({ message: "Unauthorized" }, 401);
    }

    const url = new URL(req.url);
    const searchParams = url.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : "";

    const data = await fetch(`${BACKEND}/user-learning-activities/total${queryString}`, {
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
