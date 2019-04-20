// Generated by LiveScript 1.6.0
(function(){
  var stringify, ref$, filter, map, foldl, each, plus, minus, times, div, fromHex, get, post, Tx, BN, jsonParse, getFullpairByIndex, deadline, makeQuery, calcFee, getKeys, toHex, transformTx, getTransactions, getDec, calcGasPrice, getNonce, createTransaction, checkDecodedData, pushTx, checkTxStatus, getTotalReceived, getUnconfirmedBalance, getBalance, out$ = typeof exports != 'undefined' && exports || this, toString$ = {}.toString;
  stringify = require('qs').stringify;
  ref$ = require('prelude-ls'), filter = ref$.filter, map = ref$.map, foldl = ref$.foldl, each = ref$.each;
  ref$ = require('../math.js'), plus = ref$.plus, minus = ref$.minus, times = ref$.times, div = ref$.div, fromHex = ref$.fromHex;
  ref$ = require('superagent'), get = ref$.get, post = ref$.post;
  Tx = require('ethereumjs-tx');
  BN = require('ethereumjs-util').BN;
  jsonParse = require('../json-parse.js');
  getFullpairByIndex = require('whitebox').getFullpairByIndex;
  deadline = require('../deadline.js');
  makeQuery = function(network, method, params, cb){
    var web3Provider, query;
    web3Provider = network.api.web3Provider;
    query = {
      jsonrpc: '2.0',
      id: 1,
      method: method,
      params: params
    };
    return post(web3Provider, query).end(function(err, data){
      var ref$;
      if (err != null) {
        return cb("query err: " + ((ref$ = err.message) != null ? ref$ : err));
      }
      if (data.body.error != null) {
        return cb(data.body.error);
      }
      return cb(null, data.body.result);
    });
  };
  out$.calcFee = calcFee = function(arg$, cb){
    var network, feeType, account, amount, to, data, dec;
    network = arg$.network, feeType = arg$.feeType, account = arg$.account, amount = arg$.amount, to = arg$.to, data = arg$.data;
    if (feeType !== 'auto') {
      return cb(null);
    }
    dec = getDec(network);
    console.log('p0');
    return calcGasPrice({
      feeType: feeType,
      network: network
    }, function(err, gasPrice){
      var value, dataParsed, from, query;
      if (err != null) {
        return cb(err);
      }
      value = (function(){
        switch (false) {
        case amount == null:
          return times(amount, dec);
        default:
          return 0;
        }
      }());
      dataParsed = (function(){
        switch (false) {
        case data == null:
          return data;
        default:
          return '0x';
        }
      }());
      from = account.address;
      query = {
        from: from,
        to: to,
        data: dataParsed
      };
      return makeQuery(network, 'eth_estimateGas', [query], function(err, estimate){
        var ref$, res, val;
        if (err != null) {
          return cb("estimate gas err: " + ((ref$ = err.message) != null ? ref$ : err));
        }
        res = times(gasPrice, fromHex(estimate));
        val = div(res, dec);
        return cb(null, val);
      });
    });
  };
  out$.getKeys = getKeys = function(arg$, cb){
    var network, mnemonic, index, result;
    network = arg$.network, mnemonic = arg$.mnemonic, index = arg$.index;
    result = getFullpairByIndex(mnemonic, index, network);
    return cb(null, result);
  };
  toHex = function(it){
    return new BN(it);
  };
  transformTx = curry$(function(network, t){
    var url, dec, tx, amount, time, fee;
    url = network.api.url;
    dec = getDec(network);
    network = 'eth';
    tx = t.hash;
    amount = div(t.value, dec);
    time = t.timeStamp;
    url = url + "/tx/" + tx;
    fee = div(times(t.cumulativeGasUsed, t.gasPrice), dec);
    return {
      network: network,
      tx: tx,
      amount: amount,
      fee: fee,
      time: time,
      url: url,
      from: t.from,
      to: t.to
    };
  });
  out$.getTransactions = getTransactions = function(arg$, cb){
    var network, address, apiUrl, module, action, startblock, endblock, sort, apikey, query;
    network = arg$.network, address = arg$.address;
    apiUrl = network.api.apiUrl;
    module = 'account';
    action = 'txlist';
    startblock = 0;
    endblock = 99999999;
    sort = 'asc';
    apikey = '4TNDAGS373T78YJDYBFH32ADXPVRMXZEIG';
    query = stringify({
      module: module,
      action: action,
      apikey: apikey,
      address: address,
      sort: sort,
      startblock: startblock,
      endblock: endblock
    });
    return get(apiUrl + "?" + query).timeout({
      deadline: deadline
    }).end(function(err, resp){
      var ref$;
      if (err != null) {
        return cb("cannot execute query - err " + ((ref$ = err.message) != null ? ref$ : err));
      }
      return jsonParse(resp.text, function(err, result){
        var ref$, txs;
        if (err != null) {
          return cb("cannot parse json: " + ((ref$ = err.message) != null ? ref$ : err));
        }
        if (toString$.call(result != null ? result.result : void 8).slice(8, -1) !== 'Array') {
          return cb("Unexpected result");
        }
        txs = map(transformTx(network))(
        result.result);
        return cb(null, txs);
      });
    });
  };
  getDec = function(network){
    var decimals;
    decimals = network.decimals;
    return Math.pow(10, decimals);
  };
  calcGasPrice = function(arg$, cb){
    var feeType, network;
    feeType = arg$.feeType, network = arg$.network;
    if (feeType === 'cheap') {
      return cb(null, '3000000000');
    }
    return makeQuery(network, 'eth_gasPrice', [], function(err, price){
      var ref$;
      if (err != null) {
        return cb("calc gas price - err: " + ((ref$ = err.message) != null ? ref$ : err));
      }
      return cb(null, fromHex(price));
    });
  };
  getNonce = function(arg$, cb){
    var network, account;
    network = arg$.network, account = arg$.account;
    return makeQuery(network, 'eth_getTransactionCount', [account.address, 'pending'], function(err, nonce){
      var ref$;
      if (err != null) {
        return cb("cannot get nonce - err: " + ((ref$ = err.message) != null ? ref$ : err));
      }
      return cb(null, fromHex(nonce));
    });
  };
  out$.createTransaction = createTransaction = curry$(function(arg$, cb){
    var network, account, recipient, amount, amountFee, data, feeType, txType, dec, privateKey;
    network = arg$.network, account = arg$.account, recipient = arg$.recipient, amount = arg$.amount, amountFee = arg$.amountFee, data = arg$.data, feeType = arg$.feeType, txType = arg$.txType;
    dec = getDec(network);
    privateKey = new Buffer(account.privateKey.replace(/^0x/, ''), 'hex');
    return getNonce({
      account: account,
      network: network
    }, function(err, nonce){
      var toWei, toEth, value;
      if (err != null) {
        return cb(err);
      }
      toWei = function(it){
        return times(it, dec);
      };
      toEth = function(it){
        return div(it, dec);
      };
      value = toWei(amount);
      return calcGasPrice({
        feeType: feeType,
        network: network
      }, function(err, gasPrice){
        var gasEstimate;
        if (err != null) {
          return cb(err);
        }
        gasEstimate = div(toWei(amountFee), gasPrice);
        return makeQuery(network, 'eth_getBalance', [account.address, 'latest'], function(err, balance){
          var balanceEth, toSend, tx, rawtx;
          if (err != null) {
            return cb(err);
          }
          balanceEth = toEth(balance);
          toSend = plus(amount, amountFee);
          if (+balanceEth < +toSend) {
            return cb("Balance " + balanceEth + " is not enough to send tx " + toSend);
          }
          tx = new Tx({
            nonce: toHex(nonce),
            gasPrice: toHex(gasPrice),
            value: toHex(value),
            gas: toHex(gasEstimate),
            to: recipient,
            from: account.address,
            data: data != null ? data : ""
          });
          tx.sign(privateKey);
          rawtx = '0x' + tx.serialize().toString('hex');
          return cb(null, {
            rawtx: rawtx
          });
        });
      });
    });
  });
  out$.checkDecodedData = checkDecodedData = function(decodedData, data){
    if (!(decodedData != null ? decodedData : "").length === 0) {
      return false;
    }
    if (!(data != null ? data : "").length === 0) {
      return false;
    }
  };
  out$.pushTx = pushTx = curry$(function(arg$, cb){
    var network, rawtx;
    network = arg$.network, rawtx = arg$.rawtx;
    return makeQuery(network, 'eth_sendRawTransaction', [rawtx], function(err, txid){
      var ref$;
      if (err != null) {
        return cb("cannot get signed tx - err: " + ((ref$ = err.message) != null ? ref$ : err));
      }
      return cb(null, txid);
    });
  });
  out$.checkTxStatus = checkTxStatus = function(arg$, cb){
    var network, tx;
    network = arg$.network, tx = arg$.tx;
    return cb("Not Implemented");
  };
  out$.getTotalReceived = getTotalReceived = function(arg$, cb){
    var address, network;
    address = arg$.address, network = arg$.network;
    return getTransactions({
      address: address,
      network: network
    }, function(err, txs){
      var total;
      total = foldl(plus, 0)(
      map(function(it){
        return it.amount;
      })(
      filter(function(it){
        return it.to.toUpperCase() === address.toUpperCase();
      })(
      txs)));
      return cb(null, total);
    });
  };
  out$.getUnconfirmedBalance = getUnconfirmedBalance = function(arg$, cb){
    var network, address;
    network = arg$.network, address = arg$.address;
    return makeQuery(network, 'eth_getBalance', [address, 'pending'], function(err, number){
      var dec, balance;
      if (err != null) {
        return cb(err);
      }
      dec = getDec(network);
      balance = div(number, dec);
      return cb(null, balance);
    });
  };
  out$.getBalance = getBalance = function(arg$, cb){
    var network, address;
    network = arg$.network, address = arg$.address;
    return makeQuery(network, 'eth_getBalance', [address, 'latest'], function(err, number){
      var dec, balance;
      if (err != null) {
        return cb(err);
      }
      dec = getDec(network);
      balance = div(number, dec);
      return cb(null, balance);
    });
  };
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
}).call(this);
