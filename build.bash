#!/bin/bash

# Navigate to the ws-test-vanilla-js directory
cd ws-test-vanilla-js

# Run node server.js
node server.mjs &

# Wait for the server to start
echo "Waiting for the server to start..."
while ! ss -tuln | grep -q ':8080'; do
  sleep 1
done
echo "Server is running."

# Navigate to the root directory
cd ..

# Run npm run dev
npm run dev