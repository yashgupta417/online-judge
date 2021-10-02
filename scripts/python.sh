#!/bin/bash

# @param source file
# @param input file
# @param base dir
# @param time limit (seconds)
# @param memory limit (bytes)

# output: output.log file is created in the current dir

cd $3
runexec --no-container --timelimit $4 --memlimit $5 --input $2 python $1