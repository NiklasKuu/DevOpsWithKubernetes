FROM mhart/alpine-node:12 as build-stage
WORKDIR /app/todoapp
COPY . ./
RUN npm install --only=prod


FROM mhart/alpine-node:slim-12
WORKDIR /app/todoapp
COPY --from=build-stage /app/todoapp /app/todoapp
RUN    chmod a+x /app/todoapp && adduser -D appuser
USER appuser
EXPOSE 3000
CMD node ./bin/www