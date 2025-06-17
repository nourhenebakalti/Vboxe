#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting VBoxe deployment..."

# Install required packages
echo "🔧 Installing required packages..."
sudo apt-get update
sudo apt-get install -y docker.io docker-compose git

# Add current user to docker group
echo "👤 Adding user to docker group..."
sudo usermod -aG docker $USER
newgrp docker

# Clone or update the repository
if [ -d "vboxe-app" ]; then
    echo "📂 Updating existing repository..."
    cd vboxe-app
    git pull origin main
else
    echo "📥 Cloning repository..."
    git clone https://github.com/your-username/vboxe-app.git
    cd vboxe-app
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Please create one from .env.example"
    cp .env.example .env
    echo "ℹ️  Please edit the .env file with your configuration and run this script again."
    exit 1
fi

# Build and start the application
echo "🚀 Building and starting the application..."

# Build frontend
echo "🔨 Building frontend..."
cd vboxeFront
npm install
npm run build -- --configuration production
cd ..

# Build backend
echo "🔧 Building backend..."
cd backVBoxe
./mvnw clean package -DskipTests
cd ..

# Start containers
echo "🐳 Starting Docker containers..."
docker-compose up --build -d

echo "✅ Deployment complete!"
echo "🌐 Frontend should be available at: http://your-server-ip"
echo "🔌 Backend API available at: http://your-server-ip:8080"

echo "\n📝 To view logs, run: docker-compose logs -f"
echo "🔧 To stop the application: docker-compose down"
echo "🔄 To update the application: ./deploy.sh"
