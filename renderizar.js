(function(global) {
  // Função para carregar um arquivo JSON
  async function _carregarJSON(url) {
    try {
      const resposta = await fetch(url);
      if (!resposta.ok) {
        throw new Error(`Erro ao carregar ${url}: ${resposta.status}`);
      }
      return await resposta.json();
    } catch (erro) {
      console.error(`Erro ao carregar arquivo: ${erro.message}`);
      throw erro;
    }
  }

  // Função para renderizar páginas ou componentes
  async function renderizar(parametros) {
    try {
      // Verifica se os parâmetros são um objeto
      if (typeof parametros !== 'object' || parametros === null) {
        throw new Error('Os parâmetros devem ser um objeto');
      }

      // Verifica se o template foi especificado
      if (!parametros.template) {
        throw new Error('Template é obrigatório');
      }

      // Verifica se os dados foram fornecidos
      if (!parametros.dados || typeof parametros.dados !== 'object') {
        throw new Error('Dados devem ser um objeto');
      }

      // Carrega os templates
      const templates = await _carregarJSON("templates.json");

      // Obtém o template
      const template = templates[parametros.template];
      if (!template) {
        throw new Error(`Template '${parametros.template}' não encontrado`);
      }

      // Substitui as variáveis no template
      let html = template;
      
      // Primeiro, processa condições especiais como {{#var}}conteúdo{{/var}}
      Object.entries(parametros.dados).forEach(([key, value]) => {
        const conditionRegex = new RegExp(`\\{\\{#${key}\\}\\}([\\s\\S]*?)\\{\\{/${key}\\}\\}`, 'g');
        html = html.replace(conditionRegex, value ? '$1' : '');
      });
      
      // Depois, substitui as variáveis simples {{var}}
      Object.entries(parametros.dados).forEach(([key, value]) => {
        const valueToInsert = typeof value === 'string' && value.startsWith('/')
          ? `<a href="#${value}" class="text-blue-500 hover:underline">${value}</a>`
          : value;
          
        html = html.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), valueToInsert || '');
      });

      // Insere o HTML no container
      const container = document.getElementById('app') || document.body;
      container.innerHTML = html;

      console.log('Template renderizado com sucesso!');
    } catch (erro) {
      console.error('Erro ao renderizar:', erro);
      const container = document.getElementById('app') || document.body;
      container.innerHTML = `<div class="p-4 text-red-600">Erro ao renderizar: ${erro.message}</div>`;
    }
  }

  // Exporta a função renderizar
  global.renderizar = renderizar;

})(window);