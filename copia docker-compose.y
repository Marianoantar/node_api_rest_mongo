version: '3.8'

services:
  mongo:
      image: mongo
      restart: always
      environment:
        MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
        MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASS}
      volumes:
        - ./mongo:/data/db
      ports: 
        - 27017:27017