#!/usr/bin/env bash

# 1. पुराने किसी भी अटके हुए नोड या पायथन सर्वर को पूरी तरह बंद करना
echo "Stopping old server sessions..."
pkill node 2>/dev/null
pkill python 2>/dev/null
sleep 1

# 2. बैकएंड (कैलकुलेटर इंजन) को चालू करना
echo "1/2 Starting Backend Astro Engine (Port 8787)..."
cd $HOME/manishi-ai-kundli-pro-starter/backend
node server.js &
sleep 2

# 3. फ्रंटएंड (पायथन यूआई सर्वर) को उसकी सही भाषा में चालू करना
echo "2/2 Starting Frontend UI Server (Port 5173)..."
cd $HOME/manishi-ai-kundli-pro-starter/frontend
python3 -m http.server 5173 --bind 127.0.0.1 &

# दोनों सर्वर को पूरी तरह एक्टिव होने के लिए 4 सेकंड का समय देना
echo "Waiting for both servers to link together..."
sleep 4

# 4. अब एंड्रॉइड क्रोम ब्राउज़र को ऑटोमैटिक ओपन करना
echo "🚀 Launching Chrome Browser..."
am start -a android.intent.action.VIEW -d "http://127.0.0.1:5173/?v=phase27-5"
