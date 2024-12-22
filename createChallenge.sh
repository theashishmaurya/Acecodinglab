#!/bin/bash
challenge_name=$1
mkdir -p "$challenge_name"/{template,solution}
cd "$challenge_name"
echo "{\"name\":\"$challenge_name\",\"key\":\"$challenge_name\",\"difficulty\":\"advanced\",\"tags\":[],\"companies\":[],\"testCases\":0}" > metainfo.json
touch template/{App.js,styles.css,question.mdx,"$(echo $challenge_name | sed 's/-//g').test.jsx",}
touch solution/solution.jsx

cd ..