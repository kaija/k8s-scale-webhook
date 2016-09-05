FROM node:4.5.0-slim
COPY app /app
WORKDIR /app
RUN npm install

EXPOSE 8080
ENV PORT=8080
CMD ["npm", "start"]
