export type ClickupTask = {
  id: string;
  name: string;
  archived: boolean;
  text_content: string;
  date_created: string;
  date_updated: string;
  due_date: string;
  start_date: string;
  list: {
    id: string;
  };
  folder: {
    id: string;
  };
  space: {
    id: string;
  };
  url: string;
};
