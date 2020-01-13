#!/bin/bash

for b in {1..20}
do
    python benchrun.py  --host  172.16.100.131  --port  27017    -f   testcases/simple_insert_test.js  -t  1 5 50 100 200   --out  insert_results
	python benchrun.py  --host  172.16.100.131  --port  27017    -f   testcases/simple_update_test.js  -t  1  5 50 100 200  --out  update_results
	python benchrun.py  --host  172.16.100.131  --port  27017    -f   testcases/simple_query_test.js  -t  1 5 50 100 200   --out  query_results
	 
done



