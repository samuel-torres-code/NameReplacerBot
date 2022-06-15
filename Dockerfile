FROM node:16
WORKDIR /usr/src/app


#install app dependencies
COPY package*.json ./
RUN npm install

#Bundle app source
COPY . .

CMD ["npm", "start"]