FROM node:alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN rm -rf node_modules
RUN npm i --legacy-peer-deps
CMD ["npm", "run", "start"]