FROM mhart/alpine-node:12 as build-stage
WORKDIR /app/dummysite-application
COPY . ./
RUN npm install


FROM mhart/alpine-node:slim-12
WORKDIR /app/dummysite-application
COPY --from=build-stage /app/dummysite-application /app/dummysite-application

EXPOSE 3000
CMD node index.js