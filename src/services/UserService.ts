import {OpenConnection} from "../config";
import {HttpService} from "./HttpService";
import {forkJoin, Observable} from "rxjs";

const {generateCode} = require('dhis2-uid');

export class UserService {
    connection: any;
    httpService: HttpService = new HttpService();

    constructor() {
        if (!this.connection) {
            this.connection = OpenConnection();
        }
    }

    private query(sql, callBack) {
        this.connection.query(sql, callBack);
    }

    private prepareUserName(firstname, surname) {
        return `ussd_${firstname.toLowerCase()}${surname.toLowerCase()}`;
    }

    private prepareUser(queryRow) {
        const userId = generateCode();
        const userCredentialId = generateCode();
        return {
            "id": userId,
            "userCredentials": {
                "id": userCredentialId,
                "userInfo": {
                    "id": userId
                },
                "cogsDimensionConstraints": [],
                "catDimensionConstraints": [],
                "username": this.prepareUserName(queryRow['firstname'], queryRow['surname']),
                "password": "Dhis@2019",
                "userRoles": [
                    {
                        "id": "ZI4hVQsL7Dq"
                    }
                ]
            },
            "surname": queryRow['surname'],
            "firstName": queryRow['firstname'],
            "phoneNumber": queryRow['phoneNumber'],
            "organisationUnits": [
                {
                    "id": queryRow['facilityUID']
                }
            ],
            "dataViewOrganisationUnits": [
                {
                    "id": queryRow['facilityUID']
                }
            ],
            "userGroups": [
                {
                    "id": "hVBwD9TrMQy"
                }
            ],
            "attributeValues": []
        }
    }

    private queryUsers(userIds, onFinishCallBack) {
        const query = `SELECT * FROM new_reg WHERE regNo IN (${userIds})`;
        this.query(query, (error, results) => {
            onFinishCallBack(results);
        });
    }

    private retrieveDHISUser(userIds, credentials): Observable<any> {
        let requestArrays: any[] = [];

        userIds.forEach((userId) => {
            requestArrays = [
                ...requestArrays,
                this.httpService.get(`http://41.217.202.50/dhis/api/users/${userId}`,
                    {
                        auth: credentials
                    })
            ]
        });
        return forkJoin(requestArrays);

    }

    private sendDHISUser(users, credentials): Observable<any> {
        let requestArrays: any[] = [];
        users.forEach((user) => {
            requestArrays = [
                ...requestArrays,
                this.httpService.post('http://41.217.202.50/dhis/api/users', user,
                    {
                        auth: credentials
                    })
            ]
        });
        return forkJoin(requestArrays);
    }

    private updateDHISUser(users, credentials): Observable<any> {
        let requestArrays: any[] = [];
        users.forEach((user) => {
            requestArrays = [
                ...requestArrays,
                this.httpService.put(`http://41.217.202.50/dhis/api/users/${user.id}`, user,
                    {
                        auth: credentials
                    })
            ]
        });
        return forkJoin(requestArrays);
    }

    private deleteDHISUser(users, credentials): Observable<any> {
        let requestArrays: any[] = [];
        users.forEach((userid) => {
            requestArrays = [
                ...requestArrays,
                this.httpService.delete(`http://41.217.202.50/dhis/api/users/${userid}`,
                    {
                        auth: credentials
                    })
            ]
        });
        return forkJoin(requestArrays);
    }


    retrieveUsers(users: any[], credentials, onFinishCallBack) {
        let userIds = [];
        users.forEach((userId) => {
            userIds = [
                ...userIds,
                userId
            ];
        });
        this.retrieveDHISUser(userIds, credentials).subscribe((response) => {
            onFinishCallBack(response);
        }, (error) => {
            onFinishCallBack(error);
        });

    }

    sendUsers(idArrays: number[], credentials, onFinishCallBack) {
        this.queryUsers(idArrays, (users) => {
            let dhisUsers: any[] = [];
            users.forEach((user) => {
                dhisUsers = [
                    ...dhisUsers,
                    this.prepareUser(user)
                ];
            });
            this.sendDHISUser(dhisUsers, credentials).subscribe((response)=>{
                onFinishCallBack(response);
            },(error)=>{
                onFinishCallBack(error);
            });
        });

    }

    updateUsers(users: any[], credentials, onFinishCallBack) {
        let dhisUsers: any[] = [];
        users.forEach((user) => {
            dhisUsers = [
                ...dhisUsers,
                this.prepareUser(user)
            ];
        });
        this.updateDHISUser(dhisUsers, credentials).subscribe((response)=>{
            onFinishCallBack(response);
        },(error)=>{
            onFinishCallBack(error);
        });
    }

    deleteUsers(users: any[], credentials, onFinishCallBack) {
        this.deleteDHISUser(users, credentials);

    }
}