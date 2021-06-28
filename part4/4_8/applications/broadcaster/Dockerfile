FROM mhart/alpine-node:12 as build-stage
WORKDIR /app/broadcaster
COPY . ./
RUN npm install


FROM mhart/alpine-node:slim-12
WORKDIR /app/broadcaster
COPY --from=build-stage /app/broadcaster /app/broadcaster

EXPOSE 3000
CMD node index.js