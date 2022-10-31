FROM python:3.10-alpine

ENV PYTHONUNBUFFERED 1

RUN apk add --update --no-cache postgresql-client
RUN apk add --update --no-cache --virtual .tmp-build-deps \ 
    gcc libc-dev linux-headers postgresql-dev musl-dev zlib zlib-dev
RUN pip install --upgrade pip
RUN apk del .tmp-build-deps

RUN mkdir /cesspool-backend
COPY . cesspool-backend
WORKDIR /cesspool-backend

RUN pip install -r /cesspool-backend/requirements.txt