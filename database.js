const sql = require('mssql');

const config = {
    server: 'localhost',
    options: {
        instanceName: 'SQLEXPRESS', 
        trustedConnection: true,
        trustServerCertificate: true
    },
    database: 'KenzoStore'
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado ao SQL Server (SQLEXPRESS)');
        return pool;
    })
    .catch(err => {
        console.log('Erro na conexão: ', err.message);
    });

module.exports = { sql, poolPromise };