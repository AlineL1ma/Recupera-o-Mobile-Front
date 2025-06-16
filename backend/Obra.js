const mongoose = require('mongoose');

const ObraSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  responsavel: { type: String, required: true },
  dataInicio: { type: Date, required: true },
  previsaoTermino: { type: Date, required: true },
  localizacao: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  foto: { type: String }, 
  descricao: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Obra', ObraSchema);
