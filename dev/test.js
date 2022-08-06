//importing the module from the blockchain file

const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();
const uuid = require('uuid');

console.log(uuid.v1())

const bc1 = {"chain":[{"index":1,"timestamp":1655900851052,"transactions":[],"nonce":100,"hash":"0000","previousBlockHash":"0000"},{"index":2,"timestamp":1655900977426,"transactions":[{"amount":230,"sender":"FSGGT53ERF45HATS51YSGG6657382HSYS","recipient":"MFBHUY5DFWQ12TyYYA654637YST6583I","transactionId":"5d008c4dae414ac8a2c837cd26da7336"},{"amount":230,"sender":"FSGGT53ERF45HATS51YSGG6657382HSYS","recipient":"MFBHUY5DFWQ12TyYYA654637YST6583I","transactionId":"e31d1d1829994825b7e59ceff0b60f72"}],"nonce":114279,"hash":"0000d078c2e879b59f49c16b519bdac242d75f8844666f2ce71d66db495c39fa","previousBlockHash":"0000"},{"index":3,"timestamp":1655900986455,"transactions":[{"amount":12.5,"sender":"00","recipient":"af9cf160f22611ecb1881de02f70fac1","transactionId":"9d1ebb72bbbd4d428dc63664cde0150a"}],"nonce":20714,"hash":"000060cf279f2ea0eaefd272694aa7cabd88293a9eca1825d3de28b0d8ee8fee","previousBlockHash":"0000d078c2e879b59f49c16b519bdac242d75f8844666f2ce71d66db495c39fa"},{"index":4,"timestamp":1655900991654,"transactions":[{"amount":12.5,"sender":"00","recipient":"af9cf160f22611ecb1881de02f70fac1","transactionId":"bdb625c8d7894f7ca65f24cb85fdc42b"}],"nonce":24269,"hash":"00009a2e5f9dff1959bc78e9a49a6dcc4f5c3418abe7e5214f06c54cd8e6d3b6","previousBlockHash":"000060cf279f2ea0eaefd272694aa7cabd88293a9eca1825d3de28b0d8ee8fee"},{"index":5,"timestamp":1655900994874,"transactions":[{"amount":12.5,"sender":"00","recipient":"af9cf160f22611ecb1881de02f70fac1","transactionId":"d3fa48efa090482cb03f987026825ecb"}],"nonce":2089,"hash":"0000c2f1db98aadf9b32e05bd435f96600d5f219fc629c21f5fbbe90cbf2778b","previousBlockHash":"00009a2e5f9dff1959bc78e9a49a6dcc4f5c3418abe7e5214f06c54cd8e6d3b6"},{"index":6,"timestamp":1655901150101,"transactions":[{"amount":12.5,"sender":"00","recipient":"af9cf160f22611ecb1881de02f70fac1","transactionId":"0114a8e4947f4513a5ab226e5a235fae"},{"amount":2305,"sender":"JFSGGT53ERF45HATS51YSGG6657382HSYS","recipient":"BMFBHUY5DFWQ12TyYYA654637YST6583I","transactionId":"61ff87b7d8ab4e01a9c17e1438ad7cd3"},{"amount":2305,"sender":"JFSGGT53ERF45HATS51YSGG6657382HSYS","recipient":"BMFBHUY5DFWQ12TyYYA654637YST6583I","transactionId":"c6d963fc04e9463882315fd8acb82bac"}],"nonce":6698,"hash":"0000a364b316e34aa581d4d7b7009a61fa5e358bcce0b5d96f0bc417ca265c7e","previousBlockHash":"0000c2f1db98aadf9b32e05bd435f96600d5f219fc629c21f5fbbe90cbf2778b"}],"pendingTransactions":[{"amount":12.5,"sender":"00","recipient":"af9cf160f22611ecb1881de02f70fac1","transactionId":"79a984f1b6b449eba57f33e6a9061f37"}],"currentNodeUrl":"http://localhost:3001","networkNodes":[]}

console.log("VALID: ", bitcoin.chainIsValid(bc1.chain));
const previousBlockHash = '87765DA6CCF0668238C1D27C35692E11';
const currentBlockData = [
    {
        amount: 1000,
        sender: 'B4CE59C0E5CD571',
        recipient: '56563855CGD44',
    },
    {
        amount: 756,
        sender: '3A3F6E462D48E9',
        recipient: 'B4CEE8C0E5CD571',
    },
    {
        amount: 30,
        sender: 'B4CEE9C0E5CD571',
        recipient: '3A3F6E462D48E9',
    }
]
const nonce = 1027;


//console.log(bitcoin)

//console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce))
//console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));
