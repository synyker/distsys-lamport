folder=$(pwd)

ssh ukko177.hpc.cs.helsinki.fi "cd $folder && node lamport.js config.txt 1 &"
ssh ukko178.hpc.cs.helsinki.fi "cd $folder && node lamport.js config.txt 2 &"
ssh ukko179.hpc.cs.helsinki.fi "cd $folder && node lamport.js config.txt 3 &"
