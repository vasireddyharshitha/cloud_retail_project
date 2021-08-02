'use strict';
const User = require('../models/user.model');
const csv = require('csv-parser');
const fs = require('fs');
const multer  = require('multer');
const csvj = require("csvtojson");
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();



exports.findAll = function(req, res) {
User.findAll(function(err, user) {
  console.log('controller')
  if (err)
  res.send(err);
  console.log('res', user);
  res.send(user);
});
};

exports.create = function(req, res) {
    var new_user={
        'firstname': req.body.User.firstname,
        'lastname': req.body.User.lastname,
        'email': req.body.User.email,
        'username': req.body.User.email,
        'password': req.body.User.password
    }
    console.log('req json-- '+req.body.User.firstname);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required fields' });
    }else{
        User.create(new_user, function(err, user) {
            if (err)
                res.send(err);
            else{
                res.json({error:false,message:"User Registered Successfully!",data:user});
            }
        });
    }
};

exports.findById = function(req, res) {
User.findById(req.params.id, function(err, user) {
  if (err)
  res.send(err);
  res.json(user);
});
};

exports.authenticate=function(req,res){
    var email=req.body.email;
    var password=req.body.password;
   
    User.findById(req.body.email, function (error, users) {
      if (error) {
          res.json({
            status:false,
            message:'Error: '+error
            });
      }else{
        if(users.length >0){
            console.log('users data-'+users);
            console.log('users data-'+users[0]);
            var user = JSON.parse(JSON.stringify(users[0]));
            console.log(''+user.email+', '+user.pwd);
            if(password==user.pwd){
                console.log("equal password----------------------");
                res.json({
                    status:true,
                    message:'successfully authenticated',
                    data: user
                });
            }else{
                res.json({
                  status:false,
                  message:"Email and password does not match",
                  data: user
                 });
            }
          
        }
        else{
          res.json({
              status:false,    
              message:"Email does not exist."
          });
        }
      }
    });
}

exports.register=function(req,res){
    console.log('start register--'+req.body.email);
    var user={
        'firstname': req.body.firstname,
        'lastname': req.body.lastname,
        'email': req.body.email,
        'password': req.body.password
    }

    User.create(user, function (error, results) {
            if (error) {
                res.json({
                    status: false,
                    message: 'Error: '+error
                });
            } else {
                res.json({
                    status: true,
                    data: results,
                    message: 'User Registered Sucessfully'
                });
            }
        });

    console.log('end register--'+req.body.email);
}

exports.findByHnum = function(req, res) {
    User.findByHnum(req.param('hnum'), function(err, result) {
      if (err)
      res.send(err);
      var jobj = {};
      jobj["data"] = result;
      //jobj["data"].push(result);
      console.log("json obj---"+JSON.stringify(jobj));
      res.json(jobj);
    });
};

exports.getSample = function(req, res) {
    var value = myCache.get("sample");
    console.log("in getSample --"+value);
    if ( value == undefined ){
        User.getSample(req.param('hnum'), function(err, result) {
        if (err)
        res.send(err);
        var jobj = {};
        jobj["data"] = result;
        //jobj["data"].push(result);
        console.log("json obj---"+JSON.stringify(jobj));
        myCache.set("sample", jobj, 3600000);
        res.json(jobj);
        });
    } else {
        console.log("sample data retrieved from cache. No DB hit");
        res.json(value);
    }
};

exports.getAllData = function(req, res) {
    User.getAllData(req, function(err, result) {
      console.log('controller')
      if (err)
      res.send(err);
      var jobj = {};
      jobj["data"] = result;
      //console.log("json obj all----"+JSON.stringify(jobj));
      res.json(jobj);
    });
};

exports.getAgeRangeData = function(req, res) {
    var ardata = myCache.get("ageRangeData");
    console.log("in getAgeRangeData --"+ardata);
    if ( ardata == undefined ){
        User.getAgeRangeData(req, function(err, result) {
            if (err)
                res.send(err);
            if (null != result && result.length > 0) {
                var labels = [];
                var ymap = {};
                var fmap = {};
                for (var i = 0; i < result.length; i++) {
                    var y = result[i].YEAR;
                    var s = result[i].SPENT;
                    var ar = result[i].AGE_RANGE;
                    var rc = [ar, s];
                    labels.push(ar);
                    ymap[y] =  ymap[y] || [];
                    ymap[y].push(rc);
                }
                fmap["labels"]  = labels;
                fmap["data"] = ymap;
                result = fmap;
            }
           // console.log("json obj---"+JSON.stringify(result));
            myCache.set("ageRangeData", result, 3600000);
            res.json(result);
        });
    } else {
        console.log("sample age range data retrieved from cache. No DB hit");
        res.json(ardata);
    }
};

exports.getMaritalData = function(req, res) {
    var mrdata = myCache.get("maritalData");
    console.log("in getMaritalData --"+mrdata);
    if ( mrdata == undefined ){
        User.getMaritalData(req, function(err, result) {
            if (err)
                res.send(err);
            if (null != result && result.length > 0) {
                var labels = [];
                var ymap = {};
                var fmap = {};
                for (var i = 0; i < result.length; i++) {
                    var y = result[i].MARITAL_STATUS;
                    var s = result[i].SPENT;
                    var ar = result[i].YEAR;
                    if (y == "null") {
                        y = "other";
                    }
                    var rc = [ar, s];
                    labels.push(ar);
                    ymap[y] =  ymap[y] || [];
                    ymap[y].push(rc);
                }
                fmap["labels"]  = labels;
                fmap["data"] = ymap;
                result = fmap;
            }
            console.log("maritalData json obj---"+JSON.stringify(result));
            myCache.set("maritalData", result, 3600000);
            res.json(result);
        });
    } else {
        console.log("sample marital data retrieved from cache. No DB hit");
        res.json(mrdata);
    }
};

