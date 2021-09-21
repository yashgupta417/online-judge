# syntax=docker/dockerfile:1
FROM node

#With the --production flag (or when the NODE_ENV environment variable is set to production), 
#npm will not install modules listed in devDependencies.
ENV NODE_ENV=production

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .

ENTRYPOINT [ "npm", "start" ]


