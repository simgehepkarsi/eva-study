'use strict';

const { TradersPortfoliosRepository } = require("../repository/tradersportfolios.repository");

class TradersPortfoliosService{
    constructor(){
    }

    async createtradersportfolios(tradersportfolios){
        const validateTradersPortfolios = this.validateTradersPortfolios(tradersportfolios);

        let res = {
            status: true,
            message: ""
        };

        if(validateTradersPortfolios.status === false){
            res.message = validateTradersPortfolios.message;
            res.status = false;

            return res;
        }
        
        const tradersPortfoliosRepository = new TradersPortfoliosRepository();
        const createres = await tradersPortfoliosRepository.create(tradersportfolios);
        if(createres === null){
            return null; 
        }

        return createres;
    }

    async gettradersportfolios(){

        const tradersPortfoliosRepository = new TradersPortfoliosRepository();
        const getres = await tradersPortfoliosRepository.get();

        if(getres === null){
            return null; 
        }

        return getres;
    }

    validateTradersPortfolios(tradersportfolios){
        try {
             let res = {
                 status: true,
                 message: "Ok."
             };

             if(isNaN(tradersportfolios.traderId) || (!tradersportfolios.shareName) || (!tradersportfolios.shareCode) || isNaN(tradersportfolios.shareAmount)|| isNaN(tradersportfolios.shareBlockedAmount)){
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
exports.TradersPortfoliosService = TradersPortfoliosService