i=1
length=$(cat ukkonodes|wc -l)
char="p"
baseip=".hpc.cs.helsinki.fi"
user=$(whoami)

while [ $i -le $length ]; do
        node=$(sed -n "$i$char" < ukkonodes)
        ssh $node$baseip "killall -u $user"
        i=$[$i+1]
done
