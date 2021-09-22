# syntax=docker/dockerfile:1
FROM node

# With the --production flag (or when the NODE_ENV environment variable is set to production), 
# npm will not install modules listed in devDependencies.
ENV NODE_ENV=production

COPY ["package.json", "package-lock.json", "./"]

# installing npm packages
RUN npm install

# installing binaries
RUN apt-get update && apt-get install g++ python

# configuring runexec
RUN wget https://github.com/sosy-lab/benchexec/releases/download/3.8/benchexec_3.8-1_all.deb && \
    apt -y install --install-recommends ./benchexec_*.deb && adduser root benchexec

COPY . .

ENTRYPOINT [ "npm", "start" ]


