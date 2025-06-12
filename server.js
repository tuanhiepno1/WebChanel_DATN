// server.js
const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");

const app = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

app.db = router.db;

// Bật CORS để frontend truy cập được
app.use(cors());
app.use(middlewares);

// Bật json-server-auth (nó phải luôn nằm sau middlewares)
app.use(auth);
app.use(router);

// Server sẽ chạy tại cổng 3001 hoặc cổng bạn chọn
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
