import * as express from 'express';
import * as bodyParser from 'body-parser';
import {AppRoutes} from "./routes/AppRoutes"; //used to parse the form data that you pass in the request

export class App {

    public app: express.Application;
    public routes: AppRoutes = new AppRoutes();
    constructor() {
        this.app = express(); //run the express instance and store in app
        this.config();
        this.routes.routes(this.app);
    }

    private config(): void {
        const proxyPath = '/v2';
        const proxy = require('path-prefix-proxy')(proxyPath);
        this.app.use(proxyPath, proxy);
        this.app.use(proxy.denyUnproxied);
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({
            extended: false
        }));
    }

}

export default new App().app;
