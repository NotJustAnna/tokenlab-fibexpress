/**
 * Esse arquivo faz bootstrap do ts-node para uma Worker Thread.
 */
const path = require('path');
require('ts-node').register();
require(path.resolve(__dirname, './workerMain.ts'));
