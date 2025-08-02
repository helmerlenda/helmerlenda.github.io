// script.js

// Espera o HTML carregar completamente antes de executar o código
document.addEventListener('DOMContentLoaded', () => {

  // Pega uma referência ao nosso formulário no HTML pelo seu ID
  const contactForm = document.getElementById('contact-form');

  // Adiciona um "ouvinte" que fica esperando o clique no botão "Enviar"
  contactForm.addEventListener('submit', async (event) => {
    
    // 1. Impede o comportamento padrão do formulário (que é recarregar a página)
    event.preventDefault();

    // 2. Pega os valores digitados pelo usuário nos campos
    const nome = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('message').value;

    // 3. Cria um objeto JavaScript com os dados do formulário
    const formData = {
      nome: nome,
      email: email,
      mensagem: mensagem
    };

    try {
      // 4. Usa a função 'fetch' para enviar os dados para o nosso back-end
      const response = await fetch('https://portfolio-backend-api-h7t6.onrender.com/contato', {
        method: 'POST', // Dizemos que estamos enviando dados (POST)
        headers: {
          'Content-Type': 'application/json' // Avisamos que os dados estão em formato JSON
        },
        body: JSON.stringify(formData) // Convertemos nosso objeto para uma string JSON
      });

      // 5. Verifica se o servidor respondeu com sucesso
      if (response.ok) {
        alert('Mensagem enviada com sucesso! Obrigado pelo contato.');
        contactForm.reset(); // Limpa os campos do formulário
      } else {
        // Se o servidor respondeu com um erro
        alert('Ocorreu um erro ao enviar a mensagem. Tente novamente.');
      }
    } catch (error) {
      // Se houve um erro de rede (ex: servidor desligado)
      console.error('Erro na requisição:', error);
      alert('Não foi possível se conectar ao servidor. Verifique sua conexão.');
    }
  });
});