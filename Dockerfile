# syntax=docker/dockerfile:1
FROM node

# With the --production flag (or when the NODE_ENV environment variable is set to production), 
# npm will not install modules listed in devDependencies.
ENV NODE_ENV=production

COPY ["package.json", "package-lock.json", "./"]

# installing npm packages
RUN npm install

# configuring runexec
RUN apt install software-properties-common && add-apt-repository ppa:sosy-lab/benchmarking && \
    apt install benchexec && \
    mount -t cgroup cgroup /sys/fs/cgroup && \
    chmod o+wt,g+w /sys/fs/cgroup/

# installing binaries
RUN apt-get update && apt-get install g++ python

COPY . .

ENTRYPOINT [ "npm", "start" ]


