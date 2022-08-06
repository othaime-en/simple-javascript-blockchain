//Creating a blockchain data structure
//loading dependencies
const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid');

/*
function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];
    //creating a genesis block
    this.createNewBlock(100, '0', '0');
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash,
    }
    this.pendingTransactions = [];
    this.chain.push(newBlock);
    return newBlock;
}

//retrieving the last block
Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
}

//creating a new transaction
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuid.v3().split('-').join('')
    }
    return newTransaction;
}

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()["index"] + 1;
}

//creating a hash string for all the data in a block
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash
}

//creating a proofOfWork function
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        console.log(hash);
    }
    return nonce;
}

//creating a consensus algorithm for the blockchain
Blockchain.prototype.chainIsValid = function(blockchain) {
        let validChain = true
        
        for(var i = 1; i < blockchain.length; i++) {
            const currentBlock = blockchain[i];
            const prevBlock = blockchain[i - 1];
            const blockHash = this.hashBlock(
                prevBlock['hash'], 
                {transactions: currentBlock['transactions'], index: currentBlock['index']}, 
                currentBlock['nonce'])
            //console.log('previousBlockHash => ' + prevBlock.hash);
            //console.log('currentBlockHash  => ' + currentBlock.hash);
            
            if(currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
            if(blockHash.substring(0, 4) !== '0000') validChain = false;
        }
        
        const genesisBlock = blockchain[0];
        const correctNonce = genesisBlock['nonce'] === 100;
        const correctHash = genesisBlock['hash'] === '0000';
        const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0000'
        const correctTransactions = genesisBlock['transactions'].length === 0
        if(!correctNonce || !correctHash || !correctPreviousBlockHash || !correctTransactions) validChain = false;

        return validChain;
}

//creating a getBlock method to retrive a block for the block explorer
Blockchain.prototype.getBlock = function(blockHash) {
    let correctBlock = null;
    this.chain.forEach(block => {
        if(block.hash === blockHash) correctBlock = block;
    });
    return correctBlock;
};

//creating a getTransaction method
Blockchain.prototype.getTransaction = function(transactionId) {

}

*/

//alternatively, you could use a class implementation of the same.

class Blockchain {
    constructor(){
        this.chain = [];
        this.pendingTransactions = [];
        this.currentNodeUrl = currentNodeUrl;
        this.networkNodes = [];
        this.createNewBlock(100, '0000', '0000') //The genesis block
    }

    createNewBlock(nonce, previousBlockHash, hash) {
        const newBlock = {
            index: this.chain.length + 1,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            nonce: nonce,
            hash: hash,
            previousBlockHash: previousBlockHash
        }
        this.pendingTransactions = [];
        this.chain.push(newBlock);
        return newBlock;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1]
    }

    createNewTransaction(amount, sender, recipient) {
        const newTransaction = {
            amount: amount,
            sender: sender,
            recipient: recipient,
            transactionId: uuid.v4().split('-').join(''),
        }
        return newTransaction;
    }

    addTransactionToPendingTransactions(transactionObj) {
        this.pendingTransactions.push(transactionObj);
        return this.getLastBlock()["index"] + 1;
    }

    hashBlock(previousBlockHash, currentBlockData, nonce) {
        const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        const hash = sha256(dataAsString);
        return hash
    }

    proofOfWork(previousBlockHash, currentBlockData) {
        let nonce = 0;
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        while (hash.substring(0, 4) !== '0000') {
            nonce++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        }
        return nonce;
    }

    chainIsValid(blockchain) {
        let validChain = true
        
        for(var i = 1; i < blockchain.length; i++) {
            const currentBlock = blockchain[i];
            const prevBlock = blockchain[i - 1];
            const blockHash = this.hashBlock(
                prevBlock['hash'], 
                {transactions: currentBlock['transactions'], index: currentBlock['index']}, 
                currentBlock['nonce'])
            //console.log('previousBlockHash => ' + prevBlock.hash);
            //console.log('currentBlockHash  => ' + currentBlock.hash);
            
            if(currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
            if(blockHash.substring(0, 4) !== '0000') validChain = false;
        }
        
        const genesisBlock = blockchain[0];
        const correctNonce = genesisBlock['nonce'] === 100;
        const correctHash = genesisBlock['hash'] === '0000';
        const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0000'
        const correctTransactions = genesisBlock['transactions'].length === 0
        if(!correctNonce || !correctHash || !correctPreviousBlockHash || !correctTransactions) validChain = false;

        return validChain;
    }

    getBlock(blockHash) {
        let correctBlock = null;
        this.chain.forEach(block => {
            if(block.hash === blockHash) correctBlock = block;
        });
        return correctBlock;
    }

    getTransaction(transactionId) {
        let correctTransaction = null;
        let correctBlock = null;
        this.chain.forEach(block => {
            block.transactions.forEach(transaction => {
                if(transaction.transactionId == transactionId) {
                    correctTransaction = transaction;
                    correctBlock = block;
                } 
            });
        });

        return {
            transaction: correctTransaction,
            block: correctBlock
        };
    }

    getAddressData(address) {
        const addressTransactions = [];
        this.chain.forEach(block => {
            block.transactions.forEach(transaction => {
                if(transaction.sender === address || transaction.recipient === address) addressTransactions.push(transaction);
            });
        })
        
        let balance = 0;
        addressTransactions.forEach(transaction => {
            if(transaction.recipient === address) balance += transaction.amount;
            else if(transaction.sender === address) balance -= transaction.amount;
        });

        return {
            addressTransactions: addressTransactions,
            addressBalance: balance
        }
    }

}



module.exports = Blockchain;