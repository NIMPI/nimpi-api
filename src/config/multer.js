const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const storageTypes = {
  // Configurações de destino local
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
    },
    // Define um nome único para cada arquivo
    filename: (req, file, cb) => {
      crypto.randomBytes(8, (err, hash) => {
        if (err) cb(err);

        file.key = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, file.key);
      });
    }
}),
  // Configurações de destino externo
  s3: multerS3({
    s3: new aws.S3({
      accessKeyId: process.env.AWS_ACESS_KEY_ID,
      secretAcessKey: process.env.AWS_SECRET_ACESS_KEY,
      defaultRegion: process.env.AWS_DEFAULT_REGION
    }),
    bucket: process.env.BUCKET_NAME,
    // Torna o arquivo legível pelo navegador
    contentType: multerS3.AUTO_CONTENT_TYPE,
    // Permissão pública de leitura
    acl: 'public-read',
    // Define um nome único para cada arquivo
    key: (req, file, cb) => {
      crypto.randomBytes(8, (err, hash) => {
        if (err) cb(err);

        const fileName = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, fileName);
      });
    }
  })
};

// Configurações do multer
module.exports = {
  // Local de destino do upload
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  // Define se o armazenamento será local ou externo
  storage: storageTypes[process.env.STORAGE_TYPE],
  // Filtra o upload de arquivos
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',

      'video/avi',
      'video/x-msvideo',
      'video/mpeg',
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'video/3gpp',
      'video/3gpp2',

      'audio/aac',
      'audio/x-aac',
      'audio/mpeg',
      'audio/mpeg3',
      'audio/x-mpeg-3',
      'audio/ogg',
      'audio/3gpp',
      'audio/3gpp2',
      'audio/wav',
      'audio/x-wav',

      'application/pdf'
    ];
    
    // Verifica se o mimetype do arquivo está na lista acima
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
};
