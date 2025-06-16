const express = require('express');
const multer = require('multer');
const path = require('path');
const fiscalizacaoController = require('../controllers/fiscalizacaoController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/fiscalizacoes/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Criar uma nova fiscalização
router.post('/', upload.single('foto'), fiscalizacaoController.createFiscalizacao);

// Listar todas as fiscalizações
router.get('/', fiscalizacaoController.getFiscalizacoes);

// Buscar fiscalização por ID
router.get('/:id', fiscalizacaoController.getFiscalizacaoById);

// Atualizar fiscalização
router.put('/:id', upload.single('foto'), fiscalizacaoController.updateFiscalizacao);

// Deletar fiscalização
router.delete('/:id', fiscalizacaoController.deleteFiscalizacao);

// Listar fiscalizações de uma obra específica
router.get('/obra/:obraId', fiscalizacaoController.getFiscalizacoesByObra);

module.exports = router;
// Listar todas as fiscalizações
router.get('/', async (req, res) => {
  try {
    const fiscalizacoes = await Fiscalizacao.find().populate('obra');
    res.json(fiscalizacoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar fiscalizações de uma obra específica
router.get('/obra/:obraId', async (req, res) => {
  try {
    const fiscalizacoes = await Fiscalizacao.find({ obra: req.params.obraId });
    res.json(fiscalizacoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar fiscalização por ID
router.get('/:id', async (req, res) => {
  try {
    const fiscalizacao = await Fiscalizacao.findById(req.params.id).populate('obra');
    if (!fiscalizacao) return res.status(404).json({ error: 'Fiscalização não encontrada' });
    res.json(fiscalizacao);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar fiscalização
router.put('/:id', upload.single('foto'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.body.localizacao) {
      updateData.localizacao = JSON.parse(req.body.localizacao);
    }
    if (req.file) {
      updateData.foto = req.file.path;
    }
    const fiscalizacao = await Fiscalizacao.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!fiscalizacao) return res.status(404).json({ error: 'Fiscalização não encontrada' });
    res.json(fiscalizacao);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar fiscalização
router.delete('/:id', async (req, res) => {
  try {
    const fiscalizacao = await Fiscalizacao.findByIdAndDelete(req.params.id);
    if (!fiscalizacao) return res.status(404).json({ error: 'Fiscalização não encontrada' });
    res.json({ message: 'Fiscalização removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
