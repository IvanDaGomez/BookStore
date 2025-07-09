FROM node:20-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3030
RUN npm run build
ENV NODE_ENV=production
ENV PORT=3030
CMD ["npm", "run", "start"]