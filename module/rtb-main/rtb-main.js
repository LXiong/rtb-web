/**
 * User: aladdin
 * Date: 11/11/13
 * Time: 4:12 PM
 */
$.yyLoadListener('rtb-main', {
    finishedListener: {
        initListener: function(yy) {
            var mianPanel = yy.findInModule('rtb-main-panel');
            mianPanel.loadModule('rtb-list');
            //
            var bottomPanel = yy.findInModule('rtb-bottom-panel');
            bottomPanel.loadModule('rtb-bottom');
            //
            var nickNameForm = yy.findInModule('nick-name-form');
            var nickName = yy.getSession('loginNickName');
            nickNameForm.loadData({
                nickName: nickName
            });
            //查询剩余点数
            var msg = {
                act: 'INQUIRE_POINT'
            };
            yy.sendMessage(msg);
            //初始化position-list
            var positionList = yy.findInModule('position-list');
            positionList.init({
                key: 'positionId',
                itemClazz: 'position_ad fl',
                itemMessageListener: 'rtb-main.positionMessageListener',
                dataToHtml: function(data) {
                    var result = '<div class="yy_ignore box">'
                            + '<div class="box_header">' + data.positionName + '</div>'
                            + '<div class="yy_ignore box_content">'
                            + '<canvas class="yy_image position_ad_image" id="' + data.positionId + '-position-ad" yyHeight="80" yyWidth="80" yyEventListener="rtb-main.positionListener"></canvas>'
                            + '</div>'
                            + '</div>';
                    return result;
                }
            });
            //
            var listData = [
                {positionId: 0, positionName: '0号'},
                {positionId: 1, positionName: '1号'},
                {positionId: 2, positionName: '2号'},
                {positionId: 3, positionName: '3号'},
                {positionId: 4, positionName: '4号'},
                {positionId: 5, positionName: '5号'},
                {positionId: 6, positionName: '6号'},
                {positionId: 7, positionName: '7号'},
                {positionId: 8, positionName: '8号'},
                {positionId: 9, positionName: '9号'}
            ];
            positionList.loadData(listData);
        }
    },
    eventListener: {
        logoutListener: {
            click: function(yy) {
                var mainModule = yy.findInModule('rtb-main');
                mainModule.remove();
                $.yyLoadModule('rtb-login');
            }
        },
        toPayListener: {
            click: function(yy) {
                var mainState = yy.getContext('mainState');
                if (!mainState || mainState !== 'rtb-pay') {
                    var mainPanel = yy.findInModule('rtb-main-panel');
                    mainPanel.removeChildren();
                    mainPanel.loadModule('rtb-pay');
                    yy.setContext({mainState: 'rtb-pay'});
                }
            }
        },
        toMyAdListener: {
            click: function(yy) {
                var mainState = yy.getContext('mainState');
                if (!mainState || mainState !== 'rtb-list') {
                    var mainPanel = yy.findInModule('rtb-main-panel');
                    mainPanel.removeChildren();
                    mainPanel.loadModule('rtb-list');
                    yy.setContext({mainState: 'rtb-list'});
                }
            }
        },
        positionListener: {
            click: function(yy) {
                var data = yy.getContext(yy.key);
                if (data) {
                    var url = data.url;
                    if (url.indexOf('http://') === -1) {
                        url = 'http://' + url;
                    }
                    window.open(url);
                    //记录点击
                    var msg = {
                        act: 'CLICK_AD',
                        positionId: data.positionId,
                        adId: data.adId,
                        bid: data.bid,
                        userId: data.userId,
                        tagId: data.tagId
                    };
                    yy.sendMessage(msg);
                }
            }
        },
        inquireByImeiListener: {
            click: function(yy) {
                var inquireForm = yy.findInModule('imei-inquire-form');
                var data = inquireForm.getData();
                if (data.imei) {
                    //记载imei标签信息
                    var msg = {
                        act: 'INQUIRE_TAG',
                        imei: data.imei
                    };
                    yy.sendMessage(msg);
                    //加载广告位信息
                    msg.act = 'INQUIRE_POSITION_AD';
                    for (var index = 0; index < 10; index++) {
                        msg.positionId = index;
                        yy.sendMessage(msg);
                    }
                }
            }
        }
    },
    messageListener: {
        pointMessageListener: {
            INQUIRE_POINT: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                    var data = message.data;
                    var pointForm = yy.findInModule('point-form');
                    pointForm.loadData(data);
                }
            },
            PAY_FOR_POINT: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                    var data = message.data;
                    var pointForm = yy.findInModule('point-form');
                    pointForm.loadData(data);
                }
            },
            INCREASE_AD_POINT: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                    var data = message.data;
                    var pointForm = yy.findInModule('point-form');
                    pointForm.loadData(data);
                }
            }
        },
        positionMessageListener: {
            INQUIRE_POSITION_AD: function(yy, message) {
                var data = message.data;
                var itemData = yy.getData();
                if (data.positionId === itemData.positionId) {
                    var positionAdId = itemData.positionId + '-position-ad';
                    var positionAd = yy.findInModule(positionAdId);
                    if (message.flag === 'SUCCESS') {
                        var context = {};
                        context[itemData.positionId + '-position-ad'] = data;
                        yy.setContext(context);
                        //
                        var image = new Image();
                        image.src = data.dataUrl;
                        positionAd.drawImage(image, 0, 0, 80, 80);
                    } else {
                        var image = new Image();
                        image.onload = function() {
                            positionAd.drawImage(image, 0, 0, 80, 80);
                        };
                        image.src = 'css/images/empty_ad.jpg';
                    }
                }
            }
        },
        tagMessageListener: {
            INQUIRE_TAG: function(yy, message) {
                if (message.flag === 'SUCCESS') {
                    var data = message.data;
                    yy.setLabel(data.tagIds);
                }
            }
        }
    }
});