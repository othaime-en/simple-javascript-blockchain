# simple-javascript-blockchain

This is a simple blockchain created using javascript and nodejs

It is a good place to under stand how the blockchain works.

As a start, run the following commands

```script
npm install
npm run node_1
npm run node_2
npm run node_3
npm run node_4
npm run node_5
```

You can add as many nodes as you would like in the package.json file in the scripts object

```script
"node_NUMBER": "nodemon --watch dev -e js dev/networkNode.js 300_NUMBER http://localhost:300_NUMBER"
```

Replace NUMBER with an actual number incrementally. i.e. 3006, 3007, 3008 etc.
