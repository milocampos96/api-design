import app from "./server";
import config from "./config";

app.listen(config.port, () => {
  `Server listening at http://localhost:${config.port}`;
});
