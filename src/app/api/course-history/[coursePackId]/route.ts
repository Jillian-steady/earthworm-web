import jsonResponse from "@/utils/jsonResponse";
import { isMockMode, getMockCourseHistory } from "@/data/mock";

export const dynamic = "force-dynamic";

const BACKEND = process.env.API_BACKEND_URL || "http://localhost:3001";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ coursePackId: string }> },
) {
  const { coursePackId } = await params;

  if (isMockMode) {
    return jsonResponse(getMockCourseHistory(coursePackId));
  }

  try {
    const token = req.headers.get("Authorization");

    const data = await fetch(`${BACKEND}/course-history/${coursePackId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
    }).then((res) => res.json());

    return jsonResponse(data);
  } catch (e) {
    console.error(e);
    return jsonResponse({ message: "Server error" }, 500);
  }
}
