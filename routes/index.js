const express = require('express');
//const bodyParser = require('body-parser');
const flash = require('connect-flash');
var async = require('async');
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

/* GET index page. */
router.get('/', function(req, res) {

  let ss = req.session;
console.log("index.js::ss : " + JSON.stringify(ss));

  if(ss.usrId == null) {
    console.log("### login 페이지 호출 ###");

    res.redirect('/login');
  } else {
    console.log("### index 페이지 호출 ###");

    res.render('./index', { title: '모니터링 시스템', session: ss });
  }

});

module.exports = router;
