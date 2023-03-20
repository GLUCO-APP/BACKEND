import mysql from 'mysql2/promise';

const dbGluko = mysql.createPool({
    host: 'glukodb.c1kq28okfsde.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'admin2023',
    database: 'gluko',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default dbGluko