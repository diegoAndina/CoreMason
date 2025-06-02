// Criando o formulário de teste
document.addEventListener('DOMContentLoaded', () => {
  // Criando o formulário
  const formulario = document.createElement('form');
  formulario.className = 'p-4 space-y-4 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto';
  
  // Campo para selecionar o template
  const templateSelect = document.createElement('select');
  templateSelect.className = 'w-full p-2 border rounded';
  templateSelect.innerHTML = `
    <option value="cabecalho1">Cabeçalho 1</option>
    <option value="cabecalho2">Cabeçalho 2</option>
    <option value="cabecalho3">Cabeçalho 3</option>
    <option value="cabecalho4">Cabeçalho 4</option>
    <option value="cabecalho5">Cabeçalho 5</option>
  `;
  formulario.appendChild(templateSelect);

  // Campo para o tema
  const temaInput = document.createElement('input');
  temaInput.type = 'text';
  temaInput.className = 'w-full p-2 border rounded';
  temaInput.placeholder = 'Digite o tema (ex: bg-blue-500 text-white)';
  formulario.appendChild(temaInput);

  // Campo para o conteúdo
  const conteudoInput = document.createElement('input');
  conteudoInput.type = 'text';
  conteudoInput.className = 'w-full p-2 border rounded';
  conteudoInput.placeholder = 'Digite o conteúdo do template';
  formulario.appendChild(conteudoInput);

  // Botão de submit
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600';
  submitButton.textContent = 'Renderizar Template';
  formulario.appendChild(submitButton);

  // Adicionando o formulário ao corpo
  document.body.appendChild(formulario);

  // Adicionando evento de submit
  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validando os campos
    if (!templateSelect.value) {
      alert('Por favor, selecione um template');
      return;
    }
    if (!temaInput.value) {
      alert('Por favor, digite um tema');
      return;
    }
    if (!conteudoInput.value) {
      alert('Por favor, digite um conteúdo');
      return;
    }

    // Criando os dados para renderização
    const dados = {
      tema: temaInput.value,
      dados: conteudoInput.value
    };

    try {
      await renderizar({
        template: templateSelect.value,
        dados: dados
      });
      alert('Template renderizado com sucesso!');
    } catch (erro) {
      alert(`Erro ao renderizar: ${erro.message}`);
    }
  });
});
