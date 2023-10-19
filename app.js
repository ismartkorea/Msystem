const express = require('express');
const engine = require('ejs-locals');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
//const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const fileStore = require('session-file-store')(session); // session file store

// 라우터 초기화.
const index = require('./routes/index');
const login = require('./routes/login');

// MySQL Connect 설정.
const config = require('./routes/common/dbconfig');
global.dbConn = mysql.createConnection(config);
handleDisconnect(global.dbConn);

const app = express();

app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
/*
 *  Express 4.16 이후 버전인 경우
 *  express.json() 으로 대처
 */
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ limit:'50mb', extended: true }));
app.use(express.json());
app.use(express.urlencoded({ limit:'50mb', extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'system!@$',	// 암호화
  resave: false,
  saveUninitialized: true,
  cookie: {	
    httpOnly: true,
  },
  store: new fileStore() // 세션 객체에 세션스토어를 적용
}));
app.use(express.static(path.join(__dirname, 'public')));

// 화면 파트
app.use('/', index);
app.use('/login', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
  //res.status(err.status);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    var ss = req.session;
    
    var errPage = "";
    res.status(err.status || 500);
    if(err.status == 500) {
      errPage = "500";
    } else {
      errPage = "./error/error";
    }
    res.render(errPage, {
      message: err.message,
      error: err,
      session: ss
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  var ss = req.session;

  res.status(err.status || 500);
  res.render('./error/error', {
    message: err.message,
    error: {},
    session: ss
  });
});

/**
 * DB ReConnect 함수.
 * @param client
 */
function handleDisconnect(client) {
  client.on('error', function (error) {
    if (!error.fatal) return;
    if (error.code !== 'PROTOCOL_CONNECTION_LOST') throw err;
    console.error('> Re-connecting lost MySQL connection: ' + error.stack);

    // NOTE: This assignment is to a variable from an outer scope; this is extremely important
    // If this said `client =` it wouldn't do what you want. The assignment here is implicitly changed
    // to `global.mysqlClient =` in node.
    global.dbcon = mysql.createConnection(client.config);
    handleDisconnect(global.dbcon);
    global.dbcon.connect();
  });
}

module.exports = app;
