'use strict';

const { TraderRepository } = require("../repository/trader.repository");

class TraderService{
    constructor(){
    }

    async createtrader(trader){
        const validateCreateTrader = this.validateCreateTrader(trader);

        let res = {
            status: true,
            message: ""
        };

        if(validateCreateTrader.status === false){
            res.message = validateCreateTrader.message;
            res.status = false;

            return res;
        }
        
        const traderRepository = new TraderRepository();
        const createres = await traderRepository.create(trader);

        if(createres === null){
            return null; 
        }
        return createres;
    }

    async gettraders(){
        const traderRepository = new TraderRepository();
        const getres = await traderRepository.get();

        if(getres === null){
            return null; 
        }
        return getres;
    }

    validateCreateTrader(trader){
        try {
             let res = {
                 status: true,
                 message: "Ok."
             };

             if((!trader.name) || (!trader.email) || (!trader.password) || isNaN(trader.balance)|| isNaN(trader.blockedBalance)){
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
exports.TraderService = TraderService