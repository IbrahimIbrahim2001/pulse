FROM oven/bun:1.1-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Generate Prisma client
RUN bunx prisma generate

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]