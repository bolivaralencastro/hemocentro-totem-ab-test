# Hemocentro Totem A/B Test

Este é um projeto pessoal para conduzir um teste A/B para o totem de autoatendimento do Hemocentro. O objetivo é capturar o tempo de interação do usuário para comparar a interface atual com uma nova que projetei, visando melhorar a experiência do usuário. Nenhum dado pessoal é armazenado.

Este projeto foi gerado com [Angular CLI](https://github.com/angular/angular-cli).

## Pré-requisitos

Antes de começar, você precisará ter o [Node.js](https://nodejs.org/) (que inclui o npm) e o [Angular CLI](https://angular.dev/cli) instalados em sua máquina.

```bash
# Instalar o Angular CLI globalmente
npm install -g @angular/cli
```

## Configuração do Projeto

1.  Clone o repositório para sua máquina local.
2.  Navegue até a pasta do projeto e instale as dependências:

```bash
npm install
```

## Servidor de Desenvolvimento

Execute `npm start` ou `ng serve` para iniciar um servidor de desenvolvimento. Navegue para `http://localhost:4200/`. A aplicação será recarregada automaticamente se você alterar qualquer um dos arquivos de origem.

## Build

Execute `npm run build` ou `ng build` para construir o projeto. Os artefatos de construção serão armazenados no diretório `dist/`.

## Deploy para o GitHub Pages

Este projeto está configurado para ser implantado facilmente no GitHub Pages.

### Método 1: Manual (via `angular-cli-ghpages`)

1.  Certifique-se de que o script `deploy` em `package.json` está com o `base-href` correto para o seu repositório (ex: `/meu-repositorio/`).
2.  Execute o seguinte comando:

```bash
npm run deploy
```

Este comando irá construir o projeto e enviá-lo para a branch `gh-pages` do seu repositório.

### Método 2: Automático (via GitHub Actions)

O repositório pode incluir um workflow de GitHub Actions em `.github/workflows/deploy.yml`. Este workflow irá automaticamente construir e implantar o projeto no GitHub Pages toda vez que um push for feito para a branch `main`.

Para que funcione, você precisa configurar seu repositório para usar o GitHub Actions como a fonte de deploy:

1.  Vá para `Settings` > `Pages`.
2.  Na seção `Build and deployment`, mude a `Source` para **GitHub Actions**.
