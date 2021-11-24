import http from "http"; // * node.js에 내장되어 있기 때문에 따로 설치할 필요가 없다.
import WebSocket from "ws";
import express from "express";
import * as events from "events";
import {Server} from "socket.io"
import { instrument } from "@socket.io/admin-ui"


const app = express();

// * PUG 셋팅
app.set("view engine", "pug"); // * 뷰 엔진 pug로 셋팅
app.set("views", __dirname + "\\public\\view"); // * view 템플릿 위치 셋팅

// * static 작업 => 여기서는 템플릿에 등록된 자바스크립트 파일을 가져올 수 있도록 하기 위해서 셋팅
app.use("/public", express.static(__dirname + "/public"));

// * 라우터
app.get("/", (req, res) => res.render("home")); // => view/home.pug로 간다.
app.get("/*", (req, res) => res.redirect("/"));

// * 기존의 express 서버를 구동하는 방식(http만 사용)
// const handleListen = () => console.log(`Listening on http://localhost:3000`)
// app.listen(3000, handleListen);

// * http 서버에 ws 서버 물리기 => 동일한 포트에서 http, ws request를 모두 처리할 수 있다. (웹소켓 서버만 만들어도 상관은 없다)
const handleListen = () =>
  console.log(`Listening on http or wss://localhost:3001`);

const httpServer = http.createServer(app); // * HTTP 서버
// adminUI 적용 전: const wsServer = SocketIO(httpServer)// Socket.IO 사용하여 웹소켓 서버 셋팅 =>  라이브러리의 Server 클래스 사용
// * adminUI 적용 후
const wsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"], // * 해당 url에서 이 서버 접근하는 것을 허용
        credentials: true
    }
});

instrument(wsServer, {
    auth: false // * 비밀번호 사용하도록 설정 가능
})
function publicRoom(){
    // * 어댑터로부터 socket의 id들과 방 이름을 받은 후, 퍼블릭 방만 골라서 리스트로 리턴
    const {sockets: {adapter: {sids, rooms}}} = wsServer;

    const publicRooms = [];

    rooms.forEach((_, key) => {
        // * socket private room이 아닌 경우
        if(sids.get(key) === undefined){
            publicRooms.push(key)
        }
    });

    return publicRooms
}

// * 방 안에 몇명이 있는지 세는 메소드
function countRoom(roomName){
    console.log('countRoom: ', roomName)
    // * roomName을 못 찾을 수 있기 때문에 ?로 표시
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", socket => {
  // * 처음 소켓에 연결된 경우 익명으로 닉네임 부여
  socket['nickname'] = 'Anonymous'

  // *  socket.onAny: 소켓의 어떤 이벤트든 잡아서 처리
  socket.onAny((event, args) => {
    // console.log(wsServer.sockets.adapter)
    console.log(`Socket Event: ${event}`)
  })

  // * 방에 들어갔을 때,
  socket.on('enter_room', (roomName, done) => {
    socket.join(roomName); // * roomName으로 소켓을 묶는다(방 생성 혹은 참가)
    console.log(socket.adapter.rooms)
    console.log(socket.rooms) // * socket.rooms: Set {<socket.id>, "room1", "room2" ,,,,,}
    // * 10초가 지나고 백에서 프론트에서 전달한 콜백 함수를 호출하면, 프론트에서 해당 함수를 사용한다.
    // * 백엔드가 이 코드를 실행하는 것이 아니라, 호출만 한다!
    done(); // * 프론트에서 메세지 창 HTML 출력

    // * 입장한 방에 있는 모든 사람들에게 이벤트 전달(나를 제외)
    socket.to(roomName).emit('welcome', socket.nickname, countRoom(roomName));
    // * 현재 서버안에 있는 모든 방의 array를 전달
    wsServer.sockets.emit("room_change", publicRoom())
  })

  // * 방에서 나가려고 할 때,
  socket.on('disconnecting', ()=>{
    socket.rooms.forEach((room) => {
        console.log('room: ', room)
        // * countRoom(roomName)-1: 방에 나가기 직전이라 본인이 포함된 수가 출력될 것이기 때문에 -1해준다.
        socket.to(room).emit('bye', socket.nickname, countRoom(room)-1)
    })

  })

  socket.on('disconnect', ()=>{
      wsServer.sockets.emit('room_change', publicRoom())
  })

  // * 새로운 메세지가 왔을 때,
  socket.on('new_message', (msg, roomName, done)=>{
    socket.to(roomName).emit('new_message', `${socket.nickname}: ${msg}`)
    done(); // * 백엔드에서 실행되는게 아니라 프론트에서 실행된다. (백에서는 호출만)
  })

  // * 닉네임을 소켓에 저장
  socket.on('nickname', nickname => {
    socket['nickname'] = nickname
  })
})

// const wss = new WebSocket.Server({ server }); // * WEBSOCKET 서버

// * new Websocket.Server() 파라미터 중 server값에 대한 정보
// * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S server to use
httpServer.listen(3001, handleListen);
