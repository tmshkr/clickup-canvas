import { fetchAssignments } from "./canvas/fetchAssignments";
import { getTasksForList } from "./clickup/getTasksForList";
import { updateTask } from "./clickup/updateTask";
import { createTask } from "./clickup/createTask";
import { ClickupTask } from "./clickup/types";
import { prisma } from "./prisma";

const getIsoString = (date?: Date | string | null) =>
  date ? new Date(date).toISOString() : undefined;

export async function sync({ courseId, listId }) {
  const tasks = await getTasksForList({ listId });
  const tasksByName = tasks.reduce((map, task) => {
    if (map.has(task.name)) {
      throw new Error(`Duplicate task: ${task.name}`);
    }
    map.set(task.name, task);
    return map;
  }, new Map<string, ClickupTask>());

  const assignments = await fetchAssignments({ courseId });
  for (const assignment of assignments) {
    const assignmentTask = await prisma.assignmentTask.findUnique({
      where: {
        htmlUrl: assignment.html_url,
      },
    });

    // If an AssignmentTask is missing, create it.
    if (!assignmentTask) {
      // If there is already a task for this assignment, use that task.
      let task = tasksByName.get(assignment.name);
      // Otherwise, create a new task in ClickUp.
      if (!task) {
        task = await createTask({
          listId,
          dueAt: assignment.due_at,
          name: assignment.name,
          htmlUrl: assignment.html_url,
        });
      }

      console.log("Creating AssignmentTask:", assignment.name);
      await prisma.assignmentTask.create({
        data: {
          taskId: task.id,
          courseId: courseId,
          htmlUrl: assignment.html_url,
          name: assignment.name,
          dueAt: assignment.due_at ? new Date(assignment.due_at) : undefined,
          listId: listId,
          assignmentId: assignment.id,
        },
      });
    }
    // If the name or due date doesn't match, update it.
    else if (
      assignment.name !== assignmentTask.name ||
      getIsoString(assignment.due_at) !== getIsoString(assignmentTask.dueAt)
    ) {
      await updateTask({
        dueAt: assignment.due_at,
        name: assignment.name,
        taskId: assignmentTask.taskId,
      });
      console.log("Updating AssignmentTask:", assignmentTask.name);
      await prisma.assignmentTask.update({
        where: { taskId: assignmentTask.taskId },
        data: {
          dueAt: assignment.due_at,
          name: assignment.name,
        },
      });
    }
  }
}
