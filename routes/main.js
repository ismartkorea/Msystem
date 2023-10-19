let express = require('express');
let router = express.Router();
// env환경변수 파일 가져오기 (작동안함)
require('dotenv').config;

/* GET index page. */
router.get('/main', function(req, res) {

  //let ss = req.session;
//console.log("ss : " + JSON.stringify(ss));

  console.log("### index 페이지 호출 ###");

  res.render('index', { title: '모니터링 시스템' });

});

module.exports = router;
