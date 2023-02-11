import makeSchema from "../libDatabase/makeSchema";
import * as entities from "./entities";

export default makeSchema({
  version: 0,
  entities,
});
