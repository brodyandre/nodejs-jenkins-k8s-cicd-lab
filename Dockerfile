FROM node:20-alpine AS production

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev \
  && npm cache clean --force \
  && addgroup -S nodeapp \
  && adduser -S nodeapp -G nodeapp

COPY src ./src

RUN chown -R nodeapp:nodeapp /usr/src/app

USER nodeapp

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/health').then((response) => { process.exit(response.ok ? 0 : 1); }).catch(() => process.exit(1));"

CMD ["npm", "start"]
