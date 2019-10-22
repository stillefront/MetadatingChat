#!/bin/bash

cd /var/www/vhosts/metathema.net
END=3010
for ((port=3000;port<=END;port++)); do
	./start-one.sh $port
done


