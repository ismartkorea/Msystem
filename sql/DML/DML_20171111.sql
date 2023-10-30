 use `sysdb`;

/*
 * base1용 DB
 */
grant all privileges on sysdb.* to `system`@`localhost` identified by 'system9123';
create database `sysdb`;
flush privileges;
 
 DROP TABLE IF EXISTS `announce_inf_tbl`;
 CREATE TABLE `announce_inf_tbl` (
  `no` int(11) NOT NULL AUTO_INCREMENT COMMENT '게시물번호',
  `title` varchar(60) NOT NULL COMMENT '타이틀',
  `content` text NOT NULL COMMENT '내용',
  `date` datetime NOT NULL COMMENT '작성일',
  `writer` varchar(20) DEFAULT NULL COMMENT '작성자',
  `category` varchar(12) DEFAULT NULL COMMENT '카테고리',
  `attch_file_url1` varchar(100) DEFAULT NULL COMMENT '첨부파일1',
  `attch_file_nm1` varchar(60) DEFAULT NULL COMMENT '첨부파일명1',
  `attch_file_url2` varchar(100) DEFAULT NULL COMMENT '첨부파일2',
  `attch_file_nm2` varchar(60) DEFAULT NULL COMMENT '첨부파일명2',
  `count` int(11) DEFAULT 0 COMMENT '조회수',
  PRIMARY KEY (`no`)
);

DROP TABLE IF EXISTS `user_info_tbl`;
CREATE TABLE `user_info_tbl` (
  `no` int(11) NOT NULL AUTO_INCREMENT COMMENT '고객번호',
  `id` varchar(20) NOT NULL COMMENT '고객id',
  `pwd` varchar(60) NOT NULL COMMENT '고객password',
  `name` varchar(40) NOT NULL COMMENT '고객명',
  `email` varchar(60) NOT NULL COMMENT '고객email',
  `sex` char(1) DEFAULT NULL COMMENT '성별',
  `age` char(3) DEFAULT NULL COMMENT '나이',
  `telno` varchar(13) DEFAULT NULL COMMENT '연락처',
  `address1` varchar(60) DEFAULT NULL COMMENT '주소1',
  `address2` varchar(60) DEFAULT NULL COMMENT '주소2',
  `postno` char(7) DEFAULT NULL COMMENT '우편번호',
  `hobby` varchar(10) DEFAULT NULL COMMENT '취미',
  `marriedyn` char(1) DEFAULT NULL COMMENT '결혼여부',
  `usertype` char(1) DEFAULT NULL COMMENT '사용자타입',
  `infoyn` char(1) DEFAULT NULL COMMENT '정보제공여부',
  `membertype` char(3) DEFAULT NULL DEFAULT '500' COMMENT '멤버유형',
  PRIMARY KEY (`no`)
  );
  
  DROP TABLE IF EXISTS `sql_err_log_tbl`;
  CREATE TABLE `sql_err_log_tbl` (
  `code` char(10) NOT NULL,
  `err_no` varchar(40) DEFAULT NULL,
  `sql_msg` varchar(2000) DEFAULT NULL,
  `ins_date` datetime DEFAULT NULL,
  `ins_id` varchar(40) DEFAULT NULL,
  `upd_date` datetime DEFAULT NULL,
  `upd_id` varchar(40) DEFAULT NULL
  );
  
  DROP TABLE IF EXISTS `qna_inf_tbl`;
  CREATE TABLE `qna_inf_tbl` (
  `qno` int(11) NOT NULL AUTO_INCREMENT COMMENT '번호',
  `name` varchar(40) NOT NULL COMMENT '이름',
  `usr_no` varchar(40) DEFAULT NULL COMMENT '고객번호',
  `email` varchar(80) NOT NULL COMMENT '이메일',
  `telno` varchar(13) NOT NULL COMMENT '전화번호',
  `title` varchar(80) NOT NULL COMMENT '제목',
  `content` varchar(2000) NOT NULL COMMENT '내용',
  `ins_dt` datetime NOT NULL COMMENT '작성날짜',
  `reply_yn` char(1) DEFAULT 'N' COMMENT '답변여부',
  `reply_id` varchar(40) DEFAULT NULL COMMENT '답변자id',
  `reply_name` varchar(60) DEFAULT NULL COMMENT '답변자명',
  `reply_comment` varchar(2000) DEFAULT NULL COMMENT '답변글',
  `reply_ups_int` datetime DEFAULT NULL COMMENT '답변일자',
  `category` varchar(12) DEFAULT NULL COMMENT '카테고리',
  PRIMARY KEY (`qno`)
  );
  
  DROP TABLE IF EXISTS `conn_his_tbl`;
  CREATE TABLE `conn_his_tbl` (
  `cno` int(11) NOT NULL AUTO_INCREMENT COMMENT '접속번호',
  `cview` varchar(80) NOT NULL COMMENT '접속화면',
  `cpage` varchar(80) NOT NULL COMMENT '접속페이지',
  `cid` varchar(40) NOT NULL COMMENT '사용자id',
  `cin_date` datetime NOT NULL COMMENT '로그인일자',
  `cout_date` datetime DEFAULT '0000-00-00 00:00:00' COMMENT '로그아웃일자',
  `cip` varchar(80) DEFAULT '000.000.000.000' COMMENT '접속자ip',
  PRIMARY KEY (`cno`)
  );

DROP TABLE IF EXISTS `board_inf_tbl`;
CREATE TABLE `board_inf_tbl` (
  `no` int(11) NOT NULL AUTO_INCREMENT COMMENT '게시물번호',
  `title` varchar(60) NOT NULL COMMENT '타이틀',
  `content` text NOT NULL COMMENT '내용',
  `ins_dt` datetime DEFAULT NULL COMMENT '작성일',
  `ins_id` varchar(40) DEFAULT NULL COMMENT '작성자id',
  `ins_nm` varchar(40) DEFAULT NULL COMMENT '작성자명',
  `count` int(11) DEFAULT 0 COMMENT '조회수',
  `system_div` varchar(20) DEFAULT NULL COMMENT '시스템구분(assist:어시스트프로lab:제티랩)',
  PRIMARY KEY (`no`)
);

DROP TABLE IF EXISTS `sms_inf_tbl`;
CREATE TABLE `sms_inf_tbl` (
  `no` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(60) NOT NULL,
  `content` varchar(2000) DEFAULT NULL,
  `from_tel_no` char(13) DEFAULT NULL,
  `type` char(10) DEFAULT NULL,
  `use_yn` char(1) DEFAULT 'N',
  `ins_dt` datetime DEFAULT NULL,
  `ins_id` varchar(40) DEFAULT NULL,
  `upd_dt` datetime DEFAULT NULL,
  `upd_id` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`no`)
);

commit;
