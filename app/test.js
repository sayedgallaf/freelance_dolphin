const mysql = require('mysql2/promise');



(async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root', // Use 'root' as the username for the root user
        password: '12345678' // Use the root user's password
    });

    const connect = await connection.connect();
})()
