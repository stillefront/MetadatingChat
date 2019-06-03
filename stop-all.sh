#!/bin/bash

for f in pids/*
do
	echo "kill $f"
	pideins=`cat $f`
	pidzwei=`pgrep -P $pideins`
	piddrei=`pgrep -P $pidzwei`
	
	kill $pideins
	kill $pidzwei
	kill $piddrei

	rm $f
done

#pkill node
