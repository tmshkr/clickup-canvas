import { readFileSync } from "fs";
import { sync } from "./src/sync";

main();
async function main() {
  const { COURSES_JSON } = process.env;
  if (!COURSES_JSON) {
    throw new Error("COURSES_JSON file path is required");
  }

  try {
    var courses = JSON.parse(readFileSync(COURSES_JSON, "utf8"));
  } catch (err) {
    throw new Error(`Error reading JSON file: ${err.message}`);
  }
  if (!Array.isArray(courses)) {
    throw new Error(`JSON file should be an array`);
  }

  for (const { courseId, courseName, listId } of courses) {
    console.log(`************ Processing course ${courseName} *************`);
    await sync({ courseId, listId });
    console.log(`********** Done processing course ${courseName} **********`);
    console.log();
  }
}
