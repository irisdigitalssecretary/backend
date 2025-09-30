FROM node:20.19.3-bullseye

RUN apt-get update && apt-get install -y \
	wget gnupg lsb-release curl \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]