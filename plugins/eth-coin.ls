export mainnet =
    decimals: 18
    tx-fee: \0.0084
    message-prefix: 'Ethereum'
    mask: \0x0000000000000000000000000000000000000000
    api:
        provider: \eth
        web3Provider : \https://mainnet.infura.io/UoCkF4efTrbEGU8Qpcs0
        url : \https://etherscan.io
        apiUrl : \https://api.etherscan.io/api
export ethnamed =
    decimals: 18
    tx-fee: \0.0084
    message-prefix: 'Ethereum'
    mask: \0x0000000000000000000000000000000000000000
    api:
        provider: \eth
        web3Provider : \http://ethnamed.io:9000
        url : \http://ethnamed.io:8000
        apiUrl : \http://ethnamed.io:8000/api
export ropsten =
    decimals: 18
    tx-fee: \0.0084
    message-prefix: 'Ethereum'
    mask: \0x0000000000000000000000000000000000000000
    api:
        provider: \eth
        web3Provider : "https://ropsten.infura.io/UoCkF4efTrbEGU8Qpcs0"
        url : "https://ropsten.etherscan.io"
        apiUrl : "http://api-ropsten.etherscan.io/api"
export testnet = ropsten
export type = \coin    
export enabled = yes
export token = \eth
export image = \./res/eth-ethnamed.png