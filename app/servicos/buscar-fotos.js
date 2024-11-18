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
  /** @type {string} */
  url;

  constructor(json, index) {
    this.id = json.id;
    this.tamanho = json.size;
    this.url = `https://drive.usercontent.google.com/download?id=${this.id}`;
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
/**
 * @param {number} offset
 * @param {number} maximo
 * @returns {Promise<{fotos: Fotos[], total: number}>}
 */
export function buscarFotos(offset = 0, maximo = 10) {
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
