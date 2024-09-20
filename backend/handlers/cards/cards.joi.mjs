import Joi from "joi";

export const CardCreate = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().valid('todo', 'in-progress', 'done').required(),
    priority: Joi.number().required(),
    createdBy: Joi.string().required(),
    assignedTo: Joi.string().required(),
    dueDate: Joi.date().required(),
});