import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArquivosModule } from './arquivos/arquivos.module';

@Module({
  imports: [ArquivosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
