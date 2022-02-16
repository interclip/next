#!/bin/bash

yarn install --frozen-lockfile --silent --network-timeout 100000
cp .env.example .env
echo "JWT_SECRET=\"$(head -1 <(fold -w 20 <(tr -dc 'a-zA-Z0-9' </dev/urandom)))\"" >>.env
echo "AUTH_SECRET=\"$(head -1 <(fold -w 20 <(tr -dc 'a-zA-Z0-9' </dev/urandom)))\"" >>.env
gp await-port 3306
yarn prisma:migrate
yarn prisma:seed
