FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Prisma schema requires generating standard client inside container
COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
