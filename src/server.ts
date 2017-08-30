import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as Helmet from 'helmet';
import { Auth } from './api/auth/auth';
import { Config } from './config';
import { Logger } from './utils/logger/logger';

export class Server {
  private express: express.Express;
  private port: number;
  private logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
    this.port = Config.server.port;
    this.init();
    this.initializePublicRoutes();
    this.initializePrivateRoutes();
  }

  public start() {
    this.express.listen(this.port, () => {
      this.logger.info('EXPRESS: Listening on Port ' + this.port);
    });
  }

  private init() {
    this.express = express();
    this.express.use(Helmet());
    this.express.use(this.logger.getRequestLogger());
    this.express.use(this.logger.getRequestErrorLogger());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
  }

  private initializePublicRoutes() {
    // public routes
    let router: express.Router = express.Router();
    router.get('/', (req, res) => {
      res.json({ message: 'hooray! Welcome to my api!' });
    });
    this.express.use(router);
  }

  private initializePrivateRoutes() {
    Auth.init(this.express);
  }
}
