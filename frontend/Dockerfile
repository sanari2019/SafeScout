FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=development
ENV EXPO_WEB_PORT=8080

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "web", "--", "--port", "8080", "--clear"]
