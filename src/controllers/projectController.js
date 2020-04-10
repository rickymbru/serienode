module.exports = {
    async create(req, res){
        res.send({ok: true, user: req.userId });
    }
}