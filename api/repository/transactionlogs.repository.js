'use strict';

const db = require("../database/entity");
const TransactionLogs = db.transactionlogs;

class TransactionLogsRepository{
    constructor(){
    }

    async create(transactionlogs) {
        const newTransactionLogs = await TransactionLogs.create(transactionlogs);
        
        return newTransactionLogs;
    }

    async get() {
        const getTransactionLogs = await TransactionLogs.findAll();

        return getTransactionLogs;
    }
};
exports.TransactionLogsRepository = TransactionLogsRepository