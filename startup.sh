folder=$(pwd)

ssh ukko182.hpc.cs.helsinki.fi "cd $folder && node lamport.js config.txt 1" & 
ssh ukko183.hpc.cs.helsinki.fi "cd $folder && node lamport.js config.txt 2" &
ssh ukko184.hpc.cs.helsinki.fi "cd $folder && node lamport.js config.txt 3" &
ssh ukko185.hpc.cs.helsinki.fi "cd $folder && node lamport.js config.txt 4" &
ssh ukko186.hpc.cs.helsinki.fi "cd $folder && node lamport.js config.txt 5" &
ssh ukko187.hpc.cs.helsinki.fi "cd $folder && node lamport.js config.txt 6" &
ssh ukko188.hpc.cs.helsinki.fi "cd $folder && node lamport.js config.txt 7" &
ssh ukko189.hpc.cs.helsinki.fi "cd $folder && node lamport.js config.txt 8" &
ssh ukko190.hpc.cs.helsinki.fi "cd $folder && node lamport.js config.txt 9" &
ssh ukko191.hpc.cs.helsinki.fi "cd $folder && node lamport.js config.txt 10" &

#node lamport.js config.txt 1 &
#node lamport.js config.txt 2 &
#node lamport.js config.txt 3 &