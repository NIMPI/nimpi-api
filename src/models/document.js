const mongoose = require('../database/connection')

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date
    },
    year: {
        type: Number
    },
    publisherId: {
        type: Number
    },
    type: {
        type: String
    },
    path: {
        type: String
    },
    dataCreated: {
        type: Date,
        required: true
    },
    lastModification: {
        type: Date,
        default: Date.now()
    },
    tags: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
})

const Document = mongoose.model('Document', documentSchema, 'documents')
module.exports = Document
