/*
 * 모듈명  : board.js
 * 설명    : 관리자화면 메뉴 '게시판' 에 대한 모듈.
 * 작성일  : 2017년 10월 21일
 * author  : HiBizNet
 * copyright : JT-LAB
 * version : 1.0
 */
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var config = require('./common/dbconfig');
var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));
router.use(methodOverride("_method"));
router.use(flash());

var conn = mysql.createConnection(config);
conn.connect();

// 게시글 리스트 호출.
router.get('/', function(req, res) {

    var ss = req.session;
    if(ss.usrLevel == '000' || ss.usrLevel == '001' || ss.usrLevel == '002') {

        var srchType = req.query.srchType != null ? req.query.srchType : "";
        var srchText = req.query.srchText != null ? req.query.srchText : "";
        console.log(">>> srchType : " + srchType);
        var addSQL = "";

        if (srchType == "title") {
            addSQL = ' WHERE x.title LIKE concat("%", ?, "%")';
        } else if (srchType == "writer") {
            addSQL = ' WHERE x.writer LIKE concat(?,"%")';
        }
        var reqPage = req.query.page ? parseInt(req.query.page) : 0;
        var offset = 3;
        var page = Math.max(1, reqPage);
        var limit = 10;
        var skip = (page - 1) * limit;

        // 전체 데이타를 조회한 후 결과를 'results' 매개변수에 저장.
        conn.query('SELECT count(*) as cnt FROM board1_inf_tbl ' + addSQL + '; SELECT @rownum:=@rownum+1 as num,'
            + ' x.no as no, concat(LEFT(x.title,15),"...") as title, x.content as content,'
            + ' DATE_FORMAT(ins_dt, "%Y-%m-%d") as date, x.ins_id as writerId, x.ins_nm as writer,'
            + ' x.count as count, (select count(rno) from comment1_inf_tbl where bno = x.no) as rCount'
            + ' FROM board1_inf_tbl x, (SELECT @rownum:=' + skip + ') TMP' + addSQL
            + ' ORDER BY x.no DESC LIMIT ' + skip + ', ' + limit + ";",
            [srchText, srchText],
            function (err, results) {
                if (err) {
                    //console.log('error : ', err.message);
                    res.render('error', {message: err.message, error: err, session: ss});
                } else {
                    var count = results[0][0].cnt;
                    var maxPage = Math.ceil(count / limit);

                    res.render('./admin/board1/list', {
                        title: '게시글 화면',
                        rList: results[1],
                        srchType: srchType,
                        srchText: srchText,
                        page: page,
                        maxPage: maxPage,
                        offset: offset,
                        session: ss
                    });
                }
            });
    } else {
        res.redirect('/admin');
    }
});

// 게시판 검색 처리.
router.post('/search', function(req, res) {

    var ss = req.session;
    console.log(">>> search type = " + req.body.srchType);
    console.log(">>> search word = " + req.body.srchText);
    var srchType = req.body.srchType != null ? req.body.srchType : "";
    var srchText = req.body.srchText != null ? req.body.srchText : "";
    console.log(">>> srchType : " + srchType);
    var addSQL = "";

    if(srchType=="title") {
        addSQL =  ' WHERE x.title like concat("%", ?, "%")';
    } else if(srchType=="writer") {
        addSQL =  ' WHERE x.writer like concat(?,"%")';
    }

    var reqPage = req.query.page ? parseInt(req.query.page) : 0;
    //console.log(">>> reqPage = " + reqPage);
    var offset = 3;
    var page = Math.max(1,reqPage);
    //console.log(">>> page = " + page);
    var limit = 10;
    var skip = (page-1)*limit;
    //console.log(">>> skip = " + skip);

    // 전체 데이타를 조회한 후 결과를 'results' 매개변수에 저장.
    conn.query('SELECT count(*) as cnt FROM board1_inf_tbl ' + addSQL + '; SELECT @rownum:=@rownum+1 as num,'
        + ' x.no as no, concat(LEFT(x.title,15),"...") as title, x.content as content,'
        + ' DATE_FORMAT(ins_dt, "%Y-%m-%d") as date, x.ins_id as writerId, x.ins_nm as writer,'
        + ' x.count as count, (select count(rno) from comment1_inf_tbl where bno = x.no) as rCount'
        + ' FROM board1_inf_tbl x, (SELECT @rownum:=' + skip + ') TMP' + addSQL
        + ' order by x.no desc limit ' + skip + ', ' + limit + ";",
        [srchText, srchText],
        function(err, results) {
            if(err) {
                console.log('error : ', err.message);
                res.render('error', {message: err.message, error : err, session: ss});
            } else {
                var count = results[0][0].cnt;
                var maxPage = Math.ceil(count/limit);
                console.log(">>> maxPage = " + maxPage);

                res.render('./admin/board1/list', {
                    title: '게시글 화면',
                    rList : results[1],
                    srchType: srchType,
                    srchText : srchText,
                    page : page,
                    maxPage: maxPage,
                    offset: offset,
                    session : ss
                });
            }
        });
});