exports.getWeekData = function(req, res) {
    var wkdata = myCache.get("wkData");
    console.log("in getWeekData --"+wkdata);
    if ( wkdata == undefined ){
        User.getWeekData(req, function(err, result) {
            if (err)
                res.send(err);
            if (null != result && result.length > 0) {
                var labels = [];
                var ymap = {};
                var fmap = {};
                for (var i = 0; i < result.length; i++) {
                    var y = result[i].YEAR;
                    var s = result[i].SPENT;
                    var ar = result[i].MARITAL_STATUS;
                    if (ar == "null") {
                        ar = "other";
                    }
                    var rc = [ar, s];
                    labels.push(ar);
                    ymap[y] =  ymap[y] || [];
                    ymap[y].push(rc);
                }
                fmap["labels"]  = labels;
                fmap["data"] = ymap;
                result = fmap;
            }
            console.log("wkdata json obj---"+JSON.stringify(result));
            myCache.set("wkData", result, 3600000);
            res.json(result);
        });
    } else {
        console.log("sample marital data retrieved from cache. No DB hit");
        res.json(wkdata);
    }
};

exports.getIncomeRangeData = function(req, res) {
    var irData = myCache.get("irData");
    console.log("in getIncomeRangeData --"+irData);
    if ( irData == undefined ){
        User.getIncomeRangeData(req, function(err, result) {
            if (err)
                res.send(err);
            if (null != result && result.length > 0) {
                var labels = [];
                var xmap = [];
                var fmap = {};
                for (var i = 0; i < result.length; i++) {
                    var s = result[i].SPENTP;
                    var ir = result[i].INCOME_RANGE;
                    if (ir == "null") {
                        ir = "other";
                    }
                    labels.push(ir);
                    xmap.push(s);
                }
                fmap["labels"]  = labels;
                fmap["data"] = xmap;
                result = fmap;
            }
            console.log("irData json obj---"+JSON.stringify(result));
            myCache.set("irData", result, 3600000);
            res.json(result);
        });
    } else {
        console.log("icome range data retrieved from cache. No DB hit");
        res.json(irData);
    }
};


exports.uploadHouseholds = function(req, res) {
    var i = 0;
    var headers = null;
    var hjson = [];
    var file = req.file;
    var oname = file.originalname;

    fs.createReadStream(req.file.path)
    .pipe(csvj())
    .on('data', (row) => {
        var jr = JSON.parse(row);
        if (i==0){
            headers = Object.keys(jr);
            //console.log(i+"----"+jr+"----"+keys);
            console.log(headers.length+"......"+headers[0]);
        }
        hjson.push(jr);
        i++;
    })
    .on('end', () => {
        console.log(hjson);
       User.uploadHouseholds(headers, hjson, function (error, results) {
            if (error) {
                console.log("Household data insertion failed");
                res.json({
                    status: false,
                    message: 'Error: '+error
                });
            } else {
                console.log("Household data inserted to DB successfully");
                res.json({
                    status: true,
                    message: oname+" uploaded successfully"
                });
            }
        });
        
    });
};

exports.uploadTransactions = function(req, res) {
    var i = 0;
    var headers = null;
    var hjson = [];
    var file = req.file;
    var oname = file.originalname;

    fs.createReadStream(req.file.path)
    .pipe(csvj())
    .on('data', (row) => {
        var jr = JSON.parse(row);
        if (i==0){
            headers = Object.keys(jr);
            //console.log(i+"----"+jr+"----"+keys);
            console.log(headers.length+"......"+headers[0]);
        }
        hjson.push(jr);
        i++;
    })
    .on('end', () => {
        console.log(hjson);
       User.uploadTransactions(headers, hjson, function (error, results) {
            if (error) {
                console.log("Transactions data insertion failed");
                res.json({
                    status: false,
                    message: 'Error: '+error
                });
            } else {
                console.log("Transactions data inserted to DB successfully");
                res.json({
                    status: true,
                    message: oname+" uploaded successfully"
                });
            }
        });
    });
};

exports.uploadProducts = function(req, res) {
    var i = 0;
    var headers = null;
    var hjson = [];
    var file = req.file;
    var oname = file.originalname;

    fs.createReadStream(req.file.path)
    .pipe(csvj())
    .on('data', (row) => {
        var jr = JSON.parse(row);
        if (i==0){
            headers = Object.keys(jr);
            //console.log(i+"----"+jr+"----"+keys);
            console.log(headers.length+"......"+headers[0]);
        }
        hjson.push(jr);
        i++;
    })
    .on('end', () => {
        //console.log(hjson);
       User.uploadProducts(headers, hjson, function (error, results) {
            if (error) {
                res.json({
                    status: false,
                    message: 'Error: '+error
                });
            } else {
                res.json({
                    status: true,
                    message: oname+" uploaded successfully"
                });
            }
        });
    });
};