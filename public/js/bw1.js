$(window).load(function(e) {
    //添加背景音乐
    /*var audioEle = HyWr.addMp4('media/bg.mp3', true);
    HyWr.setMp4Btn(document.getElementById('micBtn'), audioEle, true);*/
    $.post('/plan/getwxinfo', function(data) {
        wxData = data;
        console.log(wxData);
        openid = wxData.openid;
        headimgurl = wxData.headimgurl;
        nickname = wxData.nickname;
    });


    /*$.post('/plan/ajax/test', {openid:123}, function(data) {
        console.log(data);
    });*/

    //缓存当天日期

    var dateObj = new Date();
    var year = dateObj.getFullYear();
    var month = dateObj.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var day = dateObj.getDate();


    //缓存头部菜单
    var topBox = $('.topBox'),
        topBox_title = $('.topBox .title');
    //缓存底部菜单
    var footer = $('.footer');
    var menuNumb = 1; //1为通讯录 2为工作计划

    //缓存信息数据与$('#all')_demo;
    var phoneListData,
        all = $('#all'),
        allphoneListData,
        seekResult = $('#seekResult');


    //缓存电话列表demo;
    var nameObj = '<li class="springBox"><i class="abso iconDown"></i><div class="levelBox1 name" data-id="',
        sectionObj = '</div><div class="levelBox1 section">',
        phoneObj = '</div><div class="levelBox1 phone"><a href="tel:',
        checkAllBtn = '<li class="springBox"><button id="checkAll"></button></li>';

    //查看详细信息缓存demo;
    var MyCenterPopup = $('.MyCenterPopup'),
        infoTopImg = $('.MyCenterPopup .PopuptopImg'),
        infoName = $('.MyCenterPopup .name'),
        infoBranch = $('.MyCenterPopup .infoBranch'),
        infoDuty = $('.MyCenterPopup .infoDuty'),
        infoPhone = $('.MyCenterPopup .infoPhone'),
        infoQQ = $('.MyCenterPopup .infoQQ'),
        infoMailbox = $('.MyCenterPopup .infoMailbox'),
        infoShortC = $('.MyCenterPopup .infoShortC'),
        infoPlane = $('.MyCenterPopup .infoPlane');

    var infoNameS = new Array();
    var indexL;

    //是否是根据时间查看部门所有人工作计划
    var isCat_name_plan = 0;
    var Cat_name_plan = '';

    //缓存个人中心demo
    var topimg = $('.topimg'),
        labelName = $('.labelName'),
        labelBranch = $('.labelBranch'),
        labelJob = $('.labelJob'),
        labelPhone = $('.labelPhone'),
        labelQQ = $('.labelQQ'),
        labelEmail = $('.labelEmail'),
        labelShort = $('.labelShort'),
        labelPlane = $('.labelPlane');

    //缓存工作计划demo
    var myPlanDate = '<li class="springBox"><div class="levelBox1 date">',
        myPlantext = '</div><div class="levelBox1 plantextBox" data-id=',
        mytext = '><div class="plantext">',
        myicon = '</div><i class="abso iconDown"></i></div></li>';
    var myPlan = $('.myPlan');
    var myPlanList = $('#myPlanList');


    var planName = '<li class="springBox"><div class="levelBox1 name">',
        planSection = '</div><div class="levelBox1 section">',
        planDate = '</div><div class="levelBox1 date">',
        plantextBox = '</div><div class="levelBox1 plantextBox" data-id=',
        plantext = '><div class="plantext">',
        planIconDown = '</div><i class="abso iconDown"></i></div></li>';
    var demandPlan = $('.demandPlan');
    var demandPlanList = $('#demandPlanList');


    //header菜单事件
    + function() {
        var header_menu_btn = $('#header_menu_btn'),
            header_menu_nr = $('#header_menu_nr'),
            mc = null,
            B = true
        docEle = $(document.documentElement),
            oldTop = 0;
        mc = new Hammer(header_menu_btn[0]);

        mc.on('tap', function() {
            if (B == false) return false;
            B = false;

            var isOpenB = header_menu_btn.attr('openB');
            if (isOpenB === 'false') { //打开菜单
                header_menu_btn.attr('openB', 'true').addClass('open');
                oldTop = $(window).scrollTop();
                docEle.addClass('noSrrolll');
                header_menu_nr.fadeIn(200, function() {
                    header_menu_nr.addClass('show');
                    B = true;
                });
            } else {
                header_menu_btn.attr('openB', 'false').removeClass('open');
                header_menu_nr.fadeOut(200, function() {
                    header_menu_nr.removeClass('show');
                    docEle.removeClass('noSrrolll');
                    $(window).scrollTop(oldTop);
                    B = true;
                });
            }
        });
    }();


    HyWr.pageFunc(0);
    HyWr.isLocal(0);
    /*项目上线时打开load*/
    HyWr.lazyLoad('.lazy', function(item) {
        $('#planNumb').html(item.progress + "%");
    }, function(assets) {
        $('#planNumb').html(100 + "%");
        $.post('/plan/ajax/panduan', { openid: openid }, function(data) {
            //data = JSON.parse(data);
            console.log(data);
            phoneListData = data.list;
            if (data.statu == 1) {
                for (var i = 0; i <= phoneListData.length - 1; i++) {
                    all.append(
                        nameObj + phoneListData[i].id + '">' + phoneListData[i].name +
                        sectionObj + phoneListData[i].cat_name +
                        phoneObj + phoneListData[i].telephone + '"></a>' + phoneListData[i].telephone + '</div></li>'
                    );
                };
                HyWr.pageFunc(2, function() {
                    indexL = all.find('li').length;
                    console.log(indexL);
                    for (var i = 0; i <= indexL - 1; i++) {
                        infoNameS.push($('#all li').eq(i).find('.name').html());
                    };
                    console.log(infoNameS);
                    $('#menu').addClass('show');
                    $('.topBox').addClass('show');
                });
            } else if (data.statu == 0) {
                HyWr.pageFunc(1);
            }
        });
    });

    var seLogo = setInterval(function() {
        $('.logo').toggleClass('swing');
    }, 3000);

    HyWr.docId('branchS').onchange = function() {
        $('.branch').val(HyWr.gradeChange('branchS'));
    }





    $("#listBox").mCustomScrollbar({
        callbacks: { //回调
            onCreate: function() {
                HyWr.hammTap('mCSB_1_container', function(e) {
                    var obj = e.target,
                        clickClassify,
                        dataClassN;
                    //console.log(obj);
                    if (obj.getElementsByTagName("a")) {
                        dataClassN = $(obj).data('classn');
                    } else if (obj.getElementsByTagName("li")) {
                        console.log($(obj).find('a'));
                        dataClassN = $(obj).find('a').data('classn');
                    }
                    console.log(dataClassN);
                    if (dataClassN == "board") {
                        clickClassify = '董事会';
                    } else if (dataClassN == "senior") {
                        clickClassify = '高管';
                    } else if (dataClassN == "deputy") {
                        clickClassify = '董办';
                    } else if (dataClassN == "administrative") {
                        clickClassify = '行政部';
                    } else if (dataClassN == "finance") {
                        clickClassify = '财务部';
                    } else if (dataClassN == "housing") {
                        clickClassify = '房产部';
                    } else if (dataClassN == "DigitalMarketing") {
                        clickClassify = '数字营销';
                    } else if (dataClassN == "bigClient") {
                        clickClassify = '大客户部';
                    } else if (dataClassN == "loveDriving") {
                        clickClassify = '爱自游部';
                    } else if (dataClassN == "carBrand") {
                        clickClassify = '汽车品牌';
                    } else if (dataClassN == "originality") {
                        clickClassify = '创意中心';
                    } else if (dataClassN == "provinceDriving") {
                        clickClassify = '省自驾游协会';
                    }
                    if (clickClassify.length > 0 && isPostB) {
                        console.log(clickClassify);
                        isPostB = false;
                        if (menuNumb == 1) {
                            $.post('/plan/ajax/phoneCatName', { cat_name: clickClassify }, function(data) {
                                console.log(data);
                                if (data.statu == 1) {
                                    seekResult.html('');
                                    var phoneListDataS = data.list;
                                    for (b = 0; b <= data.list.length - 1; b++) {
                                        seekResult.append(
                                            nameObj + phoneListDataS[b].id + '">' + phoneListDataS[b].name +
                                            sectionObj + phoneListDataS[b].cat_name +
                                            phoneObj + phoneListDataS[b].telephone + '"></a>' + phoneListDataS[b].telephone + '</div></li>'
                                        );
                                    };
                                    seekResult.append(checkAllBtn);
                                    seekResult.addClass('show');
                                    all.addClass('hide');
                                    $('#header_menu_btn').attr('openb', 'false').removeClass('open');
                                    $('#header_menu_nr').removeClass('show').fadeOut(800);
                                    if (HyWr.docId('checkAll')) {
                                        HyWr.hammTap('checkAll', function() {
                                            seekResult.removeClass('show');
                                            all.removeClass('hide');
                                            $('#checkAll').remove();
                                        });
                                    }
                                } else if (data.statu == 0) {
                                    swal('该部门目前没有联系人', '', 'info');
                                }
                                isPostB = true;
                            });
                        } else if (menuNumb == 2) {
                            var date = year + "-" + month + "-" + day;
                            Cat_name_plan = clickClassify;
                            $.post('/plan/ajax/planCatName', { cat_name: clickClassify, date: date }, function(data) {
                                console.log(data);
                                isCat_name_plan = 1;
                                if (data.statu == 1) {
                                    demandPlanList.html('');
                                    var plandata = data.list;
                                    for (var i = 0; i < plandata.length; i++) {
                                        demandPlanList.append(
                                            planName + plandata[i].name + planSection + plandata[i].cat_name + planDate + plandata[i].addtime + plantextBox + plandata[i].id + plantext + plandata[i].plan + planIconDown
                                        );
                                    }
                                    demandPlanList.append(checkAllBtn);
                                    $('#header_menu_btn').attr('openb', 'false').removeClass('open');
                                    $('#header_menu_nr').removeClass('show').fadeOut(800);
                                    myPlan.removeClass('show');
                                    demandPlan.addClass('show');
                                    if (HyWr.docId('checkAll')) {
                                        HyWr.hammTap('checkAll', function() {
                                            isCat_name_plan = 0;
                                            myPlan.addClass('show');
                                            demandPlan.removeClass('show');
                                            $('#checkAll').remove();
                                        });
                                    }
                                } else if (data.statu == 0) {
                                    swal('该部门今天暂无人提交工作计划', '', 'info');
                                }
                                isPostB = true;
                            });
                        }
                    }
                });
            }
        }
    });
    $("#phoneListBox").mCustomScrollbar({
        callbacks: { //回调
            onCreate: function() {
                HyWr.hammTap('mCSB_2_container', function(e) {
                    var obj = e.target;
                    var dataid;
                    if ($(obj).hasClass('name')) {
                        dataid = $(obj).data('id');
                        console.log(dataid);
                        $.post('/plan/ajax/id', { id: dataid }, function(data) {
                            console.log(data);
                            if (data[0].headimgurl.length <= 0) {
                                data[0].headimgurl = 'images/img1/defaulttop.png';
                            }
                            infoTopImg.css('background-image', 'url(' + data[0].headimgurl + ')');
                            infoName.html(data[0].name);
                            infoBranch.html(data[0].cat_name);
                            infoDuty.html(data[0].job);
                            infoPhone.html(data[0].telephone);
                            infoQQ.html(data[0].qq);
                            infoMailbox.html(data[0].email);
                            infoShortC.html(data[0].short);
                            infoPlane.html(data[0].landline);
                            MyCenterPopup.fadeIn(200, function() {
                                $(this).addClass('show');
                            });
                        });
                    }
                });
            }
        }
    });
    $("#setInfoBox").mCustomScrollbar({
        callbacks: { //回调
            onCreate: function() {
                HyWr.hammTap('mCSB_3_container', function(e) {
                    var obj = e.target;
                    if ($(obj).hasClass('toright')) {
                        $(obj).siblings('.inputVal').addClass('editable');
                    } else if (obj.id == "elect") {
                        $('#chooseImage').click();
                    }
                });
                $('.inputVal').blur(function() {
                    if ($(this).val().length > 0) {
                        $(this).siblings('.labelVal').html($(this).val()).removeClass('editable');
                        $(this).val();
                    }
                    $(this).removeClass('editable');
                });
            }
        }
    });


    //  ↓↓↓点击事件↓↓↓
    HyWr.hammTap('content', function(e) {
        var obj = e.target;
        //console.log(obj);
        if (obj.id == "submit") {
            var name = $('#Uname').val();
            var telephone = $('#Utelephone').val();
            var cat_name = $('#Ubranch').val();
            var isShort = $('#Upassword').val();
            if (isPostB) {
                isPostB = false;
                if (name.length > 0 && cat_name.length > 0 && HyWr.isMobile(telephone) == true) {
                    console.log(name + ' ' + telephone + ' ' + cat_name + ' ' + openid);
                    var date = dateObj.getTime();
                    $.post('/plan/ajax/submit', { openid: openid, headimgurl: headimgurl, nickname: nickname, name: name, telephone: telephone, cat_name: cat_name, short: isShort, date: date }, function(data) {
                        //data = JSON.parse(data);
                        console.log(data);
                        phoneListData = data.list;
                        if (data.statu == 1) {
                            for (var i = 0; i <= phoneListData.length - 1; i++) {
                                all.append(
                                    nameObj + phoneListData[i].id + '">' + phoneListData[i].name +
                                    sectionObj + phoneListData[i].cat_name +
                                    phoneObj + phoneListData[i].telephone + '"></a>' + phoneListData[i].telephone + '</div></li>'
                                );
                            };
                            indexL = all.find('li').length;
                            console.log(indexL);
                            for (var i = 0; i <= indexL - 1; i++) {
                                infoNameS.push($('#all li').eq(i).find('.name').html());
                            };
                            console.log(infoNameS);
                            HyWr.pageFunc(2, function() {
                                clearInterval(seLogo);
                                topBox.addClass('show');
                                $('#menu').addClass('show');
                            });
                        } else if (data.statu == 0) {
                            swal('登录失败，请重试', '', 'error');
                        }
                        isPostB = true;
                    });
                } else {
                    //console.log(name+" "+cat_name+" "+telephone);
                    swal('请填写正确的信息~', '', 'error');
                    isPostB = true;
                }
            }
        } else if (obj.id == "myClose") {
            $('.MyCenterPopup').fadeOut('400', function() {
                $(this).removeClass('show');
            });
        } else if (obj.id == "backAndConfirm") {
            if (HyWr.docId('cancel') == undefined) {
                $('.cancel').attr('id', 'cancel');
                setTimeout(function() {
                    HyWr.hammTap('cancel', function() {
                        HyWr.pageFunc(2, function() {
                            topBox.addClass('show');
                            footer.addClass('show');
                        });
                    });
                }, 100);
            }
            sweetAlert({
                title: "您确定要修改吗?",
                text: "Are you sure you want to change?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            }, function() {
                if (isPostB) {
                    isPostB = false;
                    var name = labelName.html(),
                        Branch = labelBranch.html(),
                        Job = labelJob.html(),
                        Phone = labelPhone.html(),
                        QQ = labelQQ.html(),
                        Email = labelEmail.html(),
                        Short = labelShort.html(),
                        Plane = labelPlane.html();
                    var date = dateObj.getTime();
                    if (HyWr.isMobile(Phone) == true) {
                        $.post('/plan/ajax/edit', { openid: openid, name: name, telephone: Phone, cat_name: Branch, qq: QQ, email: Email, short: Short, landline: Plane, job: Job, date: date }, function(data) {
                            console.log(data);
                            if (data.statu == 1) {
                                swal("Succeed!", "Your info has been modified.", "success");
                                HyWr.pageFunc(2, function() {
                                    topBox.addClass('show');
                                    footer.addClass('show');
                                });
                            } else if (data.statu == 0) {
                                swal("修改失败~请重试!", "", "error");
                            }
                            isPostB = true;
                        });
                    } else {
                        swal("请输入正确的信息~", "", "error");
                        isPostB = true;
                    }
                }
            });
            //document.getElementById('format').setAttribute('content','telephone=yes');
        } else if (obj.id == "subPlanBtn") {
            //提交工作计划
            /*  去除可编辑div粘贴进去的html标签                
                var str='<div id=aa>1111</div><div id=bb>222</div>\n\n<div id=cc>3333</div>';
                var re=/<[^>]+>/g;
                str=str.replace(re,"");
                console.log(str);
            */
            //console.log($('#plantextarea').html());
            if (isPostB) {
                isPostB = false;
                var str = $('#plantextarea').html();
                var re = /<[^>]+>/g;
                str = str.replace(re, "");
                var date = year + "-" + month + "-" + day;
                if (str.length > 10) {
                    $.post('/plan/ajax/addplan', { openid: openid, plan: str, date: date }, function(data) {
                        console.log(data);
                        if (data.statu == 1) {
                            myPlanList.html('');
                            swal('提交成功', '', 'success');
                            var plandata = data.list;
                            for (var i = 0; i < plandata.length; i++) {
                                myPlanList.append(
                                    myPlanDate + plandata[i].addtime + myPlantext + plandata[i].id + mytext + plandata[i].plan + myicon
                                );
                            }
                            $('.submitPlan').removeClass('show');
                            $('.lookPlan').addClass('show');
                        } else if (data.statu == 0) {
                            swal('提交失败，请重试~', '', 'error');
                        }
                        isPostB = true;
                    });
                } else {
                    swal('没有输入工作计划或过于简洁', '', 'error');
                    isPostB = true;
                }
            }
        } else if (obj.id == "myPlanClose") {
            $('.myPlanPopup').fadeOut('400', function() {
                $(this).removeClass('show');
            });
        } else if (obj.id == "ck_look") {
            if (isPostB) {
                isPostB = false;
                var date = $('#timeInput').val();
                $.post('/plan/ajax/withTimePlan', { isCat_name_plan: isCat_name_plan, Cat_name_plan: Cat_name_plan, date: date, openid: openid }, function(data) {
                    //console.log(data);
                    if (isCat_name_plan == 1) {
                        //var blackMyPlanListHtml = demandPlanList.html();
                        if (data.statu == 1) {
                            demandPlanList.html('');
                            var plandata = data.list;
                            for (var i = 0; i < plandata.length; i++) {
                                demandPlanList.append(
                                    planName + plandata[i].name + planSection + plandata[i].cat_name + planDate + plandata[i].addtime + plantextBox + plandata[i].id + plantext + plandata[i].plan + planIconDown
                                );
                            }
                            demandPlanList.append(checkAllBtn);
                            $('.myPlan').removeClass('show');
                            $('.demandPlan').addClass('show');
                            if (HyWr.docId('checkAll')) {
                                HyWr.hammTap('checkAll', function() {
                                    isCat_name_plan = 0;
                                    myPlan.addClass('show');
                                    demandPlan.removeClass('show');
                                    $('#checkAll').remove();
                                });
                            }

                        } else if (data.statu == 0) {
                            swal('该部门当天无人提交工作计划~', '', 'info');
                        }
                    } else if (isCat_name_plan == 0) {
                        var blackMyPlanListHtml = myPlanList.html();
                        if (data.statu == 1) {
                            myPlanList.html('');
                            var plandata = data.list;
                            for (var i = 0; i < plandata.length; i++) {
                                myPlanList.append(
                                    myPlanDate + plandata[i].addtime + myPlantext + plandata[i].id + mytext + plandata[i].plan + myicon
                                );
                            }
                            myPlanList.append(checkAllBtn);
                            $('.demandPlan').removeClass('show');
                            $('.myPlan').addClass('show');
                            if (HyWr.docId('checkAll')) {
                                HyWr.hammTap('checkAll', function() {
                                    myPlanList.html(blackMyPlanListHtml);
                                    $('#checkAll').remove();
                                });
                            }

                        } else if (data.statu == 0) {
                            swal('你当天没有提交工作计划哦~', '', 'info');
                        }
                    }
                    isPostB = true;
                });
            }

        }
    });


    HyWr.hammTap('topBox', function(e) {
        var obj = e.target;
        if (obj.id == "adminPasswordSubmit") {
            var password = $('#adminPassword').val();
            console.log(password);
            /*$('.mask3').fadeOut(100);
            $('#adminPassword').fadeOut(100);
            $('#adminPasswordSubmit').fadeOut(100);*/
            if (password.length > 0 && isPostB) {
                isPostB = false;
                $.post('/plan/ajax/password', { password: password }, function(data) {
                    //data = JSON.parse(data);
                    console.log(data);
                    if (data.statu == 1) {
                        //allphoneListData = data.list;
                        $('.mask3').fadeOut(100);
                        $('#adminPassword').fadeOut(100);
                        $('#adminPasswordSubmit').fadeOut(100);
                    } else if (data.statu == 0) {
                        swal('sorry,您没有此权限', '', 'error');
                    }
                    isPostB = true;
                });
            } else {
                swal('请输入密码', '', 'error');
                isPostB = true;
            }
        } else if (obj.id == "myCenter") {
            //document.getElementById('format').setAttribute('content','telephone=no');
            if (isPostB) {
                isPostB = false;
                $.post('/plan/ajax/personal', { openid: openid }, function(data) {
                    //data = JSON.parse(data);
                    console.log(data);
                    if (data[0].headimgurl.length <= 0) {
                        data[0].headimgurl = 'images/img1/defaulttop.png';
                    }
                    topimg.css('background-image', 'url(' + data[0].headimgurl + ')');
                    labelName.html(data[0].name);
                    labelBranch.html(data[0].cat_name);
                    labelJob.html(data[0].job);
                    labelPhone.html(data[0].telephone);
                    labelQQ.html(data[0].qq);
                    labelEmail.html(data[0].email);
                    labelShort.html(data[0].short);
                    labelPlane.html(data[0].landline);
                    $('.labelVal').each(function() {
                        if ($(this).html().length <= 0) {
                            $(this).addClass('editable');
                        }
                    });
                    isPostB = true;
                });
                topBox.removeClass('show');
                HyWr.pageFunc(3, function() {
                    footer.removeClass('show');
                });

            }
        } else if (obj.id == "seekBtn") {
            var seekText = $('#seekT').val();
            if (isPostB) {
                isPostB = false;
                $.post('/plan/ajax/name', { name: seekText, menuNumb: menuNumb }, function(data) {
                    console.log(data);
                    if (menuNumb == 1) {
                        seekResult.html('');
                        var phoneListDataS2 = data.list;
                        for (b = 0; b <= data.list.length - 1; b++) {
                            seekResult.append(
                                nameObj + phoneListDataS2[b].id + '">' + phoneListDataS2[b].name +
                                sectionObj + phoneListDataS2[b].cat_name +
                                phoneObj + phoneListDataS2[b].telephone + '"></a>' + phoneListDataS2[b].telephone + '</div></li>'
                            );
                        };
                        seekResult.append(checkAllBtn);
                        seekResult.addClass('show');
                        all.addClass('hide');
                        $('#header_menu_btn').attr('openb', 'false').removeClass('open');
                        $('#header_menu_nr').removeClass('show').fadeOut(800);
                        if (HyWr.docId('checkAll')) {
                            HyWr.hammTap('checkAll', function() {
                                seekResult.removeClass('show');
                                all.removeClass('hide');
                            });
                        }
                    } else if (menuNumb == 2) {
                        demandPlanList.html('');
                        var plandata = data.list;
                        for (var i = 0; i < plandata.length; i++) {
                            demandPlanList.append(
                                planName + plandata[i].name + planSection + plandata[i].cat_name + planDate + plandata[i].addtime + plantextBox + plandata[i].id + plantext + plandata[i].plan + planIconDown
                            );
                        }
                        demandPlanList.append(checkAllBtn);
                        $('.myPlan').removeClass('show');
                        $('.demandPlan').addClass('show');
                        $('#header_menu_btn').attr('openb', 'false').removeClass('open');
                        $('#header_menu_nr').removeClass('show').fadeOut(800);
                        $('.dateTime').fadeOut(500);
                        if (HyWr.docId('checkAll')) {
                            HyWr.hammTap('checkAll', function() {
                                myPlan.addClass('show');
                                demandPlan.removeClass('show');
                                $('.dateTime').fadeIn(500);
                                $('#checkAll').remove();
                            });
                        }
                    }
                    isPostB = true;
                });
            }
        }
    });


    HyWr.hammTap('menu', function(e) {
        var obj = e.target;
        if (obj.id == "phone_book") {
            menuNumb = parseInt($(obj).data('menu'));
            topBox_title.html('通讯录');
            if (isPostB) {
                isPostB = false;
                $.post('/plan/ajax/newPhone', { openid: openid }, function(data) {
                    all.html('');
                    phoneListData = data.list;
                    for (var i = 0; i <= phoneListData.length - 1; i++) {
                        all.append(
                            nameObj + phoneListData[i].id + '">' + phoneListData[i].name +
                            sectionObj + phoneListData[i].cat_name +
                            phoneObj + phoneListData[i].telephone + '"></a>' + phoneListData[i].telephone + '</div></li>'
                        );
                    };
                    isPostB = true;
                });
            }
            HyWr.pageFunc(2);
        } else if (obj.id == "work_plan") {
            if (isPostB) {
                isPostB = false;
                menuNumb = parseInt($(obj).data('menu'));
                topBox_title.html('工作计划');
                var date = year + "-" + month + "-" + day;
                $.post('/plan/ajax/addplanpuanduan', { openid: openid, date: date }, function(data) {
                    console.log(data);
                    if (data.statu == 1) {
                        myPlanList.html('');
                        var plandata = data.list;
                        for (var i = 0; i < plandata.length; i++) {
                            myPlanList.append(
                                myPlanDate + plandata[i].addtime + myPlantext + plandata[i].id + mytext + plandata[i].plan + myicon
                            );
                        }
                        $('.submitPlan').removeClass('show');
                        $('.lookPlan').addClass('show');
                    } else if (data.statu == 0) {
                        $('.lookPlan').removeClass('show');
                        $('.submitPlan').addClass('show');
                    }
                    HyWr.pageFunc(4);
                    isPostB = true;
                });
            }
        }
    });





    $('#planTextareaBox').mCustomScrollbar({});
    $('#planListScroll').mCustomScrollbar({
        callbacks: { //回调
            onCreate: function() {
                HyWr.hammTap('mCSB_5_container', function(e) {
                    var obj = e.target;
                    //var dataid;
                    if ($(obj).hasClass('plantextBox')) {
                        var text = $(obj).find('.plantext').html();
                        $('.plantext_P').html(text);
                        $('.myPlanPopup').fadeIn(400, function() {
                            $(this).addClass('show');
                        });
                    } else if ($(obj).parent().hasClass('plantextBox')) {
                        var text = $(obj).parent().find('.plantext').html();
                        $('.plantext_P').html(text);
                        $('.myPlanPopup').fadeIn(400, function() {
                            $(this).addClass('show');
                        });
                    }
                });
            }
        }
    });
    $('#demandPlanListScroll').mCustomScrollbar({
        callbacks: { //回调
            onCreate: function() {
                HyWr.hammTap('mCSB_6_container', function(e) {
                    var obj = e.target;
                    //var dataid;
                    if ($(obj).hasClass('plantextBox')) {
                        var text = $(obj).find('.plantext').html();
                        $('.plantext_P').html(text);
                        $('.myPlanPopup').fadeIn(400, function() {
                            $(this).addClass('show');
                        });
                    } else if ($(obj).parent().hasClass('plantextBox')) {
                        var text = $(obj).parent().find('.plantext').html();
                        $('.plantext_P').html(text);
                        $('.myPlanPopup').fadeIn(400, function() {
                            $(this).addClass('show');
                        });
                    }
                });
            }
        }
    });

    $('#timeInput').mobiscroll().date({
        theme: 'ios',
        mode: 'mixed',
        display: 'bottom',
        lang: 'zh',
        dateFormat: 'yyyy-mm-dd',
        minDate: new Date(2012, 3, 10, 9, 22),
        maxDate: new Date(2020, 11, 31, 15, 44),
        stepMinute: 5
    });
});
