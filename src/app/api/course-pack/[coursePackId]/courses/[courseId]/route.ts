import jsonResponse from "@/utils/jsonResponse";
import { isMockMode, getMockCourse } from "@/data/mock";

export const dynamic = "force-dynamic";

const BACKEND = process.env.API_BACKEND_URL || "http://localhost:3001";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ coursePackId: string; courseId: string }> },
) {
  const { coursePackId, courseId } = await params;

  if (isMockMode) {
    const course = getMockCourse(coursePackId, courseId);
    if (!course) return jsonResponse({ message: "Not found" }, 404);
    return jsonResponse(course);
  }

  try {
    const token = req.headers.get("Authorization");

    const data = await fetch(
      `${BACKEND}/course-pack/${coursePackId}/courses/${courseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: token }),
        },
      },
    ).then((res) => res.json());

    return jsonResponse(data);
  } catch (e) {
    console.error(e);
    return jsonResponse({ message: "Server error" }, 500);
  }
}
