FROM node:9-alpine

WORKDIR /home/node/app

COPY ./package* ./
RUN npm install && \
    npm cache clean --force

COPY . .

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && npm run start