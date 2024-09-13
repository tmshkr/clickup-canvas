import { canvasClient } from "./client";
const nextPattern = /(?<=<)([\S]*)(?=>; rel="next")/i;

export type CanvasAssignment = {
  id: number;
  description: string;
  due_at?: string;
  assignment_group_id: number;
  created_at: string;
  updated_at: string;
  course_id: number;
  name: string;
  html_url: string;
};

export async function fetchAssignments({
  assignments = [],
  courseId,
  nextUrl,
}: {
  assignments?: CanvasAssignment[];
  courseId: bigint;
  nextUrl?: string;
}) {
  const response = await canvasClient
    .get(nextUrl ?? `courses/${courseId}/assignments`)
    .catch((error) => {
      console.error(error.response.data);
      throw new Error("Failed to pull assignments");
    });

  for (const assignment of response.data) {
    assignments.push(assignment);
  }

  nextUrl = nextPattern.exec(response.headers.link)?.[0];
  if (nextUrl) {
    await fetchAssignments({ assignments, courseId, nextUrl });
  }

  return assignments;
}
