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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publisher'
    },
    type: {
        type: String
    },
    path: {
        type: String
    },
    dataCreated: {
        type: Date,
        default: Date.now()
    },
    lastModification: {
        type: Date,
        default: Date.now()
    },
    tags: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //required: true
    }
})

const Document = mongoose.model('Document', documentSchema, 'documents')
module.exports = Document
