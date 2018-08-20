FROM node:8
WORKDIR /app
COPY . /app/
# The .envdefault is what we use for production
RUN cp .envdefault .env
RUN yarn install
RUN yarn run production

FROM nginx:stable
RUN mkdir /usr/share/nginx/html/repl
COPY --from=0 /app/dist /usr/share/nginx/html/repl
COPY prod-nginx.conf /etc/nginx/nginx.conf
COPY prod-nginx-site.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
