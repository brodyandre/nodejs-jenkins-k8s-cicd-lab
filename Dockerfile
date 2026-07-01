FROM node:20-alpine AS production

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev \
  && npm cache clean --force \
  && addgroup -g 10001 -S nodeapp \
  && adduser -S -D -H -u 10001 -G nodeapp nodeapp

COPY src ./src

RUN chown -R 10001:10001 /usr/src/app

USER 10001:10001

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/health').then((response) => { process.exit(response.ok ? 0 : 1); }).catch(() => process.exit(1));"

CMD ["npm", "start"]
