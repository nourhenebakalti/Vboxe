# VBoxe Application Deployment Guide

This guide will help you deploy the VBoxe application on a Linux server using Docker.

## Prerequisites

- A Linux server (Ubuntu 20.04/22.04 recommended)
- Git
- Docker and Docker Compose
- Node.js 16+ (for building the frontend)
- Java 11+ (for building the backend)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/vboxe-app.git
   cd vboxe-app
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your configuration
   ```

3. **Make the deployment script executable**
   ```bash
   chmod +x deploy.sh
   ```

4. **Run the deployment script**
   ```bash
   ./deploy.sh
   ```

## Manual Deployment

### 1. Install Dependencies

```bash
# Update package lists
sudo apt-get update

# Install Docker and Docker Compose
sudo apt-get install -y docker.io docker-compose

# Add current user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Build and Start the Application

```bash
# Build frontend
cd vboxeFront
npm install
npm run build -- --configuration production
cd ..

# Build backend
cd backVBoxe
./mvnw clean package -DskipTests
cd ..

# Start all services
docker-compose up --build -d
```

## Accessing the Application

- **Frontend**: http://your-server-ip
- **Backend API**: http://your-server-ip:8080
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

## Managing the Application

- **View logs**: `docker-compose logs -f`
- **Stop the application**: `docker-compose down`
- **Update the application**: `git pull && ./deploy.sh`

## Production Considerations

### 1. Set Up a Reverse Proxy (Nginx)

```bash
# Install Nginx
sudo apt-get install -y nginx

# Create a new site configuration
sudo nano /etc/nginx/sites-available/your-domain
```

Add the following configuration (replace `your-domain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/your-domain /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain and install SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Set up automatic renewal
echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q" | sudo tee -a /etc/crontab > /dev/null
```

## Backup and Restore

### Backup MongoDB Data

```bash
# Create a backup
docker exec -t $(docker ps -qf "name=mongo") mongodump --out /data/backup/$(date +%Y%m%d)

# Copy backup from container to host
docker cp $(docker ps -qf "name=mongo"):/data/backup ./backup
```

### Restore MongoDB Data

```bash
# Copy backup to container
docker cp ./backup/$(ls -t ./backup | head -1) $(docker ps -qf "name=mongo"):/data/restore

# Restore the backup
docker exec -t $(docker ps -qf "name=mongo") mongorestore --drop /data/restore
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 80, 8080, 27017, and 6379 are not in use.
2. **Permission issues**: Run `sudo usermod -aG docker $USER` and log out/log back in.
3. **Build failures**: Check the logs with `docker-compose logs -f`.

### Viewing Logs

- **All services**: `docker-compose logs -f`
- **Specific service**: `docker-compose logs -f service_name` (e.g., `backend`, `frontend`, `mongo`, `redis`)

## Support

For support, please open an issue on GitHub or contact the development team.
