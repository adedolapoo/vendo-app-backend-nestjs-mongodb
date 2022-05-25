#!/bin/sh
if [ "$NODE_ENV" = "development" ]; then
    npm run start:dev
else
    npm run start:prod
fi
