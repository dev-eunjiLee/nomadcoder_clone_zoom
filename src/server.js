import express from "express";

const app = express();

// * PUG 셋팅
app.set('view engine', "pug"); // * 뷰 엔진 pug로 셋팅
app.set("views", __dirname + "\\public\\view") // * view 템플릿 위치 셋팅

// * static 작업
app.use('/public', express.static(__dirname + "/public"))

// * 라우터
app.get("/", (req, res) => res.render("home")); // => view/home.pug로 간다.
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`)
app.listen(3000, handleListen);