#!/bin/bash

#tcp_bandwith_latency

for b in {1..20}
do
       docker run -ti --net=calico-net  dockerqperf -vvs  172.16.100.134  -lp 4000 -ip 4001 tcp_bw tcp_lat   >>   tcp_bandwith_latency_2

done


#udp_bandwith_latency

for b in {1..20}
do
       docker run -ti  --net=calico-net dockerqperf -vvs  172.16.100.134  -lp 4000 -ip 4001 udp_bw udp_lat   >>  udp_bandwith_latency_2
      
done


#sctp_bandwith_latency

for b in {1..20}
do
       docker run -ti --net=calico-net   dockerqperf -vvs  172.16.100.134  -lp 4000 -ip 4001 sctp_bw sctp_lat    >> sctp_bandwith_latency_2
      
done






