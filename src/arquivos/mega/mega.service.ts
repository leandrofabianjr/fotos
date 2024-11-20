import { Injectable } from '@nestjs/common';
import { MutableFile, Storage } from 'megajs';

@Injectable()
export class MegaService {
  getStorage(): Promise<Storage> {
    const storage = new Storage({
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD,
      userAgent: 'ExampleApplication/1.0',
    });

    return storage.ready;
  }

  async listFilesFromDirectory(
    directory?: string,
  ): Promise<MutableFile[] | undefined> {
    const storage = await this.getStorage();
    if (directory) {
      const arquivoMutavel = storage.root.navigate(directory);
      if (!arquivoMutavel?.directory) {
        return undefined;
      }
      return arquivoMutavel.children;
    }

    return storage.root.children;
  }
}
