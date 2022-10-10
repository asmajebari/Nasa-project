FROM node:lts-alpine

WORKDIR /app 
#name of folder where the files will live

#COPY . . 
#copy files from our folder in the local to the file we just created in the docker image


#Dockerfile works with layers, so we need to break down the commands to be cached
COPY package*.json ./

COPY client/package*.json client/
RUN npm run install-client --only=production 
#not install dev dependencies 

COPY server/package*.json server/
RUN npm run install-server --only=production 

COPY client/ client/
RUN npm run build --prefix client 
#the run command will only run if the files before it have changed

COPY server/ server/

USER node 
#node has less previliges than the root user

CMD ["npm", "start", "--prefix", "server"]

EXPOSE 8000