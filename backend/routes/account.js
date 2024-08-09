const express = require('express');
const { Account, User } = require('../db');
const { authMiddleware } = require('../middleware');
const router  = express.Router();
router.get("/balance",authMiddleware,async (req,res) => { 
    const account = Account.findOne({
        userId:req.userId
    });
    return res.json({
        balance:account.balance
    });
});

router.put("/transfer", authMiddleware, async (req,res ) => {
    const {amount , to } = req.body;
    const account = await Account.findOne({
        userId:req.userId
    });
    if(account.balance < amount){
        return res.status(400).json({
            message:"Insufficient Balance",
        });
    }
    const toAccount = await Account.findOne({
        userId:to
    });
    if(!toAccount){
        return res.status(400).json({
            message:"User not Found"
        });
    }
    await account.updateOne({
        userId:req.userId
    },{
        $inc:{
            balance:-amount,
        }
    });
    await toAccount.updateOne({
        userId:to
    },{
        $inc:{
            balance: amount, 
        }
    });
    res.json({
        message:"Transfer Successfully"
    });
});
module.exports= router;