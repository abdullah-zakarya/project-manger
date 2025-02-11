import express, { Application } from "express";
import { IServerConfig } from "./utils/config";
import * as config from "../server_config.json";
import { RoleRoutes } from "./components/roles/roles_routers";
export class ExpressServer {
  private static server: any = null;
  public server_config: IServerConfig = config;
  constructor() {
    const port = this.server_config.port;
    const app = express();
    new RoleRoutes(app);
    app.get("/ping", (req, res) => {
      res.send("pong");
    });
    ExpressServer.server = app.listen(port, () => {
      console.log("express server runing on port" + port);
      console.log("process runnig on ", process.pid);
    });
  }
  public closeServer(): void {
    ExpressServer.server.close();
  }
}
