import { clickupClient } from "./client";
import { ClickupTask } from "./types";

export async function getTasksForList({
  listId,
}: {
  listId: string;
}): Promise<ClickupTask[]> {
  const tasks = [];
  await getActiveTasksForList({ listId, page: 0, tasks });
  await getArchivedTasksForList({ listId, page: 0, tasks });
  return tasks;
}

async function getActiveTasksForList({
  listId,
  page,
  tasks,
}: {
  listId: string;
  page: number;
  tasks: ClickupTask[];
}): Promise<ClickupTask[]> {
  return await clickupClient
    .get(`list/${listId}/task`, {
      params: { archived: false, page, include_closed: true },
    })
    .then(async ({ data }) => {
      for (const task of data.tasks) {
        tasks.push(task);
      }
      return data.last_page
        ? tasks
        : await getActiveTasksForList({ listId, page: page + 1, tasks });
    });
}

async function getArchivedTasksForList({
  listId,
  page,
  tasks,
}: {
  listId: string;
  page: number;
  tasks: ClickupTask[];
}): Promise<ClickupTask[]> {
  return await clickupClient
    .get(`list/${listId}/task`, {
      params: { archived: true, page, include_closed: true },
    })
    .then(async ({ data }) => {
      for (const task of data.tasks) {
        tasks.push(task);
      }
      return data.last_page
        ? tasks
        : await getArchivedTasksForList({ listId, page: page + 1, tasks });
    });
}
