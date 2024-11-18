import express from "express";
import rotaFotos from "./rotas/fotos.js";

const app = express();

const port = process.env.PORT ?? 3000;

export function iniciarApp() {
  app.use("/fotos", rotaFotos);

  app.listen(port, () => {
    console.info(`Serviço rodando na porta ${port}`);
  });
}
