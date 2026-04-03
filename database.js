const sql = require('mssql');

const config = {
    server: 'localhost',
    options: {
        instanceName: 'SQLEXPRESS',
        trustedConnection: true,
        trustServerCertificate: true
    },
    database: 'GalvaoStore' // O banco que acabamos de criar
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Conectado ao SQL Server (GalvaoStore)');
        return pool;
    })
    .catch(err => console.log('❌ Erro na conexão: ', err));

module.exports = { sql, poolPromise };