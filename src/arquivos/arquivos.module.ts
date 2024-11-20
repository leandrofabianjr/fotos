import { Module } from '@nestjs/common';
import { MegaService } from './mega/mega.service';
import { GoogleDriveService } from './google-drive/google-drive.service';
import { ArquivosController } from './arquivos.controller';

@Module({
  providers: [MegaService, GoogleDriveService],
  controllers: [ArquivosController]
})
export class ArquivosModule {}
