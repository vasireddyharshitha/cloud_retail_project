'use strict';
var { sql, poolPromise }  = require('./../../config/db.config');

//User object create
var User = function(user){
  this.firstname     = User.firstname;
  this.lastname      = User.lastname;
  this.email         = User.email;
  this.password      = User.password;
};

User.create = async function (newuser, result) {
var sqlqry = 'insert into ucuser values (@fname, @lname, @email, @pwd)';
  try {
    const pool = await poolPromise;
    const res = await pool.request()
    .input('fname', sql.VarChar , newuser.firstname)
    .input('lname', sql.VarChar , newuser.lastname)
    .input('email', sql.VarChar , newuser.email)
    .input('pwd', sql.VarChar, newuser.password)
    .query(sqlqry);
    console.log(res);
    result(null, res);
  } catch(err) {
    console.log('error: ', err);
    result(err, null);
  }
};

User.findById = async function (email, result) {
  var sqlqry = 'select * from ucuser where email = @email';
  try {
    const pool = await poolPromise;
    const data = await pool.request()
    .input('email', sql.VarChar , email)
    .query(sqlqry);
    var rs = JSON.stringify(data.recordset);
    console.log('rs.firstname---'+rs);
    result(null, data.recordset);
  } catch (err) {
    console.log('error: ', err);
    result(err, null);
  }
};

User.findAll = async function (result) {
/*dbConn.query("select * from ucuser", function (err, res) {
if(err) {
  console.log("error: ", err);
  result(null, err);
}
else{
  console.log('Users : ', res);
  result(null, res);
}
});*/
};

