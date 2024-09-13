import { AxiosError } from "axios";
import { clickupClient } from "./client";
import { ClickupTask } from "./types";

export async function updateTask({
  taskId,
  dueAt,
  name,
}: {
  taskId: string;
  dueAt?: string;
  name: string;
}) {
  console.log("Updating ClickUp task for assignment:", name);
  return await clickupClient
    .put(`/task/${taskId}`, {
      due_date: dueAt ? new Date(dueAt).valueOf() : undefined,
      due_date_time: !!dueAt,
      name,
    })
    .then(({ data }: { data: ClickupTask }) => {
      console.log("Updated ClickUp task:", data.id, data.name);
      return data;
    })
    .catch((error: AxiosError) => {
      console.error(error.response?.data);
      throw new Error(`Failed to create ClickUp task: ${name}`);
    });
}
