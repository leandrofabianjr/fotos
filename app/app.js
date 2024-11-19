import express from 'express';
import path from 'path';
import rotaFotos from './rotas/fotos.js';
import { buscarFotos } from './servicos/buscar-fotos.js';

const app = express();

const port = process.env.PORT ?? 3000;

app.set('view engine', 'hbs');
app.set('views', 'app/templates');

app.get('/', async (req, res) => {
  const { fotos, total } = await buscarFotos(0, 12);
  const fotosPorColuna = 4;
  const colunas = [];
  for (let i = 0; i < fotos.length; i += fotosPorColuna) {
    colunas.push(fotos.slice(i, i + fotosPorColuna));
  }
  const hero = fotos.find((f) => f.name === 'hero.jpg');
  res.render('index', { hero, colunas });
});

app.use('/fotos', rotaFotos);

app.listen(port, () => {
  console.info(`Serviço rodando na porta ${port}`);
});
