# Get the Latest Nodejs Version
FROM node:lts

# Create a new work directory called /app 
WORKDIR /app

EXPOSE 3000 3000

# Copy the contents of root folder to /app folder
COPY . /app
RUN yarn install
RUN yarn build

CMD ["yarn", "start"]
