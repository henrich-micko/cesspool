FROM python:3.10-alpine

ENV PYTHONUNBUFFERED 1

COPY . /cesspool-backend

WORKDIR /cesspool-backend
EXPOSE 8000

RUN pip install --upgrade pip && \
    apk add --update --no-cache postgresql-client && \
    apk add --update --no-cache --virtual .tmp-deps \
        build-base postgresql-dev musl-dev linux-headers && \
    pip install -r /cesspool-backend/requirements.txt && \
    apk del .tmp-deps && \
    adduser --disabled-password --no-create-home kettu && \
    mkdir -p /vol/web/static && \
    chown -R kettu:kettu /vol && \
    chmod -R 755 /vol

USER kettu