/**
 * 게시글 신규 화면 호출처리.
 */
router.get('/new', function(req, res) {
    console.log('routes 게시글 작성 화면 호출');
    var ss = req.session;

    res.render('./admin/board1/new', {title: '게시글 작성 화면', session : ss});
});

/**
 * 작성 처리.
 */
router.post('/save', function(req, res) {
    console.log('routes 게시글 작성 처리');
    var ss = req.session;
    var ssUsrId = ss.usrId !=null ? ss.usrId : '';
    var title = req.body.title !=null ? req.body.title : '';
    var content = req.body.content !=null ? req.body.content : '';
    var writer = req.body.writer !=null ? req.body.writer : '';

    conn.query('INSERT INTO board1_inf_tbl(title, content, ins_dt, ins_id, ins_nm) values(?, ?, now(), ?, ?)',
        [title, content, ssUsrId, writer],
        function(err, results) {
            if(err) {
                console.log('error : ', err.message);
                res.render('error', {message: err.message, error : err, session: ss});
            } else {
                console.log('result : ', results.message);

                res.redirect('/admin/board1');
            }
        });
});

// 상세 게시글 화면 호출.
router.get('/view/:no', function(req, res) {

    var ss = req.session;
    var no = req.params.no !=null ? req.params.no : '';

    console.log("뷰 조회.");
    // 조회.
    conn.query('SELECT no, title, content, DATE_FORMAT(ins_dt, "%Y-%m-%d") as date, ins_id as writerId,'
        + ' ins_nm as writer, count FROM board1_inf_tbl WHERE no = ?;'
        + ' SELECT count(*) cnt FROM comment1_inf_tbl WHERE bno = ?;'
        + ' SELECT rno as no, bno as bno, comment as comment, DATE_FORMAT(ins_dt,"%Y-%m-%d") as date, ins_id as id,'
        + ' ins_nm as name FROM comment1_inf_tbl WHERE bno = ?;',
        [no, no, no],
        function(err, results) {
            if (err) {
                console.log('error : ', err.message);
                res.render('error', {message: err.message, error : err, session: ss});
            } else {
                console.log('routes board1 View !!!');

                res.render('./admin/board1/view', {
                    result : results[0][0],
                    reply : results[1][0],
                    list : results[2],
                    session : ss
                });
            }
        }
    );

});

// 게시글 수정 화면 호출.
router.get('/edit/:no', function(req, res) {
    console.log("상세 화면 호출처리.");
    var ss = req.session;
    var no = req.params.no !=null ? req.params.no : '';

    conn.query('SELECT no, title, content, DATE_FORMAT(ins_dt, "%Y-%m-%d") as date, ins_id as writerId,'
        + ' ins_nm as writer, count FROM board1_inf_tbl WHERE no = ?',
        [no],
        function(err, results) {
            if(err) {
                console.log('error : ', err.message);
                res.render('error', {message: err.message, error : err, session: ss});
            } else {
                console.log('routes board Edit Result !!!');

                res.render('./admin/board1/edit', {
                    title: '수정화면',
                    result : results[0],
                    session : ss
                });
            }
        });
});

