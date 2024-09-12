#!/bin/bash

# Navigate to the ws-test-vanilla-js directory
cd ws-test-vanilla-js || exit 1

# Run node server.js with optimizations
NODE_ENV=production node --max-old-space-size=4096 server.js &
SERVER_PID=$!

# Wait for the server to start (with timeout)
echo "Waiting for the server to start..."
TIMEOUT=30
while ! ss -tuln | grep -q ':8080' && [ $TIMEOUT -gt 0 ]; do
  sleep 1
  ((TIMEOUT--))
done

if [ $TIMEOUT -eq 0 ]; then
  echo "Server failed to start within the timeout period."
  kill $SERVER_PID
  exit 1
fi

echo "Server is running."

# Navigate to the root directory
cd .. || exit 1

# Run npm run dev with optimizations
NODE_ENV=production npm run dev