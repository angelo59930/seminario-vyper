"use strict";

function now() {
  return Math.trunc(new Date().getTime() / 1000);
}

async function verifyThrows(pred, message) {
  let e;
  try {
    await pred();
  } catch (ex) {
    e = ex;
  }
  assert.throws(() => {
    if (e) {
      throw e;
    }
  }, message);
}

class HashGenerator {
  constructor() {
    this.seed = 0;
  }

  next() {
    this.seed++;
    return this.current();
  }

  current() {
    return this.get(this.seed);
  }

  get(seed) {
    return web3.utils.keccak256(web3.utils.toHex(seed));
  }

  set(seed) {
    this.seed = seed;
  }
}

function checkEvent(tx, name, properties) {
  let eventLog = undefined;
  for (let log of tx.logs) {
    if (log.event == name) {
      eventLog = log;
      break;
    }
  }
  assert(eventLog != undefined, `No se emitió el evento ${name}`);
  for (let key in properties) {
    assert.equal(
      properties[key],
      eventLog.args[key],
      `Evento con valor incorrecto. Se esperaba ${key} = ${properties[key]} y se obtuvo ${eventLog.args[key]}`
    );
  }
}

exports.verifyThrows = verifyThrows;
exports.now = now;
exports.HashGenerator = HashGenerator;
exports.checkEvent = checkEvent;
exports.emptyAddress = "0x0000000000000000000000000000000000000000";
