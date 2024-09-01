FROM node:22
ENV NODE_ENV=production

USER node

WORKDIR /usr/src/app

COPY --chown=node package*.json ./

RUN npm install

COPY --chown=node . .

RUN npm run build

ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production

CMD ["npm", "run", "start:prod"]
