'use strict';

const db = require("../database/entity");
const Share = db.shares;


class ShareRepository{
    constructor(){
    }

    async get() {
        const getShares = await Share.findAll();

        return getShares;
    }

    async create(share) {
        const newShare = await Share.create(share);

        return newShare;        
    }

    async delete(id) {
        const deleteShare = await Share.destroy({
            where: { id: id }
        });

        if(deleteShare === null) {
            return false;
        }

        return true;   
    }

    async getRegisteredShareCode(id, traderId, code) {
        const getShare = await Share.findAll({
            where: { 
                id: id ,
                traderId: traderId ,
                code: code 
            }
        });

        if(getShare === null) {
            return null;
        }

        return getShare[0];   
    }

    async getRegisteredShare(id) {
        const getShare = await Share.findByPk(id);

        if(getShare === null) {
            return null;
        }

        return getShare;   
    }

    async getRegisteredShareAmount(id) {
        const getShare = await Share.findAll({
            where: { 
                id: id
            }
        });

        if(getShare === null) {
            return null;
        }

        return getShare[0].registeredAmount;   
    }

    async updatePriceAndDate(id,price) {
        let updateInfo = {
            price: price
        };

        const updateShare = await Share.update(updateInfo, {
            where: { id: id }
        });

        if(updateShare === null) {
            return false;
        }

        return true;
    }

    async updateRegisteredShareAmount(id,amount) {
        const shareAmount = await this.getRegisteredShareAmount(id);
        const newAmount = shareAmount - amount;

        let updateInfo = {
            registeredAmount: newAmount
        };

        const updateShare = await Share.update(updateInfo, {
            where: { id: id }
        });

        if(updateShare === null) {
            return false;
        }
        
        return true;
    }
};
exports.ShareRepository = ShareRepository