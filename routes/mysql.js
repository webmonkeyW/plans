var mysql = require('mysql');
var connection;
exports.linkMysql = function(dataname) {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        //password : 'nodejs',
        database: dataname
    });
    connection.connect();
    console.log('连接数据库' + dataname + '成功');
}


//增
exports.addData = function(sql, userData, callback) {
    connection.query(sql, userData, function(err, rows, fields) {
        if (err) throw err;
        if (callback) callback(rows);
        console.log('执行成功');
    });
}


//删





//改

exports.updata = function(sql,variate,callback){
    connection.query(sql, variate, function(err, rows, fields) {
        if (err) throw err;
        if (callback) callback(rows);
    });
}




//查
exports.check = function(sql, variate, callback) {
    connection.query(sql, variate, function(err, rows, fields) {
        if (err) throw err;
        if (callback) callback(rows);
    });

}


//关闭数据库连接
exports.closeData = function() {
    connection.end();
    console.log("数据库关闭成功！");
}
