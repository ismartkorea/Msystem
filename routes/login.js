/*
 * 모듈명  : login.js
 * 설명    : 관리자화면 '로그인처리' 에 대한 모듈.
 * 작성일  : 2023년 10월 16일
 * author  : HiBizNet
 * copyright : HiBizNet & GaoSystems
 * version : 1.0
 */
const express = require('express');
const mysql = require('mysql');
//const bodyParser = require('body-parser');
const flash = require('connect-flash');
const config = require('./common/dbconfig');
const conn = mysql.createConnection(config);
const router = express.Router(); 

/*
 *  Express 4.16 이후 버전인 경우
 *  express.json() 으로 대처
 */
//router.use(bodyParser.json());
//router.use(bodyParser.urlencoded({extended:false}));
router.use(express.json());
router.use(express.urlencoded({extended:false}));
router.use(flash());

// login 폼 호출.
router.get('/', (req, res) => {
    console.log('### 로그인 화면 호출 ###');
    var ss = req.session;

    console.log(">>> login.js :: " + JSON.stringify(ss));

    if(ss.usrId==null || ss.usrId==='undefined') {
        res.render('./login/loginForm', {title: '로그인 화면', session : ss});
    } else {
        res.render('./index', {title: '메인 화면', session : ss});
    }

});

// login 처리.
router.post('/process', (req, res) => {
    console.log('### 로그인 처리 ###');
    var ss = req.session;
  
    let usrId = req.body.usrId;
    let usrPwd = req.body.usrPwd;
    let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ipAddress.length < 15) {
        ipAddress = ipAddress;
    } else {
        var nyIP = ipAddress.slice(7);
        ipAddress = nyIP;
    }    
    console.log(">>> session : " + JSON.stringify(ss));

    let rUsrId = ''; let rRet = '';
    let rTitle = '로그인 화면';
    let SQL1 = 'SELECT id as id, AES_DECRYPT(UNHEX(pwd),"hibiznet") as pwd,';
        SQL1 += ' name as name, email as email, telno as telNo';
        SQL1 += ' FROM user_info_tbl WHERE id = ?';
        SQL1 += ' AND AES_DECRYPT(UNHEX(pwd),"hibiznet") = ?;';

    conn.query(SQL1,
        [usrId, usrPwd],
        function (err1, results1) {
            if (err1) {
                console.log('error2 : ', JSON.stringify(err1));
                return res.status(500).json({error: err1});
            } else {
                if (results1[0] != null) {
                    // 세션 저장.
                    ss.usrId = results1[0].id;
                    ss.usrName = results1[0].name;
                    ss.usrEmail = results1[0].email;
                    ss.usrTelNo = results1[0].telNo;
                    ss.usrIp = ipAddress;
                    rUsrId = results1[0].id;

                   rRet = 'OK';
                } else {
                   rRet = 'NO';
                }

                console.log(">>> rTitle : " + rTitle, "result : " + rRet, "session : " + JSON.stringify(ss));

                res.status(200).json({title : rTitle, result : rRet, session: ss});

            } // end else if
        });
});

// 로그아웃처리.
router.get('/logout', (req, res) => {
    console.log("### 로그아웃 처리 호출 ###");

    let ss = req.session;
    let usrId = ss.usrId !=null ? ss.usrId : 'NONE';

    // 삭제처리.
    conn.query('insert into conn_his_tbl(cview, cpage, cid, cin_date, cout_date, cip) values("monitoring", "index", ?,'
        + ' DATE_FORMAT("0000-00-00","%Y-%m-%d %H:%i:%s"), now(), ?);',
        [usrId, ss.usrIp],
        function(err){
            if(err) {
                console.log('error : ', err.message);
                res.render('error', {message: err.message, error : err, session: ss});
            } else {
                // 세션 삭제.
                req.session.destroy(function(err){
                    if(err) {
                        console.log(">>> destroy err: " + err);
                        conn.rollback();
                    } else {
                        req.session;
                        conn.commit();
                    }
                    //conn.end();
                });
                res.redirect('/');
            }
        }
    );

});

module.exports = router;