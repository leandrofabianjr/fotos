import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async getHello() {
    const { fotos, total } = await this.appService.buscarFotos();
    const fotosPorColuna = 4;
    const colunas = [];
    for (let i = 0; i < fotos.length; i += fotosPorColuna) {
      colunas.push(fotos.slice(i, i + fotosPorColuna));
    }
    const hero = fotos.find((f) => f.name === 'hero.jpg');
    return { hero, colunas, total };
  }
}
