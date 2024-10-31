# Use the official Node.js image from the Docker Hub
FROM node:14

# Create and set the working directory
WORKDIR /home/associate/cloudDeployment/fmts

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
