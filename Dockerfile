FROM node:lts-alpine as buildWeb
COPY ./web /src/web
WORKDIR /src/web
RUN npm install
RUN npm run build


FROM golang:1-bullseye as buildAPP
LABEL maintainer="XCT"
COPY . /src
COPY --from=buildWeb /src/web/dist /src/web/dist
WORKDIR /src
RUN make docker


# final image
# https://github.com/chromedp/docker-headless-shell#using-as-a-base-image
FROM chromedp/headless-shell:latest

RUN export DEBIAN_FRONTEND=noninteractive \
  && apt-get update \
  && apt-get install -y --no-install-recommends \
  dumb-init fonts-noto fonts-noto-cjk \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/

COPY --from=buildAPP /src/gowitness /usr/local/bin
COPY --from=buildWeb /src/web/dist /data/web/dist
EXPOSE 7171

VOLUME ["/data"]
WORKDIR /data

ENTRYPOINT ["dumb-init", "--"]
