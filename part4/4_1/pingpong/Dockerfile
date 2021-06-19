FROM mhart/alpine-node:12 as build-stage
WORKDIR /app/mainapp
COPY . ./
RUN npm install --only=prod


FROM mhart/alpine-node:slim-12
WORKDIR /app/mainapp
COPY --from=build-stage /app/mainapp /app/mainapp

EXPOSE 3000
CMD node index.js