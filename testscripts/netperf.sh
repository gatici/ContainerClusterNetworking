#!/bin/bash

#tcp_stream
for a in 32 64 128 1024 4096
do
    for b in {1..20}
    do
        sudo docker  exec   ouy  sh  -c "netperf -t TCP_STREAM -f m -H 172.16.100.129   -l 10 -- -m $a "  >>   tcp_stream_t_$a
    done
done


#ts latency
for a in 32 64 128 1024 4096
do
    for b in {1..20}
    do
        sudo docker  exec   ouy  sh  -c "netperf -l 10 -H 172.16.100.129  -t TCP_STREAM  -- -O mean_latency  -m $a "  >>   tcp_stream_la_$a
    done
done






#udp_stream
for a in 32 64 128 1024 4096  
do
    for b in {1..20}
    do
        sudo docker  exec   ouy  sh  -c "netperf -t UDP_STREAM -f m -H 172.16.100.129   -l 10 -- -m $a "  >>   udp_stream_t_$a
    done
done



#us latency
for a in 32 64 128 1024 4096
do
    for b in {1..20}
    do
        sudo docker  exec   ouy  sh  -c "netperf -l 10 -H 172.16.100.129  -t UDP_STREAM  -- -O mean_latency  -m $a "  >>   udp_stream_la_$a
    done
done





#tcp_rr
for a in 32 64 128 1024 4096  
do
    for c in {1..20}
    do
        sudo docker  exec   ouy  sh  -c "netperf -t TCP_RR  -f m -H 172.16.100.129   -- -r $a,$a -b 10 -D "  >>   tcp_rr_t_$a
    done
done


#tr latency
for a in 32 64 128 1024 4096
do
    for b in {1..20}
    do
        sudo docker  exec   ouy  sh  -c "netperf -l 10 -H 172.16.100.129  -t TCP_RR  -- -O mean_latency   "  >>   tcp_rr_la_$a
    done
done



#udp_rr
for a in 32 64 128 1024 4096  
do
    for c in {1..20}
    do
        sudo docker  exec   ouy  sh  -c "netperf -t UDP_RR  -f m -H 172.16.100.129   -- -r $a,$a -b 10 "  >>   udp_rr_t_$a
    done
done


#ur latency
for a in 32 64 128 1024 4096
do
    for b in {1..20}
    do
        sudo docker  exec   ouy  sh  -c "netperf -l 10 -H 172.16.100.129  -t UDP_RR  -- -O mean_latency  "  >>   udp_rr_la_$a
    done
done



#tcp_crr

for a in 32 64 128 1024 4096  
do
    for c in {1..20}
    do
        sudo docker  exec   ouy  sh  -c "netperf -t TCP_CRR  -f m -H 172.16.100.129    -- -r $a,$a -D "  >>   tcp_crr_t_$a
    done
done




