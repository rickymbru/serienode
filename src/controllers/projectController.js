const Project = require ('../models/project');
module.exports = {
    async create(req, res){
        try {
            const project = await Project.create( { ...req.body, user: req.userId });

            return res.send({ project });

        } catch (err) {
            console.log(err);
            return res.status(400).send({ error: 'Error creating new project'});            
        }
    },

    async list (req, res){
        try {
            const projects = await Project.find().populate('user');
            
            return res.send({ projects });
        }catch (err) {
            console.log(err);
            return res.status(400).send({ error: 'Error loading projects'});   
        }
    },

    async show (req, res){
        try {
            const projects = await Project.findById(req.params.projectId).populate('user');
            
            return res.send({ projects });
        }catch (err) {
            console.log(err);
            return res.status(400).send({ error: 'Error loading project'});   
        }
    },

    async update (req, res){
        res.send({user: req.userId });
    },

    async delete (req, res){
        try {
            const projects = await Project.findByIdAndDelete(req.params.projectId);
            
            return res.send();
        }catch (err) {
            console.log(err);
            return res.status(400).send({ error: 'Error deleting projects'});   
        }
    },
}