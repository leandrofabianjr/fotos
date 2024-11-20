import { Controller, Get, Query, Render } from '@nestjs/common';
import { MegaService } from './mega/mega.service';

@Controller('arquivos')
export class ArquivosController {
  constructor(private mega: MegaService) {}
  @Get('')
  @Render('arquivos')
  async loadDirectory(@Query() { caminho: path }: { caminho: string }) {
    const megaFiles = await this.mega.listFilesFromDirectory(path);
    const files =
      megaFiles?.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
        isDirectory: f.directory,
        path: (path?.split('/').join('/').concat('/') ?? '') + f.name,
      })) ?? [];
    const currentDirectory = path?.split('/') ?? [];
    const pathLevels = currentDirectory.map((p, i) => ({
      name: p,
      path: currentDirectory.slice(0, i + 1).join('/'),
    }));
    return { megaFiles: files, pathLevels };
  }
}
