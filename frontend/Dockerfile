FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 4173
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