User.getSample = async function (hnum, result) {
  console.log('hnum----'+hnum);
  //var sqlqry = 'select HOUSEHOLDS.HSHD_NUM, BASKET_NUM, PURCHASE_DATE, PRODUCTS.PRODUCT_NUM, DEPARTMENT, COMMODITY, SPEND, UNITS, STORE_REGION, WEEK_NUM, YEAR, LOYALTY_FLAG, AGE_RANGE, MARITAL_STATUS, INCOME_RANGE, HOMEOWNER_DESC, HSHD_COMPOSITION, HSHD_SIZE, CHILDREN FROM HOUSEHOLDS, TRANSACTIONS_T, PRODUCTS WHERE HOUSEHOLDS.HSHD_NUM = @hnum AND HOUSEHOLDS.HSHD_NUM = TRANSACTIONS_T.HSHD_NUM AND TRANSACTIONS_T.PRODUCT_NUM = PRODUCTS.PRODUCT_NUM';
  var sqlqry = 'SELECT HSHD_NUM, LOYALTY_FLAG, AGE_RANGE, MARITAL_STATUS, INCOME_RANGE, HOMEOWNER_DESC, HSHD_COMPOSITION, HSHD_SIZE, CHILDREN FROM HOUSEHOLDS ORDER BY HSHD_NUM';  
  try {
      const pool = await poolPromise;
      const data = await pool.request()
      .input('hnum', sql.VarChar , hnum)
      .query(sqlqry);
      var rs = JSON.stringify(data.recordset);
      console.log('rs.firstname---'+rs);
      result(null, data.recordset);
    } catch (err) {
      console.log('error: ', err);
      result(err, null);
    }
  };

  User.getAgeRangeData = async function (req, result) {
    //var sqlqry = 'select AGE_RANGE, YEAR, SUM(SPEND) AS SPENT FROM HOUSEHOLDS,TRANSACTIONS WHERE HOUSEHOLDS.HSHD_NUM = TRANSACTIONS.HSHD_NUM GROUP BY AGE_RANGE, YEAR ORDER BY YEAR, AGE_RANGE';
    var sqlqry = 'SELECT * FROM AGE_RANGE_TABLE';
    //var sqlqry = 'SELECT AGE_RANGE, SPENT, COMMODITY FROM AGE_RANGE_COMMODITY';
    // var sqlqry = 'select AGE_RANGE, YEAR, SUM(SPEND) AS SPENT FROM HOUSEHOLDS,TRANSACTIONS_T WHERE HOUSEHOLDS.HSHD_NUM = TRANSACTIONS_T.HSHD_NUM GROUP BY AGE_RANGE, YEAR';
    try {
        const pool = await poolPromise;
        
        const data = await pool.request()
        .query(sqlqry);
        //var rs = JSON.stringify(data.recordset);
        //console.log('cdata---'+rs);
        result(null, data.recordset);
      } catch (err) {
        console.log('error: ', err);
        result(err, null);
      }
    };

    User.getHshdSizeData = async function (req, result) {
      var sqlqry = 'select HSHD_SIZE, YEAR, SUM(SPEND) AS SPENT FROM HOUSEHOLDS,TRANSACTIONS_T WHERE HOUSEHOLDS.HSHD_NUM = TRANSACTIONS_T.HSHD_NUM GROUP BY HSHD_SIZE, YEAR';
        try {
          const pool = await poolPromise;
          
          const data = await pool.request()
          .query(sqlqry);
          var rs = JSON.stringify(data.recordset);
          console.log('cdata---'+rs);
          result(null, data.recordset);
        } catch (err) {
          console.log('error: ', err);
          result(err, null);
        }
      };

      User.getMaritalData = async function (req, result) {
        //var sqlqry = 'select MARITAL_STATUS, YEAR, SUM(SPEND) AS SPENT FROM HOUSEHOLDS,TRANSACTIONS_T WHERE HOUSEHOLDS.HSHD_NUM = TRANSACTIONS_T.HSHD_NUM GROUP BY MARITAL_STATUS, YEAR';
        var sqlqry = 'SELECT * FROM MARITAL_STATUS_TABLE';  
        try {
            const pool = await poolPromise;
            
            const data = await pool.request()
            .query(sqlqry);
            var rs = JSON.stringify(data.recordset);
            console.log('getMaritalData---'+rs);
            result(null, data.recordset);
          } catch (err) {
            console.log('error: ', err);
            result(err, null);
          }
        };

        User.getWeekData = async function (req, result) {
          //var sqlqry = 'select HSHD_SIZE, YEAR, SUM(SPEND) AS SPENT FROM HOUSEHOLDS,TRANSACTIONS_T WHERE HOUSEHOLDS.HSHD_NUM = TRANSACTIONS.HSHD_NUM GROUP BY HSHD_SIZE, YEAR';
          var sqlqry = 'SELECT * FROM WEEK_SPEND_TABLE';  
          try {
              const pool = await poolPromise;
              
              const data = await pool.request()
              .query(sqlqry);
              var rs = JSON.stringify(data.recordset);
              console.log('getWeekData---'+rs);
              result(null, data.recordset);
            } catch (err) {
              console.log('error: ', err);
              result(err, null);
            }
          };

          User.getIncomeRangeData = async function (req, result) {
            //var sqlqry = 'select HSHD_SIZE, YEAR, SUM(SPEND) AS SPENT FROM HOUSEHOLDS,TRANSACTIONS_T WHERE HOUSEHOLDS.HSHD_NUM = TRANSACTIONS.HSHD_NUM GROUP BY HSHD_SIZE, YEAR';
            var sqlqry = 'SELECT INCOME_RANGE, (SPENT* 100 / (Select SUM(SPENT) FROM INCOME_RANGE_TABLE)) AS SPENTP FROM INCOME_RANGE_TABLE';  
            try {
                const pool = await poolPromise;
                
                const data = await pool.request()
                .query(sqlqry);
                var rs = JSON.stringify(data.recordset);
                console.log('getIncomeRangeData---'+rs);
                result(null, data.recordset);
              } catch (err) {
                console.log('error: ', err);
                result(err, null);
              }
            };

