import jsonResponse from "@/utils/jsonResponse";
import { isMockMode, mockRankings } from "@/data/mock";

export const dynamic = "force-dynamic";

const BACKEND = process.env.API_BACKEND_URL || "http://localhost:3001";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ period: string }> },
) {
  const { period } = await params;

  if (isMockMode) {
    return jsonResponse(mockRankings[period] || mockRankings["weekly"]);
  }

  try {
    const token = req.headers.get("Authorization");

    const data = await fetch(`${BACKEND}/rank/progress/${period}`, {
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
