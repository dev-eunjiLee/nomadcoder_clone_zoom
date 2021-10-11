for (var i = 0; i < 4; i++) {
  console.log("HELLO ESLINT");
}

import http from "http"; // * node.js에 내장되어 있기 때문에 따로 설치할 필요가 없다.
import WebSocket from "ws";
import express from "express";
import * as events from "events";

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
const server = http.createServer(app); // * HTTP 서버
const wss = new WebSocket.Server({ server }); // * WEBSOCKET 서버

// * new Websocket.Server() 파라미터 중 server값에 대한 정보
// * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S server to use

wss.on("connection", (socket) => {
  console.log("Connected To Browser 🐱‍🏍");
  socket.send("hello");
});

server.listen(3000, handleListen);
