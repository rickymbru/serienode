const user = require ('../models/user');

const bcrypt = require ('bcryptjs');

const jwt = require ('jsonwebtoken');

const authConfig = require('../config/auth.json');

const crypto = require ('crypto');

const mailer = require ('../modules/mailer');

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
    },
     async forgot(req, res){
         const { email } = req.body;

         try {
            const resUser = await user.findOne({ email });

            if (!resUser){
                res.status(400).send({ error: 'User not found'});
                return
            }

            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            await user.findByIdAndUpdate (user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now,
                }
            });           
            
            mailer.sendMail({
                to: email,
                from: 'rickymbru@gmail.com',
                template: 'auth/forget_password',
                context: {token},
            }, (err) => {
                //res.status(400).send({ error: 'Cannot send forgot send email'}); 
                //return
            });
            console.log(token, now); 

            return res.send('OK');            

         }catch (err) {
            // console.log(err);
            return  res.status(400).send({ error: 'Erro on forgot password, try again'}); 
         }
     }
}