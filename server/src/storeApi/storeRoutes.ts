import express = require('express');
import {Request} from "../../types/moongooseArray";
import {StoresApi} from "./storesApi";
import {verifyToken} from "../jwt";
import * as Constants from "../consts";
import {ERR_GENERAL_MSG} from "../consts";
import { usersApiRouter } from "../usersApi/userRoutes";
import { mockSaleRules, mockPurchaseRules, updateIds, deletePurchaseRuleMock, updateSaleIds, findSaleRelevantProduct, findRuleRelevantProduct, deleteSaleRuleMock } from './mockRules';
import { addToSystemFailierLogger } from '../utils/addToLogger';

export const storesApiRouter = express.Router();

const storesApi = new StoresApi();

storesApiRouter.post('/storesApi/addStore', addStore);

async function addStore(req: Request, res: express.Response) {
    try {
        const user = req.session.user;
        if (!user) {
            res.send({status: Constants.BAD_ACCESS_NO_VISITORS, err: Constants.ERR_Access_MSG});
            return;
        }
        const storeName = req.body.storeName;
        if (!storeName)
            res.send({status: Constants.MISSING_PARAMETERS, err: Constants.ERR_PARAMS_MSG});
        else {
            const response = await storesApi.addStore(user.id, storeName);
            res.send(response);
        }
    }
    catch (err) {
        addToSystemFailierLogger(" addStore from routes  ");
        res.send({status: Constants.BAD_REQUEST});
    }
}


storesApiRouter.post('/storesApi/disableStore', disableStore);

async function disableStore(req: Request, res: express.Response) {
    try {
        const user = req.session.user;
        if (!user) {
            res.send({status: Constants.BAD_ACCESS_NO_VISITORS, err: Constants.ERR_Access_MSG});
            return;
        }
        const storeId = req.body.storeId;

        if (!storeId)
            throw Error(ERR_GENERAL_MSG);

        const response = await storesApi.disableStore(user.id, storeId);
        res.send(response);
    }
    catch (err) {
        addToSystemFailierLogger(" disableStore from routes  ");
        res.send({status: Constants.BAD_REQUEST});
    }
}

storesApiRouter.post('/storesApi/closeStore', closeStore);

async function closeStore(req: Request, res: express.Response) {
    try {
        const user = req.session.user;
        if (!user) {
            res.send({status: Constants.BAD_ACCESS_NO_VISITORS, err: Constants.ERR_Access_MSG});
            return;
        }
        const storeId = req.body.storeId;

        if (!storeId)
            throw Error(ERR_GENERAL_MSG);

        const response = await storesApi.closeStore(user.id, storeId);
        res.send(response);
    }
    catch (err) {
        addToSystemFailierLogger(" closeStore from routes  ");

        res.send({status: Constants.BAD_REQUEST});
    }
}

storesApiRouter.post('/storesApi/getWorkers', getWorkers);

async function getWorkers(req: Request, res: express.Response) {
    try {
        const user = req.session.user;
        if (!user) {
            res.send({status: Constants.BAD_ACCESS_NO_VISITORS, err: Constants.ERR_Access_MSG});
            return;
        }
        const storeId = req.body.storeId;

        if (!storeId)
            throw Error(ERR_GENERAL_MSG);

        const response = await storesApi.getWorkers(user.id, storeId);
        res.send(response);
    }
    catch (err) {
        addToSystemFailierLogger(" get workers from routes  ");
        res.send({status: Constants.BAD_REQUEST});
    }
}

storesApiRouter.post('/storesApi/addReview', addReview);

async function addReview(req: Request, res: express.Response) {
    try {
        const user = req.session.user;
        if (!user) {
            res.send({status: Constants.BAD_ACCESS_NO_VISITORS, err: Constants.ERR_Access_MSG});
            return;
        }
        const storeId = req.body.storeId;
        const rank = req.body.rank;
        const comment = req.body.comment;

        if (!storeId)
            throw Error(ERR_GENERAL_MSG);
        if (!rank || !storeId)
            res.send({status: Constants.MISSING_PARAMETERS, err: Constants.ERR_PARAMS_MSG});
        else {
            const response = await storesApi.addReview(user.id, storeId, rank, comment);
            res.send(response);
        }
    }
    catch (err) {
        addToSystemFailierLogger(" add review from routes  ");
        res.send({status: Constants.BAD_REQUEST});
    }
}


storesApiRouter.post('/storesApi/getStoreMessages', getStoreMessages);

