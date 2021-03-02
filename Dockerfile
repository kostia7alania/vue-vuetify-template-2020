FROM node:lts-alpine as build-stage
WORKDIR /app
RUN apk add git
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build:stage

FROM nginx:stable-alpine as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
