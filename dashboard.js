// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    // Pega o token que guardamos no cofre do navegador (localStorage)
    const token = localStorage.getItem('authToken');

    // --- O SEGURANÇA DA PÁGINA ---
    // Se não houver token, o usuário não está logado.
    // Expulsa ele para a página de login imediatamente.
    if (!token) {
        window.location.href = 'login.html';
        return; // Para a execução do script
    }

    // Se o token existe, vamos buscar os dados do perfil do usuário
    const API_URL = 'https://portfolio-backend-api-h7t6.onrender.com';

    fetch(`${API_URL}/api/perfil`, {
        method: 'GET',
        headers: {
            // Apresenta o token para o segurança da API
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        // Se o token for inválido ou expirado, a API retornará um erro.
        // Também expulsamos o usuário.
        if (!response.ok) {
            localStorage.removeItem('authToken'); // Limpa o token inválido
            window.location.href = 'login.html';
            return;
        }
        return response.json();
    })
    .then(data => {
        // Se tudo deu certo, exibe a mensagem de boas-vindas
        if (data && data.user) {
            const welcomeMessage = document.getElementById('welcome-message');
            welcomeMessage.textContent = `Bem-vindo, ${data.user.email}!`;
        }
    })
    .catch(error => {
        console.error('Erro ao buscar perfil:', error);
        // Em caso de erro de rede, também redirecionamos para o login
        window.location.href = 'login.html';
    });


    // --- LÓGICA DO BOTÃO DE LOGOUT ---
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        // Limpa o token do cofre do navegador
        localStorage.removeItem('authToken');
        alert('Você foi desconectado com sucesso.');
        // Envia o usuário de volta para a página de login
        window.location.href = 'login.html';
    });
});