FROM mhart/alpine-node:12 as build-stage
WORKDIR /app/dummysite-controller
COPY . ./
RUN npm install


FROM mhart/alpine-node:slim-12
WORKDIR /app/dummysite-controller
COPY --from=build-stage /app/dummysite-controller /app/dummysite-controller

EXPOSE 3000
CMD node index.js