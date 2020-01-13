#!/bin/bash

for b in {1..20}
do
     jmeter -n -t sample-test/sample-test5.jmx -R172.16.100.136   >>  test5
	 jmeter -n -t sample-test/sample-test50.jmx -R172.16.100.136   >> test50
	 jmeter -n -t sample-test/sample-test100.jmx -R172.16.100.136    >> test100
	 jmeter -n -t sample-test/sample-test200.jmx -R172.16.100.136  >> test200
	 
done



