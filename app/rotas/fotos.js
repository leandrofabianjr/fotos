import express from "express";
import { buscarFotos } from "../servicos/buscar-fotos.js";

const router = express.Router();

router.get("", async (req, res) => {
  const offset = +(req.query.offset ?? 0);
  const maximo = +(req.query.maximo ?? 10);
  try {
    const { fotos, total } = await buscarFotos(offset, maximo);
    res.json({ offset, maximo, total, fotos: fotos.map((f) => f.toJson()) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

export default router;
