import express from "express";
import rotaFotos from "./rotas/fotos.js";
import { buscarFotos } from "./servicos/buscar-fotos.js";

const app = express();

const port = process.env.PORT ?? 3000;

app.set("view engine", "hbs");
app.set("views", "./app/templates");

app.get("/", async (req, res) => {
  const { fotos, total } = await buscarFotos(0, 10);
  console.log(fotos);
  res.render("index", { fotos });
});

app.use("/fotos", rotaFotos);

app.listen(port, () => {
  console.info(`Serviço rodando na porta ${port}`);
});
