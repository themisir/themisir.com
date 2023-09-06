#!/usr/bin/env bash

shopt -s globstar
for i in **/*.md; do
    echo "Processing $i..."
    cat "./$i" | /Users/misir/Workspace/repos/github.com/themisir/mawkdown/target/release/mawkdown | tee "./$i" > /dev/null
done
