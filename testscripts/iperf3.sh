#!/bin/bash

#5203  server  port

#tcp_bandwith_window_size 

for b in {1..20}
do
     iperf3 -c  172.16.100.132 -p 5203 -w  8KB   >>  tcp_bandwith_window_size_8
	 iperf3 -c  172.16.100.132 -p 5203 -w  16KB   >>   tcp_bandwith_window_size_16
	 iperf3 -c  172.16.100.132 -p 5203 -w  32KB   >>   tcp_bandwith_window_size_32
	 iperf3 -c  172.16.100.132 -p 5203 -w  64KB   >>   tcp_bandwith_window_size_64
	 iperf3 -c  172.16.100.132 -p 5203 -w  128KB   >>   tcp_bandwith_window_size_128
done




#udp_bandwith

for b in {1..20}
do
     iperf3 --udp -c 172.16.100.132 -p 5203  >>   udp_bandwith
done 



#tcp_bandwith_paralel_streams
for a in 5 10 30 100 
do
    for b in {1..20}
    do
         iperf3 -c 172.16.100.132 -p 5203 -P $a  >>   tcp_bandwith_paralel_$a
    done

done


#udp_bandwith_paralel_streams
for a in 5 10 30 100 
do
    for b in {1..20}
    do
         iperf3 --udp  -c 172.16.100.132 -p 5203 -P $a  >>   udp_bandwith_paralel_$a
    done

done

