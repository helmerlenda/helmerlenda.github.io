// dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const API_URL = 'https://portfolio-backend-api-h7t6.onrender.com';

    // --- SEGURANÇA DA PÁGINA (JÁ EXISTE) ---
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    fetch(`${API_URL}/api/perfil`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) {
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
            return Promise.reject('Token inválido'); // Rejeita a promessa para parar a execução
        }
        return response.json();
    })
    .then(data => {
        if (data && data.user) {
            const welcomeMessage = document.getElementById('welcome-message');
            welcomeMessage.textContent = `Bem-vindo, ${data.user.email}!`;
        }
    })
    .catch(error => {
        if (error !== 'Token inválido') { // Evita logar o erro de redirecionamento
           console.error('Erro ao buscar perfil:', error);
        }
    });

    // --- LÓGICA DO LOGOUT (JÁ EXISTE) ---
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        alert('Você foi desconectado com sucesso.');
        window.location.href = 'login.html';
    });


    // --- NOVA LÓGICA PARA O FORMULÁRIO DE BUSCA DE LEADS ---
    const leadSearchForm = document.getElementById('lead-search-form');

    leadSearchForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o recarregamento da página

        const businessType = document.getElementById('business-type').value;
        const city = document.getElementById('city').value;

        try {
            const response = await fetch(`${API_URL}/api/leads/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Enviamos o token para a rota protegida
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ businessType, city })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message); // Ex: "Pedido de leads recebido! ..."
            } else {
                // Mostra a mensagem de erro que veio da API
                alert(`Erro: ${data.message}`);
            }
        } catch (error) {
            console.error('Erro de rede na busca de leads:', error);
            alert('Não foi possível se conectar ao servidor. Tente novamente.');
        }
    });
});