User.findByHnum = async function (hnum, result) {
  console.log('hnum----'+hnum);
  var sqlqry = 'select HOUSEHOLDS.HSHD_NUM, BASKET_NUM, PURCHASE_DATE, PRODUCTS.PRODUCT_NUM, DEPARTMENT, COMMODITY, SPEND, UNITS, STORE_REGION, WEEK_NUM, YEAR, LOYALTY_FLAG, AGE_RANGE, MARITAL_STATUS, INCOME_RANGE, HOMEOWNER_DESC, HSHD_COMPOSITION, HSHD_SIZE, CHILDREN FROM HOUSEHOLDS, TRANSACTIONS, PRODUCTS WHERE HOUSEHOLDS.HSHD_NUM = @hnum AND HOUSEHOLDS.HSHD_NUM = TRANSACTIONS.HSHD_NUM AND TRANSACTIONS.PRODUCT_NUM = PRODUCTS.PRODUCT_NUM';
    try {
      const pool = await poolPromise;
      
      const data = await pool.request()
      .input('hnum', sql.VarChar , hnum)
      .query(sqlqry);
      var rs = JSON.stringify(data.recordset);
      console.log('rs.firstname---'+rs);
      result(null, data.recordset);
    } catch (err) {
      console.log('error: ', err);
      result(err, null);
    }
  };

  User.getAllData = async function (req, result) {
    //var sqlqry = 'WITH R1 AS (SELECT TOP 10000 * FROM TRANSACTIONS ORDER BY HSHD_NUM ASC), R2 AS (SELECT HSHD_NUM, BASKET_NUM, PURCHASE_DATE, PRODUCTS.PRODUCT_NUM, DEPARTMENT, COMMODITY, SPEND, UNITS, STORE_REGION, WEEK_NUM,YEAR FROM R1 INNER JOIN PRODUCTS ON R1.PRODUCT_NUM = PRODUCTS.PRODUCT_NUM) SELECT HOUSEHOLDS.HSHD_NUM, BASKET_NUM, PURCHASE_DATE, PRODUCT_NUM, DEPARTMENT, COMMODITY, SPEND, UNITS, STORE_REGION, WEEK_NUM,YEAR, LOYALTY_FLAG, AGE_RANGE, MARITAL_STATUS, INCOME_RANGE, HOMEOWNER_DESC, HSHD_COMPOSITION, HSHD_SIZE, CHILDREN FROM R2 INNER JOIN HOUSEHOLDS ON HOUSEHOLDS.HSHD_NUM = R2.HSHD_NUM';
    //var sqlqry = 'WITH R1 AS (SELECT HSHD_NUM, BASKET_NUM, PURCHASE_DATE, PRODUCTS.PRODUCT_NUM, DEPARTMENT, COMMODITY, SPEND, UNITS, STORE_REGION, WEEK_NUM,YEAR FROM TRANSACTIONS_T INNER JOIN PRODUCTS ON TRANSACTIONS_T.PRODUCT_NUM = PRODUCTS.PRODUCT_NUM) SELECT HOUSEHOLDS.HSHD_NUM, BASKET_NUM, PURCHASE_DATE, PRODUCT_NUM, DEPARTMENT, COMMODITY, SPEND, UNITS, STORE_REGION, WEEK_NUM,YEAR, LOYALTY_FLAG, AGE_RANGE, MARITAL_STATUS, INCOME_RANGE, HOMEOWNER_DESC, HSHD_COMPOSITION, HSHD_SIZE, CHILDREN FROM R1 INNER JOIN HOUSEHOLDS ON HOUSEHOLDS.HSHD_NUM = R1.HSHD_NUM';
    var sqlqry = 'WITH R1 AS (SELECT TOP 10000 * FROM TRANSACTIONS_T ORDER BY HSHD_NUM ASC), R2 AS (SELECT HSHD_NUM, BASKET_NUM, PURCHASE_DATE, PRODUCTS.PRODUCT_NUM, DEPARTMENT, COMMODITY, SPEND, UNITS, STORE_REGION, WEEK_NUM,YEAR FROM R1 INNER JOIN PRODUCTS ON R1.PRODUCT_NUM = PRODUCTS.PRODUCT_NUM) SELECT HOUSEHOLDS.HSHD_NUM, BASKET_NUM, PURCHASE_DATE, PRODUCT_NUM, DEPARTMENT, COMMODITY, SPEND, UNITS, STORE_REGION, WEEK_NUM,YEAR, LOYALTY_FLAG, AGE_RANGE, MARITAL_STATUS, INCOME_RANGE, HOMEOWNER_DESC, HSHD_COMPOSITION, HSHD_SIZE, CHILDREN FROM R2 INNER JOIN HOUSEHOLDS ON HOUSEHOLDS.HSHD_NUM = R2.HSHD_NUM';
      try {
        const pool = await poolPromise;
        const data = await pool.request()
        .query(sqlqry);
        //var rs = JSON.stringify(data.recordset);
        //console.log('rs.firstname---'+rs);
        result(null, data.recordset);
      } catch (err) {
        console.log('error: ', err);
        result(err, null);
      }
    };

    User.uploadHouseholds = async function (headers, hjson, response) {
      try {
        var hlength = headers.length;
        const pool = await poolPromise;
        const table = new sql.Table('HOUSEHOLDS');
        table.columns.add('HSHD_NUM', sql.Int, {nullable: true});
        table.columns.add('LOYALTY_FLAG', sql.Bit, {nullable: true});
        table.columns.add('AGE_RANGE', sql.NVarChar(250), {nullable: true});
        table.columns.add('MARITAL_STATUS', sql.NVarChar(50), {nullable: true});
        table.columns.add('INCOME_RANGE', sql.NVarChar(250), {nullable: true});
        table.columns.add('HOMEOWNER_DESC', sql.NVarChar(50), {nullable: true});
        table.columns.add('HSHD_COMPOSITION', sql.NVarChar(50), {nullable: true});
        table.columns.add('HSHD_SIZE', sql.NVarChar(250), {nullable: true});
        table.columns.add('CHILDREN', sql.NVarChar(50), {nullable: true});
        
        hjson.forEach(function(jobj) {
          var hnum = (jobj[headers[0]] != null) ? jobj[headers[0]].trim() : jobj[headers[0]];
          var lf = (jobj[headers[1]] != null) ? jobj[headers[1]].trim() : jobj[headers[1]];
          var ar = (jobj[headers[2]] != null) ? jobj[headers[2]].trim() : jobj[headers[2]];
          var ms = (jobj[headers[3]] != null) ? jobj[headers[3]].trim() : jobj[headers[3]];
          var ir = (jobj[headers[4]] != null) ? jobj[headers[4]].trim() : jobj[headers[4]];
          var hd = (jobj[headers[5]] != null) ? jobj[headers[5]].trim() : jobj[headers[5]];
          var hc = (jobj[headers[6]] != null) ? jobj[headers[6]].trim() : jobj[headers[6]];
          var hs = (jobj[headers[7]] != null) ? jobj[headers[7]].trim() : jobj[headers[7]];
          var ch = (jobj[headers[8]] != null) ? jobj[headers[8]].trim() : jobj[headers[8]];
          //console.log(jobj);
          //console.log(jobj[headers[0]]+","+jobj[headers[1]]+","+jobj[headers[2]]+","+jobj[headers[3]]+","+jobj[headers[4]]+","+jobj[headers[5]]+","+jobj[headers[6]]+","+jobj[headers[7]]+","+jobj[headers[8]]);
          table.rows.add(hnum, lf, ar, ms, ir, hd, hc, hs, ch);
        });
        const res = await pool.request()
        .bulk(table, function(err, result) {
          if (err){
            console.log("Households insertion failed-"+err);
            response("Error during executing a query: " + err, null);
          } else {
            console.log(res);
            console.log("Households insertion completed");
            response(null, result);
          }
        });
        //console.log(res);
        //result(null, res);
      } catch(err) {
        console.log('error: ', err);
        response(err, null);
      }
    };

    User.uploadTransactions = async function (headers, hjson, response) {
      try {
        var hlength = headers.length;
        const pool = await poolPromise;
        const table = new sql.Table('TRANSACTIONS');
        table.columns.add('HSHD_NUM', sql.Int, {nullable: true});
        table.columns.add('BASKET_NUM', sql.Int, {nullable: true});
        table.columns.add('PURCHASE_DATE', sql.Date, {nullable: true});
        table.columns.add('PRODUCT_NUM', sql.Int, {nullable: true});
        table.columns.add('SPEND', sql.Float, {nullable: true});
        table.columns.add('UNITS', sql.SmallInt, {nullable: true});
        table.columns.add('STORE_REGION', sql.NVarChar(50), {nullable: true});
        table.columns.add('WEEK_NUM', sql.TinyInt, {nullable: true});
        table.columns.add('YEAR', sql.SmallInt, {nullable: true});
        
        hjson.forEach(function(jobj) {
          var hnum = (jobj[headers[0]] != null) ? jobj[headers[0]].trim() : jobj[headers[0]];
          var bn = (jobj[headers[1]] != null) ? jobj[headers[1]].trim() : jobj[headers[1]];
          var pd = (jobj[headers[2]] != null) ? jobj[headers[2]].trim() : jobj[headers[2]];
          var pnum = (jobj[headers[3]] != null) ? jobj[headers[3]].trim() : jobj[headers[3]];
          var sp = (jobj[headers[4]] != null) ? jobj[headers[4]].trim() : jobj[headers[4]];
          var un = (jobj[headers[5]] != null) ? jobj[headers[5]].trim() : jobj[headers[5]];
          var sr = (jobj[headers[6]] != null) ? jobj[headers[6]].trim() : jobj[headers[6]];
          var wnum = (jobj[headers[7]] != null) ? jobj[headers[7]].trim() : jobj[headers[7]];
          var yr = (jobj[headers[8]] != null) ? jobj[headers[8]].trim() : jobj[headers[8]];
          //console.log(jobj);
          //console.log(jobj[headers[0]]+","+jobj[headers[1]]+","+jobj[headers[2]]+","+jobj[headers[3]]+","+jobj[headers[4]]+","+jobj[headers[5]]+","+jobj[headers[6]]+","+jobj[headers[7]]+","+jobj[headers[8]]);
          table.rows.add(hnum, bn, pd, pnum, sp, un, sr, wnum, yr);
        });
        const res = await pool.request()
        .bulk(table, function(err, result) {
          if (err){
            console.log("Transactions insertion failed-"+err);
            response("Error during executing a query: " + err, null);
          } else {
            console.log(res);
            console.log("Transactions insertion completed");
            response(null, result);
          }
        });
        //console.log(res);
        //result(null, res);
      } catch(err) {
        console.log('error: ', err);
        response(err, null);
      }
    };

    User.uploadProducts = async function (headers, hjson, response) {
      try {
        var hlength = headers.length;
        const pool = await poolPromise;
        const table = new sql.Table('PRODUCTS');
        table.columns.add('PRODUCT_NUM', sql.Int, {nullable: false});
        table.columns.add('DEPARTMENT', sql.NVarChar(50), {nullable: true});
        table.columns.add('COMMODITY', sql.NVarChar(50), {nullable: true});
        table.columns.add('BRAND_TY', sql.NVarChar(50), {nullable: true});
        table.columns.add('NATURAL_ORGANIC_FLAG', sql.NVarChar(50), {nullable: true});
        
        hjson.forEach(function(jobj) {
          var pnum = (jobj[headers[0]] != null) ? jobj[headers[0]].trim() : jobj[headers[0]];
          var dp = (jobj[headers[1]] != null) ? jobj[headers[1]].trim() : jobj[headers[1]];
          var co = (jobj[headers[2]] != null) ? jobj[headers[2]].trim() : jobj[headers[2]];
          var bt = (jobj[headers[3]] != null) ? jobj[headers[3]].trim() : jobj[headers[3]];
          var nof = (jobj[headers[4]] != null) ? jobj[headers[4]].trim() : jobj[headers[4]];
         
          //console.log(jobj);
          //console.log(jobj[headers[0]]+","+jobj[headers[1]]+","+jobj[headers[2]]+","+jobj[headers[3]]+","+jobj[headers[4]]+","+jobj[headers[5]]+","+jobj[headers[6]]+","+jobj[headers[7]]+","+jobj[headers[8]]);
          table.rows.add(pnum, dp, co, bt, nof);
        });
        const res = await pool.request()
        .bulk(table, function(err, result) {
          if (err){
              console.log("product insertion failed-"+err);
              response("Error during executing a query: " + err, null);
          } else {
            console.log(res);
            console.log("product insertion completed");
            response(null, result);
          }
        });
        //console.log(res);
        //response(null, res);
      } catch(err) {
        console.log('error: ', err);
        response(err, null);
      }
    };


module.exports= User;