// 게시글 수정 처리.
router.post('/edit/do', function(req, res) {
    console.log("게시글 수정 처리");
    //console.log('req.body : ', JSON.stringify(req.body));

    var ss = req.session;
    var title = req.body.title !=null ? req.body.title : '';
    var content = req.body.content !=null ? req.body.content : '';
    var writer = req.body.writer !=null ? req.body.writer : '';
    var no = req.body.no !=null ? req.body.no : '';
    // DB
    conn.query('UPDATE board1_inf_tbl SET title = ?, content = ?, ins_dt = now(), ins_nm = ? WHERE no = ?',
        [title, content, writer, no],
        function(err) {
            if(err) {
                console.log('error : ', err.message);
                res.render('error', {message: err.message, error : err, session: ss});
            } else {
                res.redirect("/admin/board1/view/"+no);
            }
        });
});

/**
 * 게시글 삭제 처리.
 */
router.get('/delete/:no', function(req, res) {
    console.log("게시글 삭제 처리");
    var ss = req.session;
    var no = req.params.no !=null ? req.params.no : '';

    conn.query('DELETE FROM board1_inf_tbl WHERE no = ?',
        [no],
        function(err, results) {
            if(err) {
                console.log('error : ', err.message);
                res.render('error', {message: err.message, error : err, session: ss});
            } else {
                console.log('result : ', results.message);

                res.redirect('/admin/board1');
            }
        });
});

/**
 * 게시글 삭제.(post)
 */
router.post('/delete', function(req, res) {
    console.log("게시글 삭제 처리");

    var ss = req.session;
    var params = req.body['dataList'];

        for (var i = 0; i < params.length; i++) {
            conn.query('DELETE FROM board1_inf_tbl WHERE no = ?',
                [params[i]],
                function (err, results) {
                    if (err) {
                        console.log('error : ', err.message);
                        res.render('error', {message: err.message, error : err, session: ss});
                    }
                    console.log('result['+i+'] : ', results.message);
                });
        }

    res.json({'result' : 'OK'});
});

// 서브 코멘트 신규 저장.
router.post('/comment/new', function(req, res) {

    var ss = req.session;
    var ssUsrId = ss.usrId !=null ? ss.usrId : '';
    var no = req.body.no !=null ? req.body.no : 1;
    var comment = req.body.comment !=null ? req.body.comment : '';

    // 전체 데이타를 조회한 후 결과를 'results' 매개변수에 저장.
    conn.query('INSERT INTO comment1_inf_tbl(bno, comment, ins_dt, ins_id) VALUES(?, ?, now(), ?)',
        [no, comment, ssUsrId],
        function(err, results) {
            if(err) {
                console.log('error : ', err.message);
                res.render('error', {message: err.message, error : err, session: ss});
            } else {
                conn.commit();
                console.log('result : ', results.message);

                res.json({result : "OK", session: ss});
            }
        }
    );

});

// 서브 코멘트 삭제.
router.post('/comment/del', function(req, res) {

    var ss = req.session;
    var rno = req.body.rno !=null ? req.body.rno : '';
    var bno = req.body.bno !=null ? req.body.bno : '';
    var uid = req.body.uid !=null ? req.body.uid : '';

    // 삭제 처리.
    conn.query('DELETE FROM comment1_inf_tbl WHERE rno = ? AND bno = ? AND ins_id = ?',
        [rno, bno, uid],
        function(err, results) {
            if(err) {
                console.log('error : ', err.message);
                res.render('error', {message: err.message, error : err, session: ss});
            } else {
                conn.commit();
                console.log('result : ', results.message);

                res.json({result : "OK", session: ss});
            }
        }
    );

});

module.exports = router;