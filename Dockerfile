# Imagem base do Node
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração primeiro (para aproveitar cache de dependências)
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código do projeto
COPY . .

# Expõe a porta usada pelo servidor (ajuste se for diferente)
EXPOSE 5000

# Comando padrão ao iniciar o container
CMD ["npm", "run", "dev"]
