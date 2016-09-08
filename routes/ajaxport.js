var express = require('express');
var mysql = require('./mysql');
var router = express.Router();




//连接数据库
mysql.linkMysql('bw_txl');






//var bodyParser = require('body-parser');
// 该路由使用的中间件
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

/*router.post('/test', function(req, res) {
    console.log(req.body.openid);
    var data = {
        openid: 1
    }
    res.send(data);
});*/




//判断接口
router.post('/panduan', function(req, res) {
    var sqlS = "select cat_name from bw_user where openid = ?";
    mysql.check(sqlS, req.body.openid, function(data) {
        if (data.length > 0) {
            var cat_name = data[0].cat_name;
            var sqlS2 = "select * from bw_user where cat_name = ?";
            mysql.check(sqlS2, cat_name, function(rows) {
                var data = {
                    statu: 1,
                    list: rows
                }
                res.send(data);
            });
            console.log(data);
        } else {
            var data = {
                statu: 0
            };
            res.send(data);
            console.log(data);
        }
    });
    console.log(req.body.openid);
});

//登陆新增数据接口
router.post('/submit', function(req, res) {
    var openid = req.body.openid;
    var nickname = req.body.nickname;
    var name = req.body.name;
    var headimgurl = req.body.headimgurl;
    var telephone = req.body.telephone;
    var cat_name = req.body.cat_name;
    var short = req.body.short;
    var date = req.body.date;
    var sqlS = "select short from bw_category where cat_name = ?";
    mysql.check(sqlS, cat_name, function(rows) {
        //res.send(rows); 常记数据库查询出来的数据为数组对象格式
        if (parseInt(rows[0].short) == short) {
            //增
            var sqlS = "INSERT INTO bw_user(openid,nickname,name,headimgurl,telephone,cat_name,addtime) VALUES(?,?,?,?,?,?,?)";
            var userData = [openid, nickname, name, headimgurl, telephone, cat_name, date];
            mysql.addData(sqlS, userData, function(rows) {
                if (rows.affectedRows >= 1) {
                    var sqlS = "select * from bw_user where cat_name = ?";
                    mysql.check(sqlS, cat_name, function(rows) {
                        var data = {
                            statu: 1,
                            list: rows
                        }
                        res.send(data);
                    });
                } else {
                    var data = {
                        statu: 0
                    }
                    res.send(data);
                }
            });
            console.log('密码正确，登陆成功');
        } else {
            var data = {
                statu: 0
            }
            res.send(data);
            console.log('密码错误，登陆失败');
        }
    });
});


//登陆管理员
router.post('/password', function(req, res) {
    var password = req.body.password;
    var sqlS = "select password from bw_category where cat_name = '董事会'";
    mysql.check(sqlS, '', function(data) {
        if (data[0].password == password) {
            var data = {
                statu: 1
            }
            res.send(data);
        } else {
            var data = {
                statu: 0
            }
            res.send(data);
        }
    });
});

//点击通讯录获取最新数据
router.post('/newPhone', function(req, res) {
    var openid = req.body.openid;
    var sqlS = 'select cat_name from bw_user where openid = ?';
    mysql.check(sqlS, openid, function(rows) {
        var cat_name = rows[0].cat_name;
        var sqlS2 = 'select * from bw_user where cat_name = ?';
        mysql.check(sqlS2, cat_name, function(rows) {
            var data = {
                list: rows
            };
            res.send(data);
        });
    });
});


//分部门查看通讯录
router.post('/phoneCatName', function(req, res) {
    var cat_name = req.body.cat_name;
    var sqlS = "select * from bw_user where cat_name = ?";
    mysql.check(sqlS, cat_name, function(rows) {
        if (rows.length > 0) {
            var data = {
                statu: 1,
                list: rows
            }
            res.send(data);
        } else {
            var data = {
                statu: 0
            }
            res.send(data);
        }

    });
});

//分部门查看工作计划
router.post('/planCatName', function(req, res) {
    var cat_name = req.body.cat_name;
    var date = req.body.date;
    var sqlS = "select * from bw_plan where cat_name = ? AND addtime = ?";
    var userData = [cat_name, date]
    mysql.check(sqlS, userData, function(rows) {
        if (rows.length > 0) {
            var data = {
                statu: 1,
                list: rows
            }
            res.send(data);
        } else {
            var data = {
                statu: 0
            }
            res.send(data);
        }

    });
});


//点击工作计划判断当天是否已经提交工作计划
router.post('/addplanpuanduan', function(req, res) {
    var openid = req.body.openid;
    var date = req.body.date;
    var sqlS = "select plan from bw_plan where openid = ? AND addtime = ?";
    var userData = [openid, date];
    mysql.check(sqlS, userData, function(rows) {
        if (rows.length > 0) {
            var sqlS = "select * from bw_plan where openid = ? order by `id` desc LIMIT 15";
            mysql.check(sqlS, openid, function(rows) {
                var data = {
                    statu: 1,
                    list: rows
                }
                res.send(data);
            });
        } else {
            var data = {
                statu: 0
            }
            res.send(data);
        }
    });
});



