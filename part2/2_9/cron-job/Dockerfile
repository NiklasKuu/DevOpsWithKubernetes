FROM mhart/alpine-node:12 as build-stage
WORKDIR /app/cronjob
COPY . ./
RUN npm install --only=prod


FROM mhart/alpine-node:slim-12
WORKDIR /app/cronjob
COPY --from=build-stage /app/cronjob /app/cronjob

EXPOSE 3000
CMD node index.js