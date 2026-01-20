import app from "./app.js";
import { env } from "./config/env.js";

const PORT = env.port || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port: ${PORT}`);
});
