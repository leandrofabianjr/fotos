import * as google from "googleapis";

const folderId = process.env.FOTOS_PASTA_GOOGLE_ID ?? "";

const auth = new google.Auth.GoogleAuth({
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join(
      "\n"
    ),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
  scopes: ["https://www.googleapis.com/auth/drive.metadata.readonly"],
});
const drive = new google.drive_v3.Drive({ version: "v3", auth });

class Fotos {
  /** @type {string} */
  id;
  /** @type {number} */
  tamanho;

  constructor(json, index) {
    this.id = json.id;
    this.tamanho = json.size;
    this.index = index;
  }

  /**
   * @returns {{tamanho: number, url: string}}
   */
  toJson() {
    return {
      index: this.index,
      tamanho: this.tamanho,
      url: `https://drive.google.com/uc?export=view&id=${this.id}`,
    };
  }
}
/**
 * @param {number} offset
 * @param {number} maximo
 * @returns {Promise<{fotos: Fotos[], total: number}>}
 */
export function buscarFotos(offset, maximo) {
  return new Promise((resolve, reject) => {
    drive.files.list(
      {
        q: `'${folderId}' in parents and trashed = false`,
        fields: "nextPageToken, files(id, size)",
      },
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          const total = result.data.files.length;
          const fotos = result.data.files
            .map((file, index) => new Fotos(file, index))
            .slice(offset, offset + maximo);
          resolve({ fotos, total });
        }
      }
    );
  });
}
