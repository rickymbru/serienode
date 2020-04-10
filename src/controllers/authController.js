const user = require ('../models/user');

const bcrypt = require ('bcryptjs');

const jwt = require ('jsonwebtoken');

const authConfig = require('../config/auth.json');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

module.exports = {
    async create(req,res) {

        const { name, email, password, createdAt} = req.body;

        try {
            if (await user.findOne({email}))
                return res.status(400).send({error: 'User already exists'})

           const resUser = await user.create({ name, email, password, createdAt });

            resUser.password = undefined;

            return res.send({ resUser,
                token: generateToken({ id: resUser.id })  
            });
        } catch {
            res.status(400).send({ error: "Registration failed" });
        }
    },

    async index(req,res) {

        const { email, password} = req.body;

        try{
        const resUser = await user.findOne({ email }).select('+password');
        
        if(!await bcrypt.compare(password, resUser.password))
            return res.status(400).send({error: 'Invalid password'});
        
        resUser.password = undefined;

        return res.send({ 
            resUser, 
            token: generateToken({ id: resUser.id }) 
        });
        }catch (err){
            res.status(401).send({error: 'User not found'});            
        }
    }
}