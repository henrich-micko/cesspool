FROM node:16-alpine as react
COPY ./cesspool-frontend /cesspool-frontend
WORKDIR /cesspool-frontend
RUN npm ci --legacy-peer-deps
RUN npm run build

FROM nginx:1.18.0-alpine

COPY ./proxy/default.conf.tpl /etc/nginx/conf.d/default.conf
COPY ./proxy/uwsgi_params /etc/nginx/uwsgi_params

COPY --from=react /cesspool-frontend/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]