const Fiscalizacao = require('../models/Fiscalizacao');

exports.createFiscalizacao = async (req, res) => {
  try {
    const { data, statusObra, observacoes, localizacao, obra } = req.body;
    const fiscalizacao = new Fiscalizacao({
      data,
      statusObra,
      observacoes,
      localizacao: JSON.parse(localizacao),
      obra,
      foto: req.file ? req.file.path : undefined
    });
    await fiscalizacao.save();
    res.status(201).json(fiscalizacao);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getFiscalizacoes = async (req, res) => {
  try {
    const fiscalizacoes = await Fiscalizacao.find().populate('obra');
    res.json(fiscalizacoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFiscalizacaoById = async (req, res) => {
  try {
    const fiscalizacao = await Fiscalizacao.findById(req.params.id).populate('obra');
    if (!fiscalizacao) return res.status(404).json({ error: 'Fiscalização não encontrada' });
    res.json(fiscalizacao);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFiscalizacao = async (req, res) => {
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
};

exports.deleteFiscalizacao = async (req, res) => {
  try {
    const fiscalizacao = await Fiscalizacao.findByIdAndDelete(req.params.id);
    if (!fiscalizacao) return res.status(404).json({ error: 'Fiscalização não encontrada' });
    res.json({ message: 'Fiscalização removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFiscalizacoesByObra = async (req, res) => {
  try {
    const fiscalizacoes = await Fiscalizacao.find({ obra: req.params.obraId });
    res.json(fiscalizacoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
