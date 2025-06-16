const Obra = require('../models/Obra');
const Fiscalizacao = require('../models/Fiscalizacao');
const nodemailer = require('nodemailer');

exports.createObra = async (req, res) => {
  try {
    const { nome, responsavel, dataInicio, previsaoTermino, localizacao, descricao } = req.body;
    const obra = new Obra({
      nome,
      responsavel,
      dataInicio,
      previsaoTermino,
      localizacao: JSON.parse(localizacao),
      descricao,
      foto: req.file ? req.file.path : undefined
    });
    await obra.save();
    res.status(201).json(obra);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getObras = async (req, res) => {
  try {
    const obras = await Obra.find();
    res.json(obras);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getObraById = async (req, res) => {
  try {
    const obra = await Obra.findById(req.params.id);
    if (!obra) return res.status(404).json({ error: 'Obra não encontrada' });
    res.json(obra);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateObra = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.body.localizacao) {
      updateData.localizacao = JSON.parse(req.body.localizacao);
    }
    if (req.file) {
      updateData.foto = req.file.path;
    }
    const obra = await Obra.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!obra) return res.status(404).json({ error: 'Obra não encontrada' });
    res.json(obra);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteObra = async (req, res) => {
  try {
    const obra = await Obra.findByIdAndDelete(req.params.id);
    if (!obra) return res.status(404).json({ error: 'Obra não encontrada' });
    res.json({ message: 'Obra removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getObraDetalhes = async (req, res) => {
  try {
    const obra = await Obra.findById(req.params.id);
    if (!obra) return res.status(404).json({ error: 'Obra não encontrada' });
    const fiscalizacoes = await Fiscalizacao.find({ obra: obra._id });
    res.json({ obra, fiscalizacoes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.enviarObraPorEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const obra = await Obra.findById(req.params.id);
    if (!obra) return res.status(404).json({ error: 'Obra não encontrada' });
    const fiscalizacoes = await Fiscalizacao.find({ obra: obra._id });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'seuemail@gmail.com',
        pass: 'suasenha'
      }
    });

    const mailOptions = {
      from: 'seuemail@gmail.com',
      to: email,
      subject: `Dados da Obra: ${obra.nome}`,
      text: `
Obra: ${obra.nome}
Responsável: ${obra.responsavel}
Data de início: ${obra.dataInicio}
Previsão de término: ${obra.previsaoTermino}
Descrição: ${obra.descricao}
Localização: (${obra.localizacao.latitude}, ${obra.localizacao.longitude})

Fiscalizações:
${fiscalizacoes.map(f => `
Data: ${f.data}
Status: ${f.statusObra}
Observações: ${f.observacoes}
Localização: (${f.localizacao.latitude}, ${f.localizacao.longitude})
`).join('\n')}
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'E-mail enviado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
