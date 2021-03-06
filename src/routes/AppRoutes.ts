import {Request, Response} from "express";
import {UserService} from "../services/UserService";


export class AppRoutes {

    userService: UserService = new UserService();

    constructor() {
    }


    public routes(app): void {
        // Route that trigger synchronization action

        app.route('/readUsers')
            .post((req: Request, res: Response) => {
                const requestBody = req.body;
                this.userService.retrieveUsers(requestBody, {username: 'test_user', password: 'Dhis@2019'}, (response) => {
                    res.status(200).send(response);
                });
            });


        app.route('/createUser')
            .post((req: Request, res: Response) => {
                const requestBody = req.body;
                this.userService.sendUsers(requestBody, {username: 'test_user', password: 'Dhis@2019'}, (response) => {
                    res.status(200).send(response);
                });
            });

        app.route('/updateUser')
            .put((req: Request, res: Response) => {
                const requestBody = req.body;
                this.userService.updateUsers(requestBody, {username: 'test_user', password: 'Dhis@2019'}, (response) => {
                    res.status(200).send(response);
                });
        });

        app.route('/deteleUser')
            .delete((req: Request, res: Response) => {
                const requestBody = req.body;
                this.userService.deleteUsers(requestBody, {username: 'test_user', password: 'Dhis@2019'}, (response) => {
                    res.status(200).send(response);
                });
            });
    }
}