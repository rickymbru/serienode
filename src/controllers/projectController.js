const Project = require ('../models/project');
const Task = require ('../models/task');
module.exports = {
    async create(req, res){
        try {

            const { title, description, tasks } = req.body;

            const project = await Project.create( { title, description, user: req.userId });

            await Promise.all( tasks.map(async task =>{
                const projectTask = new Task({ ...task, project: project._id});

                await projectTask.save();

                project.tasks.push(projectTask);
               
            }));

            await project.save();

            return res.send({ project });

        } catch (err) {
            console.log(err);
            return res.status(400).send({ error: 'Error creating new project'});            
        }
    },

    async list (req, res){
        try {
            const projects = await Project.find().populate(['user', 'tasks']);
            
            return res.send({ projects });
        }catch (err) {
            console.log(err);
            return res.status(400).send({ error: 'Error loading projects'});  
        }
    },

    async show (req, res){
        try {
            const projects = await Project.findById(req.params.projectId).populate(['user', 'tasks']);
            
            return res.send({ projects });
        }catch (err) {
            console.log(err);
            return res.status(400).send({ error: 'Error loading project'});   
        }
    },

    async update (req, res){
        try {

            const { title, description, tasks } = req.body;

            const project = await Project.findByIdAndUpdate(req.params.projectId, { 
                title, 
                description
             } , { new: true });

            project.tasks = [];
            await Task.remove({ project: project._id });

            await Promise.all( tasks.map(async task =>{
                const projectTask = new Task({ ...task, project: project._id});

                await projectTask.save();

                project.tasks.push(projectTask);
               
            }));

            await project.save();

            return res.send({ project });

        } catch (err) {
            console.log(err);
            return res.status(400).send({ error: 'Error updating new project'});            
        }
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