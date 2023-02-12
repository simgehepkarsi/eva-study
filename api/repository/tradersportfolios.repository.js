'use strict';

const db = require("../database/entity");
const TradersPortfolios = db.tradersportfolios;

class TradersPortfoliosRepository{
    constructor(){
    }

    async create(tradersportfolios) {
        const newTradersPortfolios = await TradersPortfolios.create(tradersportfolios);

        return newTradersPortfolios;
    }

    async get() {
        const getTradersPortfolios = await TradersPortfolios.findAll();

        return getTradersPortfolios;
    }

    async checkTraderPortfolio(id, code){
        const getTradersPortfolios = await TradersPortfolios.findAll({ 
            where: { 
                traderId: id,  
                shareCode: code
            } 
        });

        if(getTradersPortfolios === null) {
            return false;
        }

        return true;
    }

    async getPortfiliosShareAmount(traderId, shareCode) {
        const getTradersPortfolios = await TradersPortfolios.findAll({ 
            where: { 
                traderId: traderId,  
                shareCode: shareCode
            } 
        });
        
        let shareAmount = 0;

        if(getTradersPortfolios === null) {
            return shareAmount;
        }

        shareAmount = getTradersPortfolios[0].shareAmount;

        return shareAmount;
    }

    async getPortfiliosShareAmounts(traderId, shareCode) {
        const getTradersPortfolios = await TradersPortfolios.findAll({ 
            where: { 
                traderId: traderId,  
                shareCode: shareCode
            },
            attributes: ['id', 'shareAmount','shareBlockedAmount']
        });
        
        if(getTradersPortfolios === null) {
            return null;
        }

        return getTradersPortfolios[0];
    }

    async updateTradersPortfolioForRegisterShare(traderId, shareCode, amount) {
        const amountResult = await this.getPortfiliosShareAmounts(traderId, shareCode);
        const newAmount = Number(amountResult.shareAmount) - Number(amount);
        const newBlockedAmount = Number(amountResult.shareBlockedAmount) + Number(amount);

        let updateInfo = {
            shareAmount: newAmount,
            shareBlockedAmount: newBlockedAmount
        };

        const updateTradersPortfolios = await TradersPortfolios.update(updateInfo, {
            where: { id: amountResult.id }
        });

        if(updateTradersPortfolios === null) {
            return false;
        }

        return true;
    }
    
    async updateTradersPortfoliosForBuyTrade(buyerTraderId, sellerTraderId, shareCode, amount) {
        const amountResultBuyer = await this.getPortfiliosShareAmount(buyerTraderId, shareCode);
        const newAmountBuyer = Number(amountResultBuyer) + Number(amount);

        let updateInfo = {
            shareAmount: newAmountBuyer
        };

        const updateTradersPortfolios = await TradersPortfolios.update(updateInfo, {
            where: { 
                traderId: buyerTraderId,
                shareCode: shareCode
            }
        });

        if(updateTradersPortfolios === null) {
            return false;
        }

        const amountResultSeller = await this.getPortfiliosShareAmounts(sellerTraderId, shareCode);
        const newAmountSeller = Number(amountResultSeller.shareBlockedAmount) - Number(amount);

        let updateInfoSeller = {
            shareBlockedAmount: newAmountSeller
        };

        const updateTradersPortfoliosSeller = await TradersPortfolios.update(updateInfoSeller, {
            where: { 
                traderId: sellerTraderId,
                shareCode: shareCode
            }
        });

        if(updateTradersPortfoliosSeller === null) {
            return false;
        }

        return true;
    }

    async updateTradersPortfoliosForSellTrade(sellerTraderId, buyerTraderId, shareCode, amount) {
        const amountResultSeller = await this.getPortfiliosShareAmount(sellerTraderId, shareCode);
        const newAmountSeller = Number(amountResultSeller) - Number(amount);

        let updateInfo = {
            shareAmount: newAmountSeller
        };

        const updateTradersPortfolios = await TradersPortfolios.update(updateInfo, {
            where: { 
                traderId: sellerTraderId,
                shareCode: shareCode
            }
        });

        if(updateTradersPortfolios === null) {
            return false;
        }

        const amountResultBuyer = await this.getPortfiliosShareAmount(buyerTraderId, shareCode);
        const newAmountBuyer = Number(amountResultBuyer) + Number(amount);

        let updateInfoBuyer = {
            shareAmount: newAmountBuyer
        };

        const updateTradersPortfoliosBuyer = await TradersPortfolios.update(updateInfoBuyer, {
            where: { 
                traderId: buyerTraderId,
                shareCode: shareCode
            }
        });

        if(updateTradersPortfoliosBuyer === null) {
            return false;
        }

        return true;
    }
};
exports.TradersPortfoliosRepository = TradersPortfoliosRepository