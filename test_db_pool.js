var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        :'',
    database         :'my-project'
});

var name = 'W';

pool.query('SELECT * FROM user WHERE first_name LIKE ? ', ['%'+ name],function(error,results,fields){
    if(error) throw error;

    console.log(results);
});