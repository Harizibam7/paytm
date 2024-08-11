const express = require('express');
const { Account, User } = require('../db');
const { authMiddleware } = require('../middleware');
const { default: mongoose } = require('mongoose');
const router  = express.Router();
router.get("/balance",authMiddleware,async (req,res) => { 
    const account = Account.findOne({
        userId:req.userId
    });
    return res.json({
        balance:account.balance
    });
});

// router.put("/transfer", authMiddleware, async (req,res ) => {
//     const {amount , to } = req.body;
//     const account = await Account.findOne({
//         userId:req.userId
//     });
//     if(account.balance < amount){
//         return res.status(400).json({
//             message:"Insufficient Balance",
//         });
//     }
//     const toAccount = await Account.findOne({
//         userId:to
//     });
//     if(!toAccount){
//         return res.status(400).json({
//             message:"User not Found"
//         });
//     }
//     await account.updateOne({
//         userId:req.userId
//     },{
//         $inc:{
//             balance:-amount,
//         }
//     });
//     await toAccount.updateOne({
//         userId:to
//     },{
//         $inc:{
//             balance: amount, 
//         }
//     });
//     res.json({
//         message:"Transfer Successfully"
//     });
// });

router.post("/transfer",authMiddleware,async(req, res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    const {amount, to } = req.body;
    const account= await Account.findOne({userId: req.userId}).session(session);
    if(!account || account.balance < amount){
        session.abortTransaction();
        return res.status(400).json({
            message:"Insufficient amount"
        });
    }
    // router.put("/transfer", authMiddleware, async (req,res ) => {
    //     const {amount , to } = req.body;
    //     const account = await Account.findOne({
    //         userId:req.userId
    //     });
    //     if(account.balance < amount){
    //         return res.status(400).json({
    //             message:"Insufficient Balance",
    //         });
    //     }
    //     const toAccount = await Account.findOne({
    //         userId:to
    //     });
    //     if(!toAccount){
    //         return res.status(400).json({
    //             message:"User not Found"
    //         });
    //     }
    //     await account.updateOne({
    //         userId:req.userId
    //     },{
    //         $inc:{
    //             balance:-amount,
    //         }
    //     });
    //     await toAccount.updateOne({
    //         userId:to
    //     },{
    //         $inc:{
    //             balance: amount, 
    //         }
    //     });
    //     res.json({
    //         message:"Transfer Successfully"
    //     });
    // });
    const toAccount = await Account.findOne({userId:to}).session(session);
    if(!toAccount){
        session.abortTransaction();
        return res.status(400).json({
            message:"User not found",
        });
    }
    Account.updateOne({userId:req.userId},{ $inc:{ balance:-amount } }).session(session);
    Account.updateOne({userId:to},{$inc:{balance:amount}}).session(session);
    session.commitTransaction();
    res.json({
        message:"Transfer Successfully"
    });
});

module.exports= router;