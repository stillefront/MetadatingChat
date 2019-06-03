#!/bin/bash
cd /var/www/vhosts/metathema.net
port=$1
echo $port
export metadating_PrivateKey=sic12839heresPasswort123
PORT=$port npm start >/dev/null 2>&1 &
#PORT=$port nohup npm start > "logs/$port.log" 2>&1 &

echo $! > pids/$port
