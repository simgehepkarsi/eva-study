'use strict';

const { TransactionLogsService } = require('../service/transactionlogs.service')

class TransactionLogsController{
    constructor(){
    }

    async createlog(req, res){
        const trade = req.body;
        const transactionlogsService = new TransactionLogsService();
        const response = await transactionlogsService.createlog(trade);
        
        if(response === false){
            return res.status(500).send(response);
        }
        return res.status(200).send(response);
    }

    async getlogs(req, res){
        const transactionlogsService = new TransactionLogsService();
        const response = await transactionlogsService.getlogs();
        
        if(response === false){
            return res.status(500).send(response);
        }
        return res.status(200).send(response);
    }
};
exports.TransactionLogsController = TransactionLogsController