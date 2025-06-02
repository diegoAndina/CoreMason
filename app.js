document.addEventListener('DOMContentLoaded', async () => {
  // Carrega os templates disponíveis
  const templates = await fetch('templates.json').then(res => res.json());
  const templateNames = Object.keys(templates);
  
  // Estado do sistema
  let estado = {
    atual: null,
    anterior: null,
    proximo: null,
    currentIndex: 0,
    elementos: [],
    modificacoes: {},
    templateInicial: {
      template: templateNames[0],
      dados: {
        titulo: 'Meu Site',
        fundo: 'bg-blue-500',
        texto: 'text-white',
        tamanho: 'text-2xl',
        fonte: 'font-bold'
      }
    }
  };

  // Campos específicos por template
  const camposPorTemplate = {
    cabecalho1: [
      { nome: 'titulo', label: 'Título', tipo: 'text' },
      { nome: 'fundo', label: 'Cor de Fundo', tipo: 'select', opcoes: [
        'bg-blue-500',
        'bg-green-500',
        'bg-red-500',
        'bg-yellow-500'
      ]},
      { nome: 'texto', label: 'Cor do Texto', tipo: 'select', opcoes: [
        'text-white',
        'text-gray-800',
        'text-black'
      ]},
      { nome: 'tamanho', label: 'Tamanho do Texto', tipo: 'select', opcoes: [
        'text-sm',
        'text-base',
        'text-lg',
        'text-xl',
        'text-2xl'
      ]},
      { nome: 'fonte', label: 'Estilo da Fonte', tipo: 'select', opcoes: [
        'font-normal',
        'font-semibold',
        'font-bold'
      ]}
    ],
    cabecalho2: [
      { nome: 'titulo', label: 'Título', tipo: 'text' },
      { nome: 'fundo', label: 'Cor de Fundo', tipo: 'select', opcoes: [
        'bg-gray-900',
        'bg-blue-900',
        'bg-black'
      ]},
      { nome: 'texto', label: 'Cor do Texto', tipo: 'select', opcoes: [
        'text-white',
        'text-gray-300',
        'text-gray-100'
      ]},
      { nome: 'nav', label: 'Efeito Hover', tipo: 'select', opcoes: [
        'hover:text-gray-300',
        'hover:text-gray-200',
        'hover:text-white'
      ]}
    ],
    cabecalho3: [
      { nome: 'titulo', label: 'Título', tipo: 'text' },
      { nome: 'fundo', label: 'Cor de Fundo', tipo: 'select', opcoes: [
        'bg-white',
        'bg-gray-50',
        'bg-gray-100'
      ]},
      { nome: 'texto', label: 'Cor do Texto', tipo: 'select', opcoes: [
        'text-gray-800',
        'text-gray-700',
        'text-gray-900'
      ]},
      { nome: 'login', label: 'Botão Login', tipo: 'select', opcoes: [
        'bg-blue-500 hover:bg-blue-600',
        'bg-blue-600 hover:bg-blue-700',
        'bg-blue-700 hover:bg-blue-800'
      ]},
      { nome: 'registrar', label: 'Botão Registrar', tipo: 'select', opcoes: [
        'bg-green-500 hover:bg-green-600',
        'bg-green-600 hover:bg-green-700',
        'bg-green-700 hover:bg-green-800'
      ]}
    ],
    cabecalho4: [
      { nome: 'titulo', label: 'Título', tipo: 'text' },
      { nome: 'fundo', label: 'Cor de Fundo', tipo: 'select', opcoes: [
        'bg-white',
        'bg-gray-50',
        'bg-gray-100'
      ]},
      { nome: 'texto', label: 'Cor do Texto', tipo: 'select', opcoes: [
        'text-gray-800',
        'text-gray-700',
        'text-gray-900'
      ]},
      { nome: 'menu', label: 'Botão Menu', tipo: 'select', opcoes: [
        'bg-gray-100 hover:bg-gray-200',
        'bg-gray-200 hover:bg-gray-300',
        'bg-gray-300 hover:bg-gray-400'
      ]},
      { nome: 'itens', label: 'Itens do Menu', tipo: 'select', opcoes: [
        'hover:bg-gray-100',
        'hover:bg-gray-200',
        'hover:bg-gray-300'
      ]}
    ]
  };

  // Atualiza o estado
  function atualizarEstado() {
    const total = templateNames.length;
    estado.atual = templateNames[estado.currentIndex];
    estado.anterior = templateNames[(estado.currentIndex - 1 + total) % total];
    estado.proximo = templateNames[(estado.currentIndex + 1 + total) % total];
  }

  // Cria a estrutura principal
  const container = document.createElement('div');
  container.className = 'p-4 space-y-6';
  document.body.appendChild(container);

  // Cria o painel de navegação de templates
  const navPanel = document.createElement('div');
  navPanel.className = 'bg-gray-100 p-4 rounded-lg shadow-md';
  container.appendChild(navPanel);

  // Cria os botões de navegação
  const navButtons = document.createElement('div');
  navButtons.className = 'flex justify-between mb-4';
  navPanel.appendChild(navButtons);

  const prevButton = document.createElement('button');
  prevButton.className = 'p-2 bg-gray-200 rounded hover:bg-gray-300';
  prevButton.textContent = '← Template Anterior';
  navButtons.appendChild(prevButton);

  const nextButton = document.createElement('button');
  nextButton.className = 'p-2 bg-gray-200 rounded hover:bg-gray-300';
  nextButton.textContent = 'Próximo Template →';
  navButtons.appendChild(nextButton);

  // Botão para definir template
  const definirButton = document.createElement('button');
  definirButton.className = 'w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4';
  definirButton.textContent = 'Definir Template';
  navPanel.appendChild(definirButton);

  // Cria o container para a pré-visualização do template
  const previewContainer = document.createElement('div');
  previewContainer.className = 'bg-white p-4 rounded-lg shadow-md';
  container.appendChild(previewContainer);

  // Cria o container para o formulário dinâmico
  const formContainer = document.createElement('div');
  formContainer.className = 'bg-gray-100 p-4 rounded-lg shadow-md hidden';
  container.appendChild(formContainer);

  // Função para criar campos dinâmicos
  function criarCamposDinamicos() {
    formContainer.innerHTML = '';
    const campos = camposPorTemplate[estado.atual];
    
    if (campos) {
      campos.forEach(campo => {
        const campoContainer = document.createElement('div');
        campoContainer.className = 'mb-4';
        
        const label = document.createElement('label');
        label.className = 'block text-gray-700 text-sm font-bold mb-2';
        label.textContent = campo.label;
        campoContainer.appendChild(label);
        
        if (campo.tipo === 'text') {
          const input = document.createElement('input');
          input.type = 'text';
          input.className = 'w-full px-3 py-2 border rounded';
          input.name = campo.nome;
          // Preenche com valor inicial se existir
          if (estado.templateInicial.dados[campo.nome]) {
            input.value = estado.templateInicial.dados[campo.nome];
          }
          campoContainer.appendChild(input);
        } else if (campo.tipo === 'select') {
          const select = document.createElement('select');
          select.className = 'w-full px-3 py-2 border rounded';
          select.name = campo.nome;
          
          campo.opcoes.forEach(opcao => {
            const option = document.createElement('option');
            option.value = opcao;
            option.textContent = opcao;
            // Seleciona a opção inicial se existir
            if (opcao === estado.templateInicial.dados[campo.nome]) {
              option.selected = true;
            }
            select.appendChild(option);
          });
          
          campoContainer.appendChild(select);
        }
        
        formContainer.appendChild(campoContainer);
      });

      // Botão para salvar modificações
      const salvarButton = document.createElement('button');
      salvarButton.className = 'w-full bg-green-500 text-white p-2 rounded hover:bg-green-600';
      salvarButton.textContent = 'Salvar Modificações';
      formContainer.appendChild(salvarButton);

      // Evento para salvar modificações
      salvarButton.addEventListener('click', () => {
        const modificacoes = {};
        campos.forEach(campo => {
          const elemento = formContainer.querySelector(`[name="${campo.nome}"]`);
          modificacoes[campo.nome] = elemento.value;
        });

        // Atualiza o estado com as modificações
        estado.modificacoes = modificacoes;

        // Atualiza a visualização
        atualizarVisualizacao();
      });
    }
  }

  // Função para atualizar a visualização
  async function atualizarVisualizacao() {
    try {
      // Limpa o preview
      previewContainer.innerHTML = '';
      
      // Se é o primeiro render, mostra o template inicial
      if (estado.elementos.length === 0) {
        // Obtém o template original
        const templateOriginal = templates[estado.templateInicial.template];
        
        // Cria uma cópia do HTML
        let html = templateOriginal.html;
        
        // Aplica as modificações
        if (Object.keys(estado.modificacoes).length > 0) {
          // Substitui as classes de estilo
          Object.entries(templateOriginal.estilos).forEach(([chave, valor]) => {
            if (typeof valor === 'string') {
              // Substitui a classe simples
              const regex = new RegExp(`\b${valor}\b`, 'g');
              html = html.replace(regex, estado.modificacoes[chave] || valor);
            } else if (typeof valor === 'object') {
              // Para objetos de estilos (como botões ou menu)
              Object.entries(valor).forEach(([subchave, subvalor]) => {
                const regex = new RegExp(`\b${subvalor}\b`, 'g');
                const novaClasse = estado.modificacoes[subchave] || subvalor;
                html = html.replace(regex, novaClasse);
              });
            }
          });
        }
        
        // Substitui o título
        if (estado.modificacoes.titulo) {
          html = html.replace(/Meu Site/g, estado.modificacoes.titulo);
        }
        
        // Cria o elemento
        const elementoContainer = document.createElement('div');
        elementoContainer.className = 'mb-4';
        elementoContainer.innerHTML = html;
        previewContainer.appendChild(elementoContainer);
      }
      
      // Renderiza cada elemento
      for (const elemento of estado.elementos) {
        // Obtém o template original
        const templateOriginal = templates[elemento.template];
        
        // Cria uma cópia do HTML
        let html = templateOriginal.html;
        
        // Aplica as modificações
        Object.entries(elemento.dados).forEach(([chave, valor]) => {
          // Substitui as classes de estilo
          if (templateOriginal.estilos[chave]) {
            const regex = new RegExp(`\b${templateOriginal.estilos[chave]}\b`, 'g');
            html = html.replace(regex, valor);
          }
          
          // Substitui o título
          if (chave === 'titulo') {
            html = html.replace(/Meu Site/g, valor);
          }
        });
        
        // Cria o elemento
        const elementoContainer = document.createElement('div');
        elementoContainer.className = 'mb-4';
        elementoContainer.innerHTML = html;
        previewContainer.appendChild(elementoContainer);
      }
    } catch (erro) {
      previewContainer.innerHTML = `<div class="text-red-500">Erro ao carregar template: ${erro.message}</div>`;
    }
  }

  // Eventos de navegação
  prevButton.addEventListener('click', async () => {
    estado.currentIndex = (estado.currentIndex - 1 + templateNames.length) % templateNames.length;
    atualizarEstado();
    atualizarVisualizacao();
    criarCamposDinamicos();
  });

  nextButton.addEventListener('click', async () => {
    estado.currentIndex = (estado.currentIndex + 1) % templateNames.length;
    atualizarEstado();
    atualizarVisualizacao();
    criarCamposDinamicos();
  });

  // Evento para definir template
  definirButton.addEventListener('click', () => {
    formContainer.classList.toggle('hidden');
  });

  // Inicializa o sistema
  atualizarEstado();
  atualizarVisualizacao();
  criarCamposDinamicos();
});
