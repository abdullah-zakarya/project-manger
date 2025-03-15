export interface IServerConfig {
  port: number;
  email_config: {
    user: string;
    password: string;
    from: string;
  };

  db_config: {
    db: string;
    username: string;
    password: string;
    host: string;
    port: number;
    dbname: string;
  };
}
