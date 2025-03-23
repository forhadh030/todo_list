# Use Node.js for building the Angular app
FROM node:20 as build

# Set the working directory
WORKDIR /app

# Install dependencies and build the Angular app
COPY package*.json ./
RUN npm install

# Copy the Angular source code and build it
COPY . .
RUN npm run build --prod

# Use NGINX for serving the frontend
FROM nginx:alpine

# Copy the Angular build output to the NGINX HTML directory
COPY --from=build /app/dist/todo-frontend /usr/share/nginx/html

# Expose the frontend port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]