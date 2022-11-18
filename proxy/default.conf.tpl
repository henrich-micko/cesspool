
server {
    listen 80;

    location /api/static {
        alias /vol/static/static;
    }

    location /api {
        uwsgi_pass django:9000;
        include /etc/nginx/uwsgi_params;
        client_max_body_size 10M;
    }

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}