'use strict';

const { TransactionLogsRepository } = require("../repository/transactionlogs.repository");

class TransactionLogsService{
    constructor(){
    }

    async createlog(log){
        const validateCreateLog = this.validateCreateLog(log);

        let res = {
            status: true,
            message: ""
        };

        if(validateCreateLog.status === false){
            res.message = validateCreateLog.message;
            res.status = false;
            return res;
        }
        
        const transactionlogsRepository = new TransactionLogsRepository();
        const createres = await transactionlogsRepository.create(log);
        if(createres === null){
            return null; 
        }

        return createres;
    }

    async getlogs(){

        const transactionlogsRepository = new TransactionLogsRepository();
        const getres = await transactionlogsRepository.get();
        if(getres === null){
            return null; 
        }
        
        return getres;
    }

    validateCreateLog(log){
        try {
             let res = {
                 status: true,
                 message: "Ok."
             };
             if(isNaN(log.traderId) || (!log.shareCode) || isNaN(log.shareAmount) || isNaN(log.sharePrice)|| (!log.tradeSide) || (!log.status)){
                res.status = false;
                res.message ="Missing parameter.";
                return res;
             }
             return res;
         } catch (err) {
             return null;
        } 
    }
    
};
exports.TransactionLogsService = TransactionLogsService