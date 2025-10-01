FROM node:20-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=":/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/usr/lib/wsl/lib:/mnt/c/Users/SAMUEL~1.ANA/AppData/Local/Temp/.tmp9lxS1N:/mnt/c/Python312/Scripts/:/mnt/c/Python312/:/mnt/c/WINDOWS/system32:/mnt/c/WINDOWS:/mnt/c/WINDOWS/System32/Wbem:/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/:/mnt/c/WINDOWS/System32/OpenSSH/:/mnt/c/Program Files/dotnet/:/mnt/c/ProgramData/chocolatey/bin:/mnt/c/Program Files/Git/cmd:/mnt/c/Users/Samuel O. Anari/AppData/Roaming/Python/Python312/Scripts:/mnt/c/nvm:/mnt/c/nvm4w/nodejs:/mnt/c/Program Files/PostgreSQL/14/bin:/Docker/host/bin:/mnt/c/Program Files (x86)/dotnet-core-uninstall/:/mnt/c/Program Files/MySQL/MySQL Shell 8.0/bin/:/mnt/c/Users/Samuel O. Anari/AppData/Local/Microsoft/WindowsApps:/mnt/c/Users/Samuel O. Anari/AppData/Local/Programs/Microsoft VS Code/bin:/mnt/c/Users/Samuel O. Anari/.dotnet/tools:/mnt/c/Users/Samuel O. Anari/AppData/Roaming/npm:/mnt/c/nvm:/mnt/c/nvm4w/nodejs:/mnt/c/Users/Samuel O. Anari/AppData/Local/Programs/Azure Data Studio/bin:/mnt/c/Users/Samuel O. Anari/.vscode/extensions/openai.chatgpt-0.4.15-win32-x64/bin/windows-x86_64"
RUN apt-get update -y   && apt-get install -y openssl   && rm -rf /var/lib/apt/lists/*
RUN corepack enable
WORKDIR /usr/src/app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install --production=false

FROM deps AS build
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-slim AS runtime
RUN apt-get update -y   && apt-get install -y openssl   && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY package.json ./package.json
CMD ["node", "dist/server.js"]
