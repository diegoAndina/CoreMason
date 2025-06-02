# 🚀 Projeto: Sistema de Renderização Dinâmica

Este projeto implementa um **motor de renderização dinâmico**, permitindo a construção de aplicações totalmente moduladas e **livres de marcação HTML fixa**.  
Ele segue uma abordagem **inspirada no React**, com um **sistema de rotas único**, onde **templates são renderizados dinamicamente**, sem recarregar a página.

---

## 🎯 **Objetivo**
✔ Criar um ambiente de desenvolvimento **limpo e autoexplicativo**  
✔ Permitir que os desenvolvedores usem **uma única função (`renderizar()`)** para construir interfaces  
✔ Implementar um **sistema de roteamento** que elimina a necessidade de múltiplos arquivos HTML  
✔ Facilitar a **inserção de animações** e carregamento de dados dinâmicos  

---

## 📂 **Estrutura do Projeto**
├── index.html # Arquivo principal, apenas carrega os scripts e dependências 
├── renderizar.js # Motor da aplicação, processa JSON e renderiza os templates 
├── app.js # Arquivo onde o desenvolvedor chama renderizar() para criar a aplicação 
├── rotas.json # Define todas as rotas disponíveis na aplicação 
├── templates.json # Armazena os templates HTML reutilizáveis 
├── dados.json # Contém dados que serão inseridos nos templates 
├── animacoes.json # Define scripts de animações para aplicar aos elementos


---

## 🔹 **1. index.html**
O `index.html` funciona apenas como um **container vazio**, onde o JavaScript monta todo o conteúdo dinamicamente.

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Meu Site Modular</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2/dist/tailwind.min.css" rel="stylesheet">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="renderizar.js" defer></script>
  <script src="app.js" defer></script>
</head>
<body>
</body>
</html>
🔹 2. O Motor: renderizar.js
Este é o coração do projeto, responsável por carregar templates, substituir variáveis e processar rotas automaticamente.

js
(function(global) {
  
  async function _carregarJSON(url) {
    const resposta = await fetch(url);
    return resposta.json();
  }

  function escaparHTML(texto) {
    return texto.replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
  }

  async function renderizar(parametros) {
    const rotas = await _carregarJSON("rotas.json");
    const templates = await _carregarJSON("templates.json");

    let caminho = parametros.conteudo;

    if (caminho.startsWith("/")) {
      if (!rotas[caminho]) {
        console.error(`Erro: Rota '${caminho}' não encontrada.`);
        return;
      }
      parametros.template = rotas[caminho].template;
      parametros.dados = rotas[caminho].dados;
    }

    if (!templates[parametros.template]) {
      console.error(`Erro: Template '${parametros.template}' não existe.`);
      return;
    }

    let html = templates[parametros.template];

    if (parametros.dados) {
      Object.keys(parametros.dados).forEach(key => {
        html = html.replace(new RegExp(`{{${key}}}`, "g"), escaparHTML(parametros.dados[key]));
      });
    }

    document.body.innerHTML = html;
  }

  async function animar_elemento(tipo, elementoId) {
    const animacoes = await _carregarJSON("animacoes.json");

    if (!animacoes[tipo]) {
      console.error(`Erro: A animação '${tipo}' não existe.`);
      return;
    }

    const script = animacoes[tipo].script.replace(/{{elemento}}/g, `#${elementoId}`);
    
    eval(script);
  }

  global.renderizar = renderizar;
  global.animar_elemento = animar_elemento;

})(window);
🔹 3. Roteamento Dinâmico (rotas.json)
Definição das páginas do sistema.

json
{
  "/home": { "template": "home", "dados": {} },
  "/sobre": { "template": "sobre", "dados": { "descricao": "Somos uma empresa inovadora!" } },
  "/contato": { "template": "contato", "dados": { "email": "contato@empresa.com" } }
}
🔹 4. Templates Dinâmicos (templates.json)
Os templates reutilizáveis.

json
{
  "home": "<div class='container'> <h1>Bem-vindo!</h1> </div>",
  "sobre": "<div class='container'> <h2>Sobre Nós</h2> <p>{{descricao}}</p> </div>",
  "contato": "<div class='container'> <h2>Contato</h2> <p>Email: {{email}}</p> </div>"
}
🔹 5. Dados para Popular Templates (dados.json)
Os dados inseridos nos templates.

json
[
  "Artigo sobre JavaScript &lt;script&gt;alert('Hackeado!')&lt;/script&gt;",
  "Guia de CSS para iniciantes &lt;div&gt;Teste&lt;/div&gt;",
  "Como usar Tailwind CSS &lt;span style='color:red;'&gt;Texto vermelho&lt;/span&gt;"
]
🔹 6. Animações Dinâmicas (animacoes.json)
Definição de efeitos visuais.

json
{
  "sobe-e-desce": {
    "script": "document.querySelector('{{elemento}}').animate([ { transform: 'translateY(0px)' }, { transform: 'translateY(-10px)' }, { transform: 'translateY(0px)' } ], { duration: 1000, iterations: Infinity });"
  }
}
🔹 7. Chamando renderizar() no app.js
Agora, basta chamar renderizar() para carregar conteúdo e navegar entre páginas!

js
// app.js

// Exemplo: Renderizando a página "Sobre"
renderizar("/sobre");

// Caso precise mudar de rota, basta chamar:
renderizar("/contato");
🚀 Rodando o Projeto
✅ 1. Abrindo diretamente no navegador
✔ Clique duas vezes no arquivo index.html.

✅ 2. Rodando com um servidor HTTP local
Para permitir o carregamento de JSON, use:

sh
python -m http.server
Acesse http://localhost:8000.

✅ 3. Rodando com Node.js
Crie server.js e execute:

sh
node server.js
🎯 Conclusão
✔ O desenvolvedor só precisa chamar renderizar() e tudo acontece automaticamente ✔ O sistema de rotas funciona como no React, sem precisar recarregar páginas ✔ Templates e dados são modularizados e fáceis de reutilizar ✔ Animações podem ser aplicadas a qualquer elemento renderizado

🔥 Agora sua aplicação está totalmente modular, inteligente e fácil de desenvolver! 🚀