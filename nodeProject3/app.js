/**
 * http://usejsdoc.org/
 */


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//업로드를 위한 멀터 모듈~
const multer  = require('multer');
var storage = multer.diskStorage({
	  destination: function (req, file, cb) {
	    cb(null, './uploads')
	  },
	  filename: function (req, file, cb) {
		var fname = file.originalname;
		var idx = fname.lastIndexOf('.');
		var fa = fname.substring(0, idx);
		var fb = fname.substring(idx);
		fname = fa + Date.now() +fb;
		cb(null, fname); 
//		cb(null, file.originalname + '-' + Date.now()); //새로만들어지지만 뒤에 숫자가 드럽게 만들어진다. 
//	    cb(null, file.originalname); //덮어쓰기 되어버림.
	  }
	});
var upload = multer({ storage: storage });
var cpUpload = upload.fields([{ name: 'ufile1', maxCount: 1 }, { name: 'ufile2', maxCount: 1 }]);
const errorHandler = require('express-error-handler');
const handler = errorHandler({
	static: {
		'404': './public/e1.html'
	}
});
const app = express();

//라우팅 보다 위에 넣어야함.
app.use(express.static(path.join(__dirname, 'public')));


//자리 : 라우팅보다는 위에 스테틱 미들웨어 보다는 밑에!!
//parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json 
app.use(bodyParser.json());




//라우팅
app.get('/', function (req, res) {
	res.send('Hello World!!!!' + req.aaa.name);
});


//모듈이 또 필요해!!!!! 멀터야~~와라~~
//파일 1개 받을거면 single/2개이상 array
//app.post('/form', upload.single('ufile'), function (req, res) {
//	var name = req.body.name ;
//	var age = req.body.age ;
//	console.log(req.file); // 싱글 파일 업로드는 req.file로 온다.
//	res.send('form post : ' + name + ", age : " + age);
//});


//file1, file2 나누어져 있을 때 업로드
app.post('/form', cpUpload, function (req, res) {
	var name = req.body.name ;
	var age = req.body.age ;
	console.log(req.files); //array 파일 업로드는 req.files로 온다.
	res.send('form post : ' + name + ", age : " + age);
});

//2개 이상 업로드!!!!!
//app.post('/form', upload.array('ufile', 3), function (req, res) {
//	var name = req.body.name ;
//	var age = req.body.age ;
//	console.log(req.files); //array 파일 업로드는 req.files로 온다.
//	res.send('form post : ' + name + ", age : " + age);
//});




//post 방식 >> 바디파서 필요!!
//app.post('/form', function (req, res) {
//	var name = req.body.name ;
//	var age = req.body.age ;
//	res.send('form post : ' + name + ", age : " + age);
//});


//get 방식 배열로 가능!!! 밑에 get메소드 두개를 1개로 만들어버리기!!!
//get방식에서 쿼리와 파서가 구분됨.. post는 그딴거 없어~~
app.get(['/form','/form/:name/:age'], function (req, res) {
	var name = req.query.name || req.params.name;
	var age = req.query.age || req.params.age;
	res.send('form get : ' + name + ", age : " + age);
});

//app.get('/form', function (req, res) {
//	var name = req.query.name;
//	var age = req.query.age;
//	res.send('form get : ' + name + ", age : " + age);
//});
//
//
////http://192.168.205.153:3000/form.html/korea/33  이렇게 들어가는 라우팅!!
//app.get('/form/:name/:age', function(req, res){
//var name = req.params.name;
//var age = req.params.age;
//var output = '이름 : ' + name + ", 나이 : " + age;
//res.send(output);
//});


//클라이언트 서버 (400) / 서버 (500) error 처리 : 오류순서 500 , 400 순으로 해야됨!!중요
app.use(function (err, req, res, next) {
  console.log(err);
//  res.status(500);
  res.send('서버가 바쁩니다.1');
});

app.use( errorHandler.httpError(404) );
app.use( handler );

app.listen(3000, function () {
	console.log('Example app listening on port 3000!!');
});