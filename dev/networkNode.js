const { application } = require('express');
var express = require('express');
const bodyparser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid');
const rp = require('request-promise');
const { post } = require('request');


var app = express();
const bitcoin = new Blockchain();
//using the bodyparser library to parse any request with form or JSON data
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

const nodeAddress = uuid.v1().split('-').join('');
const port = process.argv[2];

//The homepage
app.get('/', function (req, res) {
    //res.redirect('/blockchain');
    res.send('Please visit the /blockchain endpoint to view the entire blockchain and get more information about what this site does');
});


//the main blockchain endpoint used to see the entire state of our blockchain
app.get('/blockchain', function(req, res) {
    res.send(bitcoin);
});


//creating a new transaction
app.post('/transaction', function(req, res) {
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
    res.json({note: `Transaction will be added on block ${blockIndex}`});

});


//creating a transaction and broadcasting it to other node's pending transactions
app.post('/transaction/broadcast', function(req, res) {
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    bitcoin.addTransactionToPendingTransactions(newTransaction);
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });
    
    Promise.all(requestPromises)
        .then(data => {
            res.json({
                note: "Transaction Created and Broadcasted Successfully"
            });
        })
})


//The mining endpoint where we mine new blocks for our blockchain
app.get('/mine', function(req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    //broadcasting the mined block to other nodes
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: {newBlock: newBlock},
            json: true
        }
        requestPromises.push(rp(requestOptions));
    })

    Promise.all(requestPromises)
        .then(data => {
            //rewarding the endpoint for mining the block
            const requestOptions = {
                uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
                method: 'POST',
                body: {
                    amount: 12.5,
                    sender: "00",
                    recipient: nodeAddress
                },
                json: true
            }
            return rp(requestOptions)
        })
        .then(data => {
            res.json({
                note: "New Block Mined and Broadcasted successfully",
                block: newBlock
            });
        });

});


//recieve-new-block endpoint
app.post('/receive-new-block', function(req, res) {
    const newBlock = req.body.newBlock;
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock["index"] + 1 === newBlock["index"];
    
    if(correctHash && correctIndex) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        res.json({
            note: "New Block received and accepted",
            newBlock: newBlock
        });
    } else {
        res.json({
            note: "New Block rejected",
            newBlock: newBlock
        });
    }

})


//an endpoint to register and broadcast new network nodes to the entire network
app.post('/register-and-broadcast-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    //registering the new node in the present node
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode){
        bitcoin.networkNodes.push(newNodeUrl);
    }

    //broadcasting the new node to other nodes in the network
    const regNodesPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl },
            json: true
        }
        regNodesPromises.push(rp(requestOptions));
    });

    Promise.all(regNodesPromises)
        .then(data => {
            const bulkRegisterOptions = {
                uri: newNodeUrl + '/register-nodes-bulk',
                method: 'POST',
                body: {allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]}, //bitcoin.networkNodes returns an array so we used a ... spread operator to unpack all of its contents into the outer array and we added the URL of the current node that we are in
                json: true
            };
            return rp(bulkRegisterOptions);
        })
        .then(data => {
            res.json({note: 'New node registered with the network successfully'})
        });

});


//an endpoint to register new nodes that are received from other network nodes' broadcasts. 
app.post('/register-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if(nodeNotAlreadyPresent && notCurrentNode) {
        bitcoin.networkNodes.push(newNodeUrl);
    };
    res.json({note: "New node registered successfully"})
});


//this will register multiple nodes at once
//this is used by the new node to register all the nodes present in the network once it is registered
app.post('/register-nodes-bulk', function(req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if(nodeNotAlreadyPresent && notCurrentNode) {
            bitcoin.networkNodes.push(networkNodeUrl);
        };
    });
    res.json({note: "Bulk registration was successfull"});
});


//the consensus endpoint
app.get('/consensus', function(req, res) {
    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        };
        requestPromises.push(rp(requestOptions));
    })

    Promise.all(requestPromises)
        .then(blockchains => {
            const currentChainLength = bitcoin.chain.length;
            let maxChainLength = currentChainLength;
            let newLongestChain = null;
            let newPendingTransactions = null;
            blockchains.forEach(blockchain => {
                if(blockchain.chain.length > currentChainLength) {
                    maxChainLength = blockchain.chain.length;
                    newLongestChain = blockchain.chain;
                    newPendingTransactions = blockchain.pendingTransactions
                };
            });

            if(!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
                res.json({
                    note: 'Current chain has not been replaced',
                    chain: bitcoin.chain
                });
            } else {
                bitcoin.chain = newLongestChain;
                bitcoin.pendingTransactions = newPendingTransactions;
                res.json({
                    note: 'This chain has been replaced',
                    chain: bitcoin.chain
                });
            }
        })

})

//--------------- BLOCK EXPLORER ----------------------
//building the /block/:blockhash endpoint for our block explorer
app.get('/block/:blockHash', function(req, res) {
    const blockHash = req.params.blockHash;
    const correctBlock = bitcoin.getBlock(blockHash);

    res.json({
        block: correctBlock
    });
})

//building the /transaction/:transactionId endpoint for our block-explorer
app.get('/transaction/:transactionId', function(req, res) {
    const transactionId = req.params.transactionId;
    const transactionData = bitcoin.getTransaction(transactionId);

    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    })
})

// building the /address/:address endpoint for the block-explorer
app.get('/address/:address', function(req, res) {
    const address = req.params.address;
    const addressData = bitcoin.getAddressData(address);
    
    res.json({
        addressData: addressData
    })
})

//sending the index.html file when the /block-explorer endpoint is hit
app.get('/block-explorer', function(req, res) {
    res.sendFile('./Block-explorer/index.html', {root: __dirname});
})


//listening for any incoming connections/requests
app.listen(port, function(){
    console.log(`Listening on port ${port}...`);
});