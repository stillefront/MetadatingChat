#!/bin/bash
cd /var/www/vhosts/metathema.net
while :
do
	./start-all.sh
	sleep 30
done
