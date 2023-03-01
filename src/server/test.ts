import getDatabaseHandle from "./database";

export default function test() {
  let last = new Date();
  const logTime = (tag = "default") => {
    console.log(`+${new Date().getTime() - last.getTime()}ms - ${tag}`);
    last = new Date();
  };

  logTime("start");

  const database = getDatabaseHandle();
  logTime("opened");

  // database.migrate(schema);
  // logTime("migrated");

  console.log(
    database.simpleSearch
      .user({ email: "zacharycheng@stu.his.ac.jp" })
      .map((result) =>
        result.toSharedModel(() => {
          throw new Error();
        })
      )
  );

  // database.flush();
  // logTime("flushed");
}
