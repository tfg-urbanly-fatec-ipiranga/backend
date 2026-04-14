FROM node:20.16.0-alpine

RUN apk add --no-cache libc6-compat

RUN npm install -g pnpm

WORKDIR /backend

COPY pnpm-lock.yaml package.json ./

RUN pnpm install

COPY prisma ./prisma/

RUN pnpm prisma generate

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]