'use strict';

const db = require("../database/entity");
const Trader = db.traders;

class TraderRepository{
    constructor(){
    }

    async create(trader) {
        const newTrader = await Trader.create(trader);

        return newTrader;
    }

    async get() {
        const getTrader = await Trader.findAll();

        return getTrader;
    }

    async getTraderBalance(traderId) {
        const getTrader = await Trader.findAll({ where: { id: traderId } });
        let balance = 0;

        if(getTrader === null) {
            return balance;
        }

        balance = getTrader[0].balance;

        return balance;
     }

    async getTraderBalances(traderId) {
        let res = {
            Balance: 0,
            BlockedBalance: 0
        };

        const getTrader = await Trader.findAll({ where: { id: traderId } });

        if (getTrader === null) {
            return res;
        }

        res.Balance = getTrader[0].balance;
        res.BlockedBalance = getTrader[0].blockedBalance;

        return res;
    }

    async updateTradersBalanceForRegisterShare(traderId,amount) {
        const balanceResult = await this.getTraderBalances(traderId);
        const newBalance = Number(balanceResult.Balance) - Number(amount);
        const newBlockedBalance = Number(balanceResult.BlockedBalance) + Number(amount);

        let updateInfo = {
            balance: newBalance,
            blockedBalance: newBlockedBalance
        };

        const updateTrader = await Trader.update(updateInfo, {
            where: { id: traderId }
        });

        if(updateTrader === null) {
            return false;
        }

        return true;
    }

    async updateTradersBalancesForBuyTrade(buyerTraderId, sellerTraderId, amount) {

        const balanceResultBuyer = await this.getTraderBalances(buyerTraderId);
        const newBalanceBuyer = Number(balanceResultBuyer.Balance) - Number(amount);

        let updateBuyerInfo = {
            balance: newBalanceBuyer
        };

        const updateBuyer = await Trader.update(updateBuyerInfo, {
            where: { id: buyerTraderId }
        });

        if(updateBuyer === null) {
            return false;
        }

        const balanceResultSeller = await this.getTraderBalances(sellerTraderId);
        const newBalanceSeller = Number(balanceResultSeller.Balance) + Number(amount);

        let updateSellerInfo = {
            balance: newBalanceSeller
        };

        const updateSeller = await Trader.update(updateSellerInfo, {
            where: { id: sellerTraderId }
        });

        if(updateSeller === null) {
            return false;
        }

        return true;
    }

    async updateTradersBalancesForSellTrade(sellerTraderId, buyerTraderId, amount) {
        const balanceResultSeller = await this.getTraderBalances(sellerTraderId);
        const newBalanceSeller = Number(balanceResultSeller.Balance) + Number(amount);

        let updateSellerInfo = {
            balance: newBalanceSeller
        };

        const updateSeller = await Trader.update(updateSellerInfo, {
            where: { id: sellerTraderId }
        });

        if(updateSeller === null) {
            return false;
        }

        const balanceResultBuyer = await this.getTraderBalances(buyerTraderId);
        const newBlockedBalanceBuyer = Number(balanceResultBuyer.BlockedBalance) - Number(amount);

        let updateBuyerInfo = {
            blockedBalance: newBlockedBalanceBuyer
        };

        const updateBuyer = await Trader.update(updateBuyerInfo, {
            where: { id: buyerTraderId }
        });

        if(updateBuyer === null) {
            return false;
        }

        return true;
    }
};
exports.TraderRepository = TraderRepository