#!/bin/bash

# Navigate to the ws-test-vanilla-js directory
cd ws-test-vanilla-js

# Run node server.js
node server.js &

# Navigate to the root directory
cd ..

# Run npm run dev
npm run dev