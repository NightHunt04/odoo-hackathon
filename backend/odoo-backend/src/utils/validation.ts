import Joi from 'joi'

export function validateCreateQuestion(body: any) {
    const schema = Joi.object({
        title: Joi.string().required().max(100),
        description: Joi.object().required(),
        tags: Joi.array().items(Joi.string()).required()
    })

    return schema.validate(body)
}

export function validateCreateAnswer(body: any) {
    const schema = Joi.object({
        content: Joi.object().required(),
        questionId: Joi.string().required()
    })

    return schema.validate(body)
}