import jsonResponse from "@/utils/jsonResponse";
import { isMockMode, getMockLearningActivities } from "@/data/mock";

export const dynamic = "force-dynamic";

const BACKEND = process.env.API_BACKEND_URL || "http://localhost:3001";

export async function GET(req: Request) {
  if (isMockMode) {
    return jsonResponse(getMockLearningActivities());
  }

  try {
    const token = req.headers.get("Authorization");

    if (!token) {
      return jsonResponse({ message: "Unauthorized" }, 401);
    }

    const url = new URL(req.url);
    const searchParams = url.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : "";

    const data = await fetch(`${BACKEND}/user-learning-activities${queryString}`, {
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

export async function POST(req: Request) {
  if (isMockMode) {
    return jsonResponse({ success: true });
  }

  try {
    const token = req.headers.get("Authorization");
    const body = await req.json();

    if (!token) {
      return jsonResponse({ message: "Unauthorized" }, 401);
    }

    const data = await fetch(`${BACKEND}/user-learning-activities`, {
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
