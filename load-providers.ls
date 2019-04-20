require! {
    \./providers/eth.js
    \./providers/insight.js
    \./providers/xem.js
    \./providers/ripple.js
    \./providers/erc20.js
    \./providers/omni.js
    \./providers/eos.js
    \./providers/stellar.js
    \./providers/tron.js
    #\./providers/cryptonote.js
}
extend-providers = (providers, config)->
    return if typeof! config.providers isnt \Object
    providers <<<< config.providers
module.exports = (config, cb)->
   def = { eth, insight, xem, ripple, erc20, omni, eos, stellar, tron }
   extend-providers def, config
   cb null, def