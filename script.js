console.log("script.js carregado");

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnBuscar');
  btn.addEventListener('click', buscarCEP);
});

async function buscarCEP(event) {
  event?.preventDefault?.();

  const input = document.getElementById('cep');
  const resultado = document.getElementById('resultado');
  const loading = document.getElementById('loading');
  const btn = document.getElementById('btnBuscar');

  const cep = (input.value || '').replace(/\D/g, '');

  resultado.innerHTML = '';
  loading.style.display = 'none';

  if (cep.length !== 8) {
    resultado.innerHTML = '<div class="alert alert-danger">CEP inválido! Digite 8 números.</div>';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Buscando...';
  loading.style.display = 'block';

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response.ok) throw new Error();

    const data = await response.json();

    if (data.erro) {
      resultado.innerHTML = '<div class="alert alert-warning">CEP não encontrado!</div>';
      return;
    }

    resultado.innerHTML = `
      <ul class="list-group mb-3">
        <li class="list-group-item"><strong>CEP:</strong> ${data.cep || '-'}</li>
        <li class="list-group-item"><strong>Rua:</strong> ${data.logradouro || '-'}</li>
        <li class="list-group-item"><strong>Bairro:</strong> ${data.bairro || '-'}</li>
        <li class="list-group-item"><strong>Cidade:</strong> ${data.localidade || '-'}</li>
        <li class="list-group-item"><strong>Estado:</strong> ${data.uf || '-'}</li>
        <li class="list-group-item"><strong>DDD:</strong> ${data.ddd || '-'}</li>
      </ul>
      <button id="limparBtn" class="btn btn-outline-danger w-100">Limpar</button>
    `;

    const limparBtn = document.getElementById('limparBtn');
    limparBtn.addEventListener('click', () => {
      input.value = '';
      resultado.innerHTML = '';
      loading.style.display = 'none';
      btn.disabled = false;
      btn.textContent = 'Buscar';
      input.focus();
    });

  } catch (err) {
    resultado.innerHTML = '<div class="alert alert-danger">Erro ao consultar o CEP. Tente novamente.</div>';
  } finally {
    loading.style.display = 'none';
    btn.disabled = false;
    btn.textContent = 'Buscar';
  }
}
