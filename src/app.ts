import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { connect } from './common/database/connect';
import log from './common/logger';
import { configService } from './common/service/config.service';
import routes from './routes';

const port = configService('port');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, async () => {
  try {
    log.info(`Server listening at port ${port}`);

    await connect();

    routes(app);
  } catch (error) {
    log.error(error as Error);
  }
});
