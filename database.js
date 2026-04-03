const sql = require('mssql');

const config = {
    server: 'localhost',
    options: {
        instanceName: 'SQLEXPRESS', // O segredo estava aqui!
        trustedConnection: true,
        trustServerCertificate: true
    },
    database: 'KenzoStore' // Nome do banco que você criou
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