async function getStoreMessages(req: Request, res: express.Response) {
    try {
        const user = req.session.user;
        if (!user) {
            res.send({status: Constants.BAD_ACCESS_NO_VISITORS, err: Constants.ERR_Access_MSG});
            return;
        }
        const storeId = req.body.storeId;

        if (!storeId)
            throw Error(ERR_GENERAL_MSG);

        const response = await storesApi.getStoreMessages(user.id, storeId);
        res.send(response);
    }
    catch (err) {
        addToSystemFailierLogger(" get store messages from routes  ");
        res.send({status: Constants.BAD_REQUEST});
    }
}


storesApiRouter.post('/storesApi/getStore', getStore);

async function getStore(req: Request, res: express.Response) {
    try {
        //todo check who uses this function store manager or visitor
        const user = req.session.user;
        if (!user) {
            res.send({status: Constants.BAD_ACCESS_NO_VISITORS, err: Constants.ERR_Access_MSG});
            return;
        }
        const storeName = req.body.storeName;
        if (!storeName)
            res.send({status: Constants.MISSING_PARAMETERS, err: Constants.ERR_PARAMS_MSG});
        else {
            const response = await storesApi.getStore(storeName);
            req.body.storeId = response.store? response.store.id: null;
            res.send(response);
        }
    }
    catch (err) {
        addToSystemFailierLogger(" get store from routes  ");
        res.send({status: Constants.BAD_REQUEST});
    }
}


usersApiRouter.post('/storesApi/sendMessage', sendMessage);

async function sendMessage(req: Request, res: express.Response) {
    try {
        const user = req.session.user;
        if (!user) {
            res.send({status: Constants.BAD_ACCESS_NO_VISITORS, err: Constants.ERR_Access_MSG});
            return;
        }
        const title = req.body.title;
        const body = req.body.body;
        const toName = req.body.toName;
        const storeId = req.body.storeId;

        if (!storeId)
            throw Error(ERR_GENERAL_MSG);

        if (!title || !body || !toName)
            res.send({status: Constants.MISSING_PARAMETERS, err: Constants.ERR_PARAMS_MSG});

        const response = await storesApi.sendMessage(user.id, storeId, title, body, toName);
        res.send(response);
    }
    catch (err) {
        addToSystemFailierLogger(" send message from routes  ");
        res.send({status: Constants.BAD_REQUEST});
    }
}

usersApiRouter.post('/storesApi/:storeId/purchaseRules', purchaseRules);

async function purchaseRules(req: Request, res: express.Response) {
    try {
        // const user = req.session.user;
        // if (!user) {
        //     res.send({status: Constants.BAD_ACCESS_NO_VISITORS, err: Constants.ERR_Access_MSG});
        //     return;
        // }
        // const title = req.body.title;
        // const body = req.body.body;
        // const toName = req.body.toName;
        // const storeId = req.body.storeId;

        // if (!storeId)
        //     throw Error(ERR_GENERAL_MSG);

        // if (!title || !body || !toName)
        //     res.send({status: Constants.MISSING_PARAMETERS, err: Constants.ERR_PARAMS_MSG});
        const purchaseRules = req.body.product? findRuleRelevantProduct(req.body.product): mockPurchaseRules;
        const response = {status: Constants.OK_STATUS, purchaseRules};
        res.send(response);
    }
    catch (err) {
        addToSystemFailierLogger(" purchase rules from routes  ");
        res.send({status: Constants.BAD_REQUEST});
    }
}


usersApiRouter.post('/storesApi/:storeId/saleRules', saleRules);

async function saleRules(req: Request, res: express.Response) {
    try {
        // const user = req.session.user;
        // if (!user) {
        //     res.send({status: Constants.BAD_ACCESS_NO_VISITORS, err: Constants.ERR_Access_MSG});
        //     return;
        // }
        // const title = req.body.title;
        // const body = req.body.body;
        // const toName = req.body.toName;
        // const storeId = req.body.storeId;

        // if (!storeId)
        //     throw Error(ERR_GENERAL_MSG);

        // if (!title || !body || !toName)
        //     res.send({status: Constants.MISSING_PARAMETERS, err: Constants.ERR_PARAMS_MSG});
        const saleRules = req.body.product? findSaleRelevantProduct(req.body.product): mockSaleRules;
        const response = {status: Constants.OK_STATUS, saleRules};
        res.send(response);
    }
    catch (err) {
        addToSystemFailierLogger(" sales rules from routes  ");
        res.send({status: Constants.BAD_REQUEST});
    }
}



