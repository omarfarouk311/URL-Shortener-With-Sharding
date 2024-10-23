FROM node:latest
WORKDIR /code
COPY . /code
RUN ["npm","install"]
ENTRYPOINT [ "node" ]
CMD [ "app.js" ]