import { execSync } from 'child_process';
import { existsSync, rmSync, mkdirSync, cpSync } from 'fs';
import { join } from 'path';

const DIST_DIR = 'fotos-dist';
const DIST_DIR_PATH = join('..', DIST_DIR);

// Limpa o diretório destino
if (existsSync(DIST_DIR_PATH)) {
  rmSync(DIST_DIR_PATH, { recursive: true, force: true });
}

// Cria o diretório destino
mkdirSync(DIST_DIR_PATH);

// Build da API
execSync('npm install');
execSync('nest build');

// Copia arquivos necessários
cpSync('./dist', join(DIST_DIR_PATH, 'dist'), { recursive: true });
cpSync('./views', join(DIST_DIR_PATH, 'views'), { recursive: true });
cpSync('./package.json', join(DIST_DIR_PATH, 'package.json'));
cpSync('./vercel.json', join(DIST_DIR_PATH, 'vercel.json'));

// Subindo para o github
process.chdir(DIST_DIR_PATH);
execSync('git init');
execSync('git add .');
execSync('git commit -m "Commit gerado por script"');
execSync(
  'git remote add origin https://github.com/leandrofabianjr/fotos-dist.git',
);
execSync('git branch -M main');
execSync('git push -f origin main');
