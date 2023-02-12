'use strict';

const { ShareService } = require('../service/share.service')

class ShareController{
    constructor(){
    }

    async initDatabase(req, res){
        const shareService = new ShareService();
        const response = await shareService.initDatabase();
        
        if(response === false){
            return res.status(500).send(response);
        }
        return res.status(200).send(response);
    }

    async buyShare(req, res){
        const share = req.body;
        const shareService = new ShareService();
        const response = await shareService.buyShare(share);
        
        if(response === false){
            return res.status(500).send(response);
        }
        return res.status(200).send(response);
    }

    async sellShare(req, res){
        const share = req.body;
        const shareService = new ShareService();
        const response = await shareService.sellShare(share);
        
        if(response === false){
            return res.status(500).send(response);
        }
        return res.status(200).send(response);
    }

    async getShare(req, res){
        const shareService = new ShareService();
        const response = await shareService.getShare();
        
        if(response === false){
            return res.status(500).send(response);
        }
        return res.status(200).send(response);
    }

    async createShare(req, res){
        const share = req.body;
        const shareService = new ShareService();
        const response = await shareService.createShare(share);
        
        if(response === false){
            return res.status(500).send(response);
        }
        return res.status(200).send(response);
    }

    async registerShare(req, res){
        const share = req.body;
        const shareService = new ShareService();
        const response = await shareService.registerShare(share);
        
        if(response === false){
            return res.status(500).send(response);
        }
        return res.status(200).send(response);
    }

    async updatePriceRegisteredShare(req, res){
        const share = req.body;
        const shareService = new ShareService();
        const response = await shareService.updatePriceRegisteredShare(share);
        
        if(response === false){
            return res.status(500).send(response);
        }
        return res.status(200).send(response);
    }

    
};
exports.ShareController = ShareController