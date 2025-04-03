import express from "express";
import bodyParser from "body-parser";
import recursoRoutes from "./routes/recursoRoutes.js";
import usuarisRoutes from "./routes/usuarisRoutes.js";

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/usuaris", usuarisRoutes);
app.use("/recursos", recursoRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to my API");
});

app.listen(3006, () => {
    console.log("Servidor está escuchando en el puerto 3006...");
});
