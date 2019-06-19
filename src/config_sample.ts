import * as mysql from 'mysql';

// Open Database Connection
export function OpenConnection() {
    return  mysql.createConnection({
        host     : 'localhost',
        database : 'eidsr',
        user     : 'root',
        password : 'mpande88leo',
    });
}