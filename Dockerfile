FROM node:20.19.3-bullseye

RUN apt-get update && apt-get install -y \
	wget gnupg lsb-release curl \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE ${PORT}

CMD ["npm", "run", "dev"]