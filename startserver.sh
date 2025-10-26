pwd >&2
ls -lR >&2
cd server 
node server.js & 
cd .. 
npm run dev