const User = require ('../models/user');

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
            if (await User.findOne({email}))
                return res.status(400).send({error: 'User already exists'})

           const user = await User.create({ name, email, password, createdAt });

            user.password = undefined;

            return res.send({ user,
                token: generateToken({ id: user.id })  
            });
        } catch {
            res.status(400).send({ error: "Registration failed" });
        }
    },

    async index(req,res) {

        const { email, password} = req.body;

        try{
        const user = await User.findOne({ email }).select('+password');

        if(!await bcrypt.compare(password, user.password))
            return res.status(400).send({error: 'Invalid password'});
        
        user.password = undefined;

        return res.send({ 
            user, 
            token: generateToken({ id: user.id }) 
        });
        }catch (err){
            console.log(err);
            res.status(401).send({error: 'User not found'});            
        }
    },
     async forgot(req, res){
         const { email } = req.body;

         try {
            const user = await User.findOne({ email });
            
            if (!user){
                return res.status(400).send({ error: 'User not found'});                
            }

            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            await User.findByIdAndUpdate (user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now,
                }
            });           
            
            await mailer.sendMail({
                to: email,
                from: 'rickymbru@gmail.com',
                subject: "Redefinição de senha ✔", // Subject line
                text: `${user.name}, utilize este token para redefinir sua senha: ${token}`, // plain text body
                template: 'auth/forgot_password',
                context: {token: token, 
                    user: user.name},
            }, (err) => {
                return res.status(400).send({ error: 'Cannot send forgot send email'}); 
            });
            
            return res.status(200).send('Email are sent with sucess');            

         }catch (err) {
            return  res.status(400).send({ error: 'Erro on forgot password, try again'}); 
         }
     },

     async reset (req, res) {
         const { email, password, token} = req.body;

         try {
            const user = await User.findOne({ email })
                .select('+passwordResetToken passwordResetExpires');

                if (!user){
                    return res.status(400).send({ error: 'User not found'});                    
                }
                
                if (token != user.passwordResetToken) {
                    return res.status(401).send({ error: 'Token invalid'}); 
                }

                const now = new Date();

                if (now > user.passwordResetExpires)
                    return res.status(401).send({ error: 'Token expired, generate new one'}); 

                user.password = password;

                await user.save();

                res.send();

         } catch (err){
                return res.status(400).send("Its not possible reset your password, try again")
         }

     }
}