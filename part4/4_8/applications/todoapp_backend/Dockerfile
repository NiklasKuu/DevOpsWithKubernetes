FROM mhart/alpine-node:12 as build-stage
WORKDIR /app/todoapp-backend
COPY . ./
RUN npm install --only=prod


FROM mhart/alpine-node:slim-12
WORKDIR /app/todoapp-backend
COPY --from=build-stage /app/todoapp-backend /app/todoapp-backend

EXPOSE 3000
CMD node index.js