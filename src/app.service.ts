import { Injectable } from '@nestjs/common';
import * as google from 'googleapis';

class Foto {
  /** @type {string} */
  id;
  /** @type {number} */
  tamanho;
  /** @type {string} */
  url;
  /** @type {string} */
  name;

  constructor(json) {
    this.id = json.id;
    this.tamanho = json.size;
    this.url = `https://drive.google.com/thumbnail?id=${this.id}&sz=w1000`;
    this.name = json.name;
  }

  /**
   * @returns {{tamanho: number, url: string}}
   */
  toJson() {
    return {
      tamanho: this.tamanho,
      url: this.url,
    };
  }
}

@Injectable()
export class AppService {
  async buscarFotos(
    offset: number = 0,
    maximo: number = 10,
  ): Promise<{ fotos: Foto[]; total: number }> {
    const folderId = process.env.FOTOS_PASTA_GOOGLE_ID ?? '';

    const base64EncodedServiceAccount = process.env.GOOGLE_CREDENTIALS_BASE64;
    const decodedServiceAccount = Buffer.from(
      base64EncodedServiceAccount,
      'base64',
    ).toString('utf-8');
    const credentials = JSON.parse(decodedServiceAccount);

    const auth = new google.Auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly'],
    });
    const drive = new google.drive_v3.Drive({ auth });
    return new Promise((resolve, reject) => {
      drive.files.list(
        {
          q: `'${folderId}' in parents and trashed = false`,
          fields: 'nextPageToken, files(id, size, name)',
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            const total = result.data.files.length;
            const fotos = result.data.files
              .map((file) => new Foto(file))
              .slice(offset, offset + maximo);
            resolve({ fotos, total });
          }
        },
      );
    });
  }
}