usersApiRouter.post('/storesApi/:storeId/addPurchaseRule', addPurchaseRule);

async function addPurchaseRule(req: Request, res: express.Response) {
    try {
        // const user = req.session.user;
        // if (!user) {
        //     res.send({status: Constants.BAD_ACCESS_NO_VISITORS, err: Constants.ERR_Access_MSG});
        //     return;
        // }
        // const title = req.body.title;
        // const body = req.body.body;
        // const toName = req.body.toName;
        // const storeId = req.body.storeId;

        // if (!storeId)
        //     throw Error(ERR_GENERAL_MSG);

        // if (!title || !body || !toName)
        //     res.send({status: Constants.MISSING_PARAMETERS, err: Constants.ERR_PARAMS_MSG});
        updateIds(req.body.rule);//for mock
        mockPurchaseRules.push(req.body.rule);
        const response = {status: Constants.OK_STATUS};
        res.send(response);
    }
    catch (err) {
        addToSystemFailierLogger(" add purchase rules from routes  ");
        res.send({status: Constants.BAD_REQUEST});
    }
}


usersApiRouter.post('/storesApi/:storeId/addSaleRule', addSaleRule);

async function addSaleRule(req: Request, res: express.Response) {
    try {
        // const user = req.session.user;
        // if (!user) {
        //     res.send({status: Constants.BAD_ACCESS_NO_VISITORS, err: Constants.ERR_Access_MSG});
        //     return;
        // }
        // const title = req.body.title;
        // const body = req.body.body;
        // const toName = req.body.toName;
        // const storeId = req.body.storeId;

        // if (!storeId)
        //     throw Error(ERR_GENERAL_MSG);

        // if (!title || !body || !toName)
        //     res.send({status: Constants.MISSING_PARAMETERS, err: Constants.ERR_PARAMS_MSG});
        updateSaleIds(req.body.rule);//for mock
        mockSaleRules.push(req.body.rule);
        const response = {status: Constants.OK_STATUS};
        res.send(response);
    }
    catch (err) {
        addToSystemFailierLogger(" add sale rule from routes  ");
        res.send({status: Constants.BAD_REQUEST});
    }
}



usersApiRouter.post('/storesApi/:storeId/purchaseRules/:ruleId/delete', deletePurchaseRule);

async function deletePurchaseRule(req: Request, res: express.Response) {
    try {
        // const user = req.session.user;
        // if (!user) {
        //     res.send({status: Constants.BAD_ACCESS_NO_VISITORS, err: Constants.ERR_Access_MSG});
        //     return;
        // }
        // const title = req.body.title;
        // const body = req.body.body;
        // const toName = req.body.toName;
        // const storeId = req.body.storeId;

        // if (!storeId)
        //     throw Error(ERR_GENERAL_MSG);

        // if (!title || !body || !toName)
        //     res.send({status: Constants.MISSING_PARAMETERS, err: Constants.ERR_PARAMS_MSG});
        deletePurchaseRuleMock(req.params.ruleId);
        const response = {status: Constants.OK_STATUS};
        res.send(response);
    }
    catch (err) {
        addToSystemFailierLogger(" delete purchase rule from routes  ");
        res.send({status: Constants.BAD_REQUEST});
    }
}

usersApiRouter.post('/storesApi/:storeId/saleRules/:ruleId/delete', deleteSaleRule);

async function deleteSaleRule(req: Request, res: express.Response) {
    try {
        // const user = req.session.user;
        // if (!user) {
        //     res.send({status: Constants.BAD_ACCESS_NO_VISITORS, err: Constants.ERR_Access_MSG});
        //     return;
        // }
        // const title = req.body.title;
        // const body = req.body.body;
        // const toName = req.body.toName;
        // const storeId = req.body.storeId;

        // if (!storeId)
        //     throw Error(ERR_GENERAL_MSG);

        // if (!title || !body || !toName)
        //     res.send({status: Constants.MISSING_PARAMETERS, err: Constants.ERR_PARAMS_MSG});
        deleteSaleRuleMock(req.params.ruleId);
        const response = {status: Constants.OK_STATUS};
        res.send(response);
    }
    catch (err) {
        addToSystemFailierLogger(" delete sale rule from routes  ");

        res.send({status: Constants.BAD_REQUEST});
    }
}

