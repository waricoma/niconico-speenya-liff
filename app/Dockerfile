FROM node:10.14

COPY . /var/src/app/
WORKDIR /var/src/app
RUN yarn
EXPOSE 3000
CMD ["sh", "-c", "yarn run babel && yarn run sequelize:migrate && yarn run start"]
