const aiService = require("../services/ai.service.js");

module.exports.getReview = async(req,res)=>{
    const code = req.body.code;
    if(!code){
        return res.status(400).send("Oops! Prompt is required.");
    }
    const response = await aiService(code);

    res.send(response);
}