// auth.js

// Espera o HTML carregar completamente
document.addEventListener('DOMContentLoaded', () => {

  // Define a URL base da nossa API que está na Render
  const API_URL = 'https://portfolio-backend-api-h7t6.onrender.com';

  // --- LÓGICA PARA O FORMULÁRIO DE CADASTRO ---
  const registerForm = document.getElementById('register-form');

  // Verifica se o formulário de cadastro existe na página atual
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Impede o recarregamento da página

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
          // Redireciona o usuário para a página de login após o sucesso
          window.location.href = 'login.html';
        } else {
          // Mostra a mensagem de erro que veio da API (ex: "Email já em uso")
          alert(`Erro no cadastro: ${data.message}`);
        }
      } catch (error) {
        console.error('Erro de rede no cadastro:', error);
        alert('Não foi possível se conectar ao servidor. Tente novamente.');
      }
    });
  }


  // --- LÓGICA PARA O FORMULÁRIO DE LOGIN ---
  const loginForm = document.getElementById('login-form');

  // Verifica se o formulário de login existe na página atual
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          // --- PONTO CHAVE: GUARDANDO O TOKEN ---
          // 'localStorage' é um "pequeno cofre" no navegador.
          // Guardamos o token aqui para que o usuário continue logado.
          localStorage.setItem('authToken', data.token);

          alert('Login realizado com sucesso! Você será redirecionado para a página principal.');
          // Redireciona o usuário para a página principal (ou um dashboard futuro)
          window.location.href = 'index.html';
        } else {
          // Mostra a mensagem de erro que veio da API (ex: "Credenciais inválidas")
          alert(`Erro no login: ${data.message}`);
        }
      } catch (error) {
        console.error('Erro de rede no login:', error);
        alert('Não foi possível se conectar ao servidor. Tente novamente.');
      }
    });
  }
});