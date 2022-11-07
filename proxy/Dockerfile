FROM node:16-alpine as react
COPY ./cesspool-frontend /cesspool-frontend
WORKDIR /cesspool-frontend
RUN npm ci --legacy-peer-deps
RUN npm run build

FROM nginxinc/nginx-unprivileged:1-alpine

COPY ./proxy/default.conf.tpl /etc/nginx/default.conf.tpl
COPY ./proxy/uwsgi_params /etc/nginx/uwsgi_params
COPY ./proxy/run.sh /run.sh

ENV LISTEN_PORT=8000
ENV APP_HOST=django
ENV APP_PORT=9000

USER root

RUN mkdir -p /vol/static && \
    chmod 755 /vol/static && \
    touch /etc/nginx/conf.d/default.conf && \
    chown nginx:nginx /etc/nginx/conf.d/default.conf && \
    chmod +x /run.sh

VOLUME /vol/static

USER nginx

COPY --from=react /cesspool-frontend/build /usr/share/nginx/html

CMD ["/run.sh"]