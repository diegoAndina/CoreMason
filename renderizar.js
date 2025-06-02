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

      // Cria uma cópia do HTML do template
      let html = template.html;

      // Substitui as classes de estilo
      Object.entries(template.estilos).forEach(([chave, valor]) => {
        if (typeof valor === 'string') {
          // Substitui a classe simples
          const regex = new RegExp(`\\b${valor}\\b`, 'g');
          html = html.replace(regex, parametros.dados[chave] || valor);
        } else if (typeof valor === 'object') {
          // Para objetos de estilos (como botões ou menu)
          Object.entries(valor).forEach(([subchave, subvalor]) => {
            const regex = new RegExp(`\\b${subvalor}\\b`, 'g');
            const novaClasse = parametros.dados[subchave] || subvalor;
            html = html.replace(regex, novaClasse);
          });
        }
      });

      // Substitui o título
      if (parametros.dados.titulo) {
        html = html.replace(/Meu Site/g, parametros.dados.titulo);
      }

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