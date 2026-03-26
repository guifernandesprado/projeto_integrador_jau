const { pool } = require('../config/database');

async function resumo(req, res) {
  try {
    const [[clientes]] = await pool.query('SELECT COUNT(*) total_clientes FROM clientes');
    const [[pendentes]] = await pool.query("SELECT COUNT(*) total_pendentes, COALESCE(SUM(valor_debito),0) valor_pendente FROM debitos WHERE status = 'PENDENTE'");
    const [[pagos]] = await pool.query("SELECT COALESCE(SUM(valor_debito),0) valor_pago FROM debitos WHERE status = 'PAGO'");
    const [[atrasados]] = await pool.query("SELECT COUNT(*) total_atrasados, COALESCE(SUM(valor_debito),0) valor_atrasado FROM debitos WHERE status <> 'PAGO' AND vencimento_debito < CURDATE()");

    res.json({
      total_clientes: Number(clientes.total_clientes || 0),
      total_pendentes: Number(pendentes.total_pendentes || 0),
      valor_pendente: Number(pendentes.valor_pendente || 0),
      valor_pago: Number(pagos.valor_pago || 0),
      total_atrasados: Number(atrasados.total_atrasados || 0),
      valor_atrasado: Number(atrasados.valor_atrasado || 0)
    });
  } catch (error) {
    console.error('Erro ao montar dashboard:', error);
    res.status(500).json({ erro: 'Falha ao montar dashboard.', detalhe: error.message });
  }
}

module.exports = { resumo };
