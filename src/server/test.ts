import getDatabaseHandle from "./database";
import schema from "./database/schema";

export default function test() {
  let last = new Date();
  const logTime = (tag = "default") => {
    console.log(`+${new Date().getTime() - last.getTime()}ms - ${tag}`);
    last = new Date();
  };

  logTime("start");

  const database = getDatabaseHandle();
  logTime("opened");

  database.migrate(schema);
  logTime("migrated");

  database.flush();
  logTime("flushed");
}
