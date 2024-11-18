import * as google from "googleapis";

const folderId = process.env.FOTOS_PASTA_GOOGLE_ID ?? "";

const base64EncodedServiceAccount = process.env.GOOGLE_CREDENTIALS_BASE64;
const decodedServiceAccount = Buffer.from(
  base64EncodedServiceAccount,
  "base64"
).toString("utf-8");
const credentials = JSON.parse(decodedServiceAccount);

const auth = new google.Auth.GoogleAuth({
  credentials,
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
