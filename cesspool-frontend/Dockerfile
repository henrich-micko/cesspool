FROM node:15.13-alpine

COPY . cesspool-frontend
WORKDIR /cesspool-frontend

RUN yarn install
RUN yarn run build

CMD ["yarn", "start"]