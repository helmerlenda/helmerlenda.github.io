// auth.js (Versão Completa e Final)

// --- FUNÇÃO PARA MOSTRAR NOTIFICAÇÕES PROFISSIONAIS ---
// Esta função é necessária para as mensagens de sucesso e erro.
const showNotification = (message, type = 'success') => {
    // Primeiro, verifica se o container de notificações existe no HTML.
    let container = document.getElementById('notification-container');
    if (!container) {
        // Se não existir, cria e adiciona ao corpo do documento.
        container = document.createElement('div');
        container.id = 'notification-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `<i class="fas ${iconClass}"></i><span>${message}</span>`;
    
    container.appendChild(toast);

    // Remove a notificação após 5 segundos.
    setTimeout(() => {
        toast.remove();
    }, 5000);
};


// --- BLOCO DE VERIFICAÇÃO INICIAL ---
// Verifica se o usuário já tem um token e está tentando acessar as páginas de login/cadastro.
const token = localStorage.getItem('authToken');
if (token && (window.location.pathname.endsWith('/login.html') || window.location.pathname.endsWith('/cadastro.html'))) {
  // Se sim, redireciona imediatamente para o dashboard.
  window.location.href = 'dashboard.html';
}
// --- LÓGICA PRINCIPAL DA PÁGINA ---
// Só executa o resto do código depois que o HTML estiver totalmente carregado.
document.addEventListener('DOMContentLoaded', () => {
  
  const API_URL = 'https://portfolio-backend-api-h7t6.onrender.com';


  // --- LÓGICA PARA O FORMULÁRIO DE CADASTRO ---
  const registerForm = document.getElementById('register-form');


  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();

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
          showNotification('Cadastro realizado com sucesso! Redirecionando para o login...', 'success');
          setTimeout(() => window.location.href = 'login.html', 2000);
        } else {
          showNotification(`Erro no cadastro: ${data.message}`, 'error');
        }
      } catch (error) {
        console.error('Erro de rede no cadastro:', error);
        showNotification('Não foi possível se conectar ao servidor.', 'error');
      }
    });
  }


  // --- LÓGICA PARA O FORMULÁRIO DE LOGIN ---
  const loginForm = document.getElementById('login-form');


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
         localStorage.setItem('authToken', data.token);
          showNotification('Login realizado com sucesso! Redirecionando...', 'success');
          setTimeout(() => window.location.href = 'dashboard.html', 1500);
        } else {
          showNotification(`Erro no login: ${data.message}`, 'error');
        }
      } catch (error) {
        console.error('Erro de rede no login:', error);
        showNotification('Não foi possível se conectar ao servidor.', 'error');
      }
    });
  }
});