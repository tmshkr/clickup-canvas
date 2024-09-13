import { AxiosError } from "axios";
import { clickupClient } from "./client";
import { ClickupTask } from "./types";

const { INPUT_DOMAIN } = process.env;

export async function createTask({
  listId,
  dueAt,
  htmlUrl,
  name,
}: {
  listId: string;
  dueAt?: string;
  htmlUrl: string;
  name: string;
}) {
  console.log("Creating ClickUp task for assignment:", name);
  return await clickupClient
    .post(`list/${listId}/task`, {
      description: htmlUrl.replace("canvas.instructure.com", INPUT_DOMAIN!),
      due_date: dueAt ? new Date(dueAt).valueOf() : undefined,
      due_date_time: !!dueAt,
      name,
    })
    .then(({ data }: { data: ClickupTask }) => {
      console.log("Created ClickUp task:", data.id, data.name);
      return data;
    })
    .catch((error: AxiosError) => {
      console.error(error.response?.data);
      throw new Error(`Failed to create ClickUp task: ${name}`);
    });
}
