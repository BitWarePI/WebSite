const { getCsvFromEmpresa } = require("../utils/getDadosBucket");

exports.lerEmpresa = async (req, res) => {
  try {
    const empresaId = req.params.id;
    const dados = await getCsvFromEmpresa(empresaId);

    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};
