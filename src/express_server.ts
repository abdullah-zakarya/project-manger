import express, { Application } from 'express';
import { IServerConfig } from './utils/config';
import * as config from '../server_config.json';
import { Routes } from './routes';
import * as bodyParser from 'body-parser';

export class ExpressServer {
  private static server: any = null;
  private app: Application;
  public server_config: IServerConfig = config;
  constructor() {
    const port = this.server_config.port ?? 3000;
    // app initializations
    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    // testing app endpoint
    app.get('/ping', (req, res) => {
      res.send('pong');
    });

    const routes = new Routes(app);
    if (routes) {
    }
    ExpressServer.server = app.listen(port, () => {
      console.log(
        `Server is running on port ${port} with pid = ${process.pid}`,
      );
    });
    app.use((error, req, res, next) => {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    });
    this.app = app;
  }
  //close the express server for safe on uncaughtException
  public closeServer(): void {
    if (!ExpressServer.server) return;
    ExpressServer.server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  }
}
