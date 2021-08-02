'use strict';
const sql = require('mssql');

const config = {
  server: 'dynamicduo.database.windows.net',
  user: 'dynamic_duo',
  password: 'Cloud@123',
  database: 'dynamicduo'
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL',pool)
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

module.exports = {
  sql, poolPromise
};