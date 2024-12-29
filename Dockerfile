# Use the latest Ubuntu image
FROM ubuntu:latest

# Set the working directory inside the container
WORKDIR /app

# Update package lists and install npm
RUN apt-get update && apt-get install -y npm \
    && rm -rf /var/lib/apt/lists/*

# Install Cordova globally
RUN npm install -g cordova

# Copy necessary files into the container
ADD ./animation.gif ./config.xml ./package-lock.json ./package.json /app/
COPY ./lib/ /app/lib/
COPY ./needs/ /app/needs/
COPY ./www/ /app/www/

# Add the browser platform for Cordova
RUN echo n | cordova platform add browser

RUN echo #!/bin/bash >> launch.sh
RUN echo "echo n | cordova run browser" >> launch.sh
RUN chmod +x launch.sh

# Command to run the Cordova browser
CMD ["bash", "/app/launch.sh"]

