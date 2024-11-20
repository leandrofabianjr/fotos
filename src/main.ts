import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as exphbs from 'express-handlebars';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.engine(
    '.hbs',
    exphbs.create({
      extname: '.hbs',
      defaultLayout: 'main',
    }).engine,
  );
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
