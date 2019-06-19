import axios from 'axios';
import {OpenConnection} from "../config";
const {generateCode, generateCodes} = require('dhis2-uid');

export class UserService {
    connection: any;

    constructor() {
        if (!this.connection) {
            this.connection = OpenConnection();
        }
    }

    private query(sql, callBack) {
        this.connection.query(sql, callBack);
    }

    private prepareUserName(firstname,surname){
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
                "username": this.prepareUserName(queryRow['firstname'],queryRow['surname']),
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
        this.query(query, (error,results) => {
            onFinishCallBack(results);
        });
    }

    private sendSingleUser(user, credentials, onFinishCallBack) {
        axios.post('http://41.217.202.50/dhis/api/users', user,
            {
                auth: credentials
            })
            .then((res) => {
                onFinishCallBack(res);
            })
            .catch((error) => {
                onFinishCallBack(error);
            })
    }

    sendUsers(idArrays: number[], credentials, onFinishCallBack) {
        let counts = 0;
        this.queryUsers(idArrays, (users) => {
            users.forEach((user)=>{
                counts++;
               const userDhis = this.prepareUser(user);
               let responses = [];
                this.sendSingleUser(userDhis, credentials, (response) => {
                    console.log(response);
                    counts++;
                    responses = [
                        ...responses,
                        response
                    ];
                    if (idArrays.length === counts) {
                        onFinishCallBack(responses);
                    }

                });


            });


        });

    }
}