//新增工作计划
router.post('/addplan', function(req, res) {
    var openid = req.body.openid;
    var plan = req.body.plan;
    var date = req.body.date;
    var sqlS = "select cat_name,name from bw_user where openid = ?";
    mysql.check(sqlS, openid, function(rows) {
        var cat_name = rows[0].cat_name;
        var name = rows[0].name;
        var sqlS = "INSERT INTO bw_plan(openid,cat_name,name,plan,addtime) VALUES(?,?,?,?,?)";
        var userData = [openid, cat_name, name, plan, date];
        mysql.addData(sqlS, userData, function(rows) {

            if (rows.affectedRows >= 1) {
                var sqlS = "select * from bw_plan where openid = ? order by `id` desc LIMIT 15";
                mysql.check(sqlS, openid, function(rows) {
                    var data = {
                        statu: 1,
                        list: rows
                    }
                    res.send(data);
                });
            } else {
                var data = {
                    statu: 0
                }
                res.send(data);
            }
        });
    });
});




//个人中心
router.post('/personal', function(req, res) {
    var openid = req.body.openid;
    var sqlS = 'select * from bw_user where openid = ?';
    mysql.check(sqlS, openid, function(rows) {
        var data = rows;
        res.send(data);
    });
});

//修改个人中心
router.post('/edit', function(req, res) {
    var openid = req.body.openid;
    var name = req.body.name;
    var cat_name = req.body.cat_name;
    var telephone = req.body.telephone;
    var qq = req.body.qq;
    var email = req.body.email;
    var short = req.body.short;
    var landline = req.body.landline;
    var job = req.body.job;
    var date = req.body.date;
    var sqlS = "update bw_user set name =?,cat_name=?,telephone=?,qq=?,email=?,short=?,landline=?,job=?,updatetime=? where openid=?";
    var userData = [name, cat_name, telephone, qq, email, short, landline, job, date, openid];
    mysql.updata(sqlS, userData, function(rows) {
        var data = {
            statu: 1
        }
        res.send(data);
    });
});


//查看员工详细信息
router.post('/id', function(req, res) {
    var userid = req.body.id;
    var sqlS = "select * from bw_user where `id` = ?";
    mysql.check(sqlS, userid, function(rows) {
        var data = rows;
        res.send(data);
    });
});


//根据时间查询工作计划
router.post('/withTimePlan', function(req, res) {
    var isCat_name_plan = req.body.isCat_name_plan;
    var Cat_name_plan = req.body.Cat_name_plan;
    var openid = req.body.openid;
    var date = req.body.date;
    console.log(isCat_name_plan + "---" + Cat_name_plan + "---" + openid + "---" + date);
    if (isCat_name_plan == 1) {
        var sqlS = "select * from bw_plan where cat_name=? AND addtime = ?";
        var userData = [Cat_name_plan, date];
        mysql.check(sqlS, userData, function(rows) {
            if (rows.length > 0) {
                var data = {
                    statu: 1,
                    list: rows
                }
                res.send(data);
            } else {
                var data = {
                    statu: 0
                }
                res.send(data);
            }
        });
    } else if (isCat_name_plan == 0) {
        console.log(openid);
        var sqlS = "select * from bw_plan where openid=? AND addtime = ?";
        var userData = [openid, date];
        mysql.check(sqlS, userData, function(rows) {
            if (rows.length > 0) {
                var data = {
                    statu: 1,
                    list: rows
                }
                res.send(data);
            } else {
                var data = {
                    statu: 0
                }
                res.send(data);
            }
        });
    }
});


//搜索功能
router.post('/name', function(req, res) {
    var menuNumb = req.body.menuNumb;
    var name = req.body.name;
    if (menuNumb == 1) { //查通讯录
        var sqlS = "select * from bw_user where name = ?";
        mysql.check(sqlS, name, function(rows) {
            if (rows.length > 0) {
                var data = {
                    statu: 1,
                    list: rows
                }
                res.send(data);
            } else {
                var data = {
                    statu: 0
                }
                res.send(data);
            }
        });
    } else if (menuNumb == 2) { //查工作计划
    	var sqlS = "select * from bw_plan where name = ? order by `id` desc LIMIT 15";
    	mysql.check(sqlS, name, function(rows) {
            if (rows.length > 0) {
                var data = {
                    statu: 1,
                    list: rows
                }
                res.send(data);
            } else {
                var data = {
                    statu: 0
                }
                res.send(data);
            }
        });
    }
});


module.exports = router;
