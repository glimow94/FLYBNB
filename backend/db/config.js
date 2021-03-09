exports.config = {
    connectionLimit : 100,
    waitForConnections : true,
    queueLimit :0,
    host: 'localhost',
    // Non usiamo *** mai *** root senza password
    user: '',
    password: '',
    database: 'flybnb',
    debug    :  true,
    wait_timeout : 28800,
    connect_timeout :10
    //multipleStatements: true // consente query multiple in un'unica istruzione SQL
}
