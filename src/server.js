import http from "http"; // * node.js에 내장되어 있기 때문에 따로 설치할 필요가 없다.
import WebSocket from "ws";
import express from "express";
import * as events from "events";
import SocketIO from "socket.io"

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
  console.log(`Listening on http or wss://localhost:3000`);

const httpServer = http.createServer(app); // * HTTP 서버
const wsServer = SocketIO(httpServer)// Socket.IO 사용하여 웹소켓 서버 셋팅 =>  라이브러리의 Server 클래스 사용

wsServer.on("connection", socket => {
  console.log(socket)
  // *  socket.onAny: 소켓의 어떤 이벤트든 잡아서 처리
  socket.onAny((event, args) => {
    console.log(`Socket Event: ${event}`)
  })
  socket.on('enter_room', (roomName, done) => {

    socket.join(roomName); // * roomName으로 소켓을 묶는다(방 생성 혹은 참가)
    done(); // * 프론트에서 메세지 창 HTML 출력

    // * 10초가 지나고 백에서 프론트에서 전달한 콜백 함수를 호출하면, 프론트에서 해당 함수를 사용한다.
    // * 백엔드가 이 코드를 실행하는 것이 아니라, 호출만 한다!
    // setTimeout(()=>{
    //   done("hello. i am a backend");
    // }, 10000)
  })
})

// const wss = new WebSocket.Server({ server }); // * WEBSOCKET 서버

// * new Websocket.Server() 파라미터 중 server값에 대한 정보
// * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S server to use

// * fake database
// const sockets = [];

// * 은지 셀프(10/18 => 1.7)
function makeMessage(type, payload){
  const message = JSON.stringify({type, payload})
  return message
}

// wss.on("connection", (socket) => {
//
//   // * socket이 연결될 때 해당 연결을 sockets 배열에 넣어서 관리
//   sockets.push(socket)
//
//   // * 아직 닉네임을 설정하지 않은 익명의 소켓을 위한 임의 닉네임(Anonymous) 부여
//   socket["nickname"] = "Anon"
//
//   console.log('sockets length: ', sockets.length)
//
//
//   // console.log('socket: ', socket)
//
//   // * socket.on:: 특정 소켓에 연결되어 이벤트를 리슨한다.
//   socket.on("close", () => {
//
//     console.log(`sockets에서 해당 socket 삭제 전 길이: `, sockets.length)
//
//     for(let i = 0; i<sockets.length; i++){
//       if(sockets[i] === socket){
//         sockets.splice(i, 1);
//         break;
//       }
//     }
//
//     console.log(`sockets에서 해당 socket 삭제 후 길이: `, sockets.length)
//
//     // * 브라우저와의 연결이 끊길 때 발생(ex. 브라우저 끄기)
//     console.log("Disconnected from the Browser XX");
//   });
//
//
//   // * 모든 것이 메세지가 되기 때문에 프론트에서 보내는 메세지와 닉네임을 구별할 방법이 필요
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg.toString());
//     switch(message.type){
//       case "nickname":
//         console.log(message.payload)
//         socket["nickname"] = message.payload
//         break;
//       case "new_message":
//         sockets.forEach(aSocket => {
//           // * 닉네임과 메세지를 같이 전달
//           aSocket.send(`${socket.nickname}: ${message.payload}`.toString('utf8'))
//         })
//         break;
//     }
//
//     // * 어느 한 소켓에서 온 메세지를 다른 모든 소켓에 전달
//     // sockets.forEach(aSocket => {
//     //   aSocket.send(message.toString('utf8'))
//     // })
//   });
//
//   // socket.send("hello"); // * socket이 연결되자마자 hello라는 메세지를 전달
// });


httpServer.listen(3000, handleListen);
