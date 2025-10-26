echo 'Running Server'
npm install --quiet 2>&1 >/tmp/npm_install.out
echo 'Home Directory'
pwd >&2
# ls -lR >&2
cd server 
echo 'Starting Backend Server' >&2
node server.js & 
cd .. 
echo 'Starting Frontend Server' >&2
npm run dev -- --port 8000