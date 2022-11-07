
server {
    listen ${LISTEN_PORT};

    location /api/static {
        alias /vol/static/static;
    }

    location /api {
        uwsgi_pass ${APP_HOST}:${APP_PORT};
        include /etc/nginx/uwsgi_params;
        client_max_body_size 10M;
    }

    location / {
        root /usr/share/nginx/html;
    }
}