# Stage 1: Build the application
FROM node:20-slim AS build-stage

# Set environment and working directory
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy the application source code
COPY . .

# Build the application (output to backend-dist)
RUN yarn build

# Stage 2: Run the application
FROM node:20-slim AS production-stage

# Set environment and working directory
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy only necessary files from the build stage
COPY --from=build-stage /usr/src/app/package*.json ./
COPY --from=build-stage /usr/src/app/dist ./dist
COPY --from=build-stage /usr/src/app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
