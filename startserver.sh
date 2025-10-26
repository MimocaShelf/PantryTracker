pwd >&2
ls -lR >&2
cd server 
npm install
node server.js & 
cd .. 
npm run dev