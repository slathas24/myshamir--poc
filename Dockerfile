FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npx tsc 
EXPOSE 7090
ENV VAULT_TOKEN=ss
ENV VAULT_URL=ss
ENV PG1_HOST=ss
ENV PG2_HOST=ss
ENV PG1_PORT=ss
ENV PG2_PORT=ss
ENV MS1_HOST=ss
ENV MS1_PORT=ss

CMD ["node", "indexrest.js"]

