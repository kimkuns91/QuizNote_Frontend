# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# 패키지 매니저 파일 복사
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Prisma 스키마 복사 및 클라이언트 생성
COPY prisma ./prisma/
RUN npx prisma generate

# 코드 복사
COPY . .

# Next.js 애플리케이션 빌드
RUN yarn build

# ---------- Run stage ----------
FROM node:20-alpine

WORKDIR /app

# production만 설치
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# 빌드된 결과 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.js ./

# Prisma Client runtime 코드 복사
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# 포트 노출
EXPOSE 3000

# 프로덕션 모드로 실행
CMD ["yarn", "start"]