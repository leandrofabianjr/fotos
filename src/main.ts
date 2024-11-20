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
      helpers: {
        json: function json(object: any) {
          return JSON.stringify(object, null, 2);
        },
        pathFromArray: function pathFromArray(array: string[], index: number) {
          return array.slice(0, index).join('/');
        },
      },
    }).engine,
  );
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  //serve bootstrap
  app.useStaticAssets(
    join(__dirname, '..', 'node_modules', 'bootstrap', 'dist'),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
bootstrap();
