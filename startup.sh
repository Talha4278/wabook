#!/bin/sh
set -eu
cd /workspace
export DATABASE_URL="${DATABASE_URL:-postgresql://neondb_owner:npg_Yg2v5xdpArWF@ep-square-flower-b42fgjue-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require}"
export WHATSAPP_PHONE_NUMBER_ID="${WHATSAPP_PHONE_NUMBER_ID:-1324830960717933}"
export WHATSAPP_TOKEN="${WHATSAPP_TOKEN:-EAAYG0DQCxqIBSrkMugr8ZADG0EZBdIbBMTc3Ae3elKN0aBKQ7PDYZCQLicQZABG5UWWpPXkfoyAmi1hUuZClp2PZAamPe8pBZCFjrmBXGQWOMWWeMHmTUCadbvKRK5beDYf6u3UYodtKUYav9iZAFxfejOLtk07sOcC6xp1cH1sMOTJ80YDzQZAJKq6abFpwFZAQZDZD}"
export WHATSAPP_VERIFY_TOKEN="${WHATSAPP_VERIFY_TOKEN:-wabook-verify}"
node scripts/preview.mjs stop || true
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run db:migrate >>/tmp/app-startup.log 2>&1 || true
npm run dev >>/tmp/app-startup.log 2>&1 &
