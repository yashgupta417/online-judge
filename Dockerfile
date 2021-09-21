# syntax=docker/dockerfile:1
FROM node

# With the --production flag (or when the NODE_ENV environment variable is set to production), 
# npm will not install modules listed in devDependencies.
ENV NODE_ENV=production

COPY ["package.json", "package-lock.json", "./"]

# installing npm packages
RUN npm install

# configuring runexec
RUN sudo add-apt-repository ppa:sosy-lab/benchmarking && \
    sudo apt install benchexec && \
    sudo mount -t cgroup cgroup /sys/fs/cgroup && \
    sudo chmod o+wt,g+w /sys/fs/cgroup/

# installing binaries
RUN sudo apt-get update && sudo apt-get install g++ python

COPY . .

ENTRYPOINT [ "npm", "start" ]


