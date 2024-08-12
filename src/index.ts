import app from "./server";
import config from "./config";
import cors from "cors";

app.use(cors());

app.listen(config.port, () => {
  `Server listening at http://localhost:${config.port}`;
});
