import app from "./app/app";
import { env } from "./app/config/env";
import logger from "./app/utils/logger";

app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
});
