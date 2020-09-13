const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const s3 = new aws.S3();

// Schema de documentos
const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    //required: true
  },
  description: {
    type: String,
    //required: true
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
  dateCreated: {
    type: Date
  },
  lastModification: {
    type: Date,
    default: Date.now()
  },
  tags: [
    String
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    //required: true
  },
  key: {
    type: String
  },
  articles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }],
size: {
  type: Number
}
});

// Preenche a url antes de salvar
documentSchema.pre('save', function() {
  if (!this.path) {
    this.path = `${process.env.APP_URL}/files/${this.key}`;
  }
});

// Antes de remover no banco de dados
documentSchema.pre('remove', function() {
  // Deleta o arquivo no AWS
  if (process.env.STORAGE_TYPE === 's3') {
    return s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: this.key
      })
      .promise()
      .then(response => {
        console.log(response.status);
      })
      .catch(response => {
        console.log(response.status);
      });
  // Deleta o arquivo local
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key)
    );
  }
});

documentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Document", documentSchema);
