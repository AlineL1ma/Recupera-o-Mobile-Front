const express = require('express');
const multer = require('multer');
const path = require('path');
const obraController = require('../controllers/obraController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/obras/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Criar uma nova obra
router.post('/', upload.single('foto'), obraController.createObra);

// Listar todas as obras
router.get('/', obraController.getObras);

// Buscar obra por ID
router.get('/:id', obraController.getObraById);

// Atualizar obra
router.put('/:id', upload.single('foto'), obraController.updateObra);

// Deletar obra
router.delete('/:id', obraController.deleteObra);

// Detalhes da obra com lista de fiscalizações
router.get('/:id/detalhes', obraController.getObraDetalhes);

// Enviar dados da obra e fiscalizações por e-mail
router.post('/:id/enviar-email', obraController.enviarObraPorEmail);

module.exports = router;