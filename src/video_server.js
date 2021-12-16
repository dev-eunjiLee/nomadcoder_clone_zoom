import http from 'http'; // * node.js에 내장되어 있기 때문에 따로 설치할 필요가 없다.
import WebSocket from 'ws';
import express from 'express';
import * as events from 'events';
import SocketIO from 'socket.io';

const app = express();

// * PUG 셋팅
app.set('view engine', 'pug'); // * 뷰 엔진 pug로 셋팅
app.set('views', __dirname + '\\public\\view'); // * view 템플릿 위치 셋팅

// * static 작업 => 여기서는 템플릿에 등록된 자바스크립트 파일을 가져올 수 있도록 하기 위해서 셋팅
app.use('/public', express.static(__dirname + '/public'));

// * 라우터
app.get('/', (req, res) => res.render('video_home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListen = () =>
	console.log(`Listening on http or wss://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

httpServer.listen(3000, handleListen);
