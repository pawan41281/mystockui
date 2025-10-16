# ==========================================================
# Stage 1: Build Angular App
# ==========================================================
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./

RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

COPY . .

# Build Angular for production
RUN npm run build -- --configuration production || yarn build --configuration production

# ==========================================================
# Stage 2: Serve with Nginx
# ==========================================================
FROM nginx:alpine

# Copy built files (note: Angular outputs to /app/dist)
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
