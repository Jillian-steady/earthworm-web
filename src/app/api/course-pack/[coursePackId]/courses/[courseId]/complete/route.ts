import jsonResponse from "@/utils/jsonResponse";
import { isMockMode, getMockNextCourse } from "@/data/mock";

export const dynamic = "force-dynamic";

const BACKEND = process.env.API_BACKEND_URL || "http://localhost:3001";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ coursePackId: string; courseId: string }> },
) {
  const { coursePackId, courseId } = await params;

  if (isMockMode) {
    const next = getMockNextCourse(coursePackId, courseId);
    return jsonResponse(next);
  }

  try {
    const token = req.headers.get("Authorization");

    if (!token) {
      return jsonResponse({ message: "Unauthorized" }, 401);
    }

    const data = await fetch(
      `${BACKEND}/course-pack/${coursePackId}/courses/${courseId}/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      },
    ).then((res) => res.json());

    return jsonResponse(data);
  } catch (e) {
    console.error(e);
    return jsonResponse({ message: "Server error" }, 500);
  }
}
