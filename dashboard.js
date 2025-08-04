// dashboard.js (Versão Completa com Gráficos e Notificações)

document.addEventListener('DOMContentLoaded', () => {
    // --- FUNÇÃO PARA MOSTRAR NOTIFICAÇÕES PROFISSIONAIS ---
    const showNotification = (message, type = 'success') => {
        const container = document.getElementById('notification-container');
        if (!container) return; // Se o container não existir, não faz nada
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `<i class="fas ${iconClass}"></i><span>${message}</span>`;
        
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000); // A notificação some após 5 segundos
    };

    // --- FUNÇÃO PARA CRIAR OS GRÁFICOS ---
    const createCharts = () => {
        // Dados de exemplo (no futuro, viriam da API)
        const leadsData = {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            data: [12, 19, 3, 5, 2, 3, 15]
        };
        const searchesData = {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            data: [1, 2, 1, 3, 1, 4, 2]
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } },
            elements: { point: { radius: 0 }, line: { borderWidth: 2, tension: 0.4 } }
        };

        // Cria o Gráfico de Leads
        const leadsCtx = document.getElementById('leads-chart');
        if (leadsCtx) {
            new Chart(leadsCtx.getContext('2d'), {
                type: 'line',
                data: { labels: leadsData.labels, datasets: [{ label: 'Leads', data: leadsData.data, borderColor: 'rgba(59, 130, 246, 0.8)', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true }] },
                options: chartOptions
            });
        }
        
        // Cria o Gráfico de Buscas
        const searchesCtx = document.getElementById('searches-chart');
        if (searchesCtx) {
            new Chart(searchesCtx.getContext('2d'), {
                type: 'line',
                data: { labels: searchesData.labels, datasets: [{ label: 'Buscas', data: searchesData.data, borderColor: 'rgba(16, 185, 129, 0.8)', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true }] },
                options: chartOptions
            });
        }
    };

    // --- LÓGICA PRINCIPAL DA PÁGINA ---
    const token = localStorage.getItem('authToken');
    const API_URL = 'https://portfolio-backend-api-h7t6.onrender.com';
    
    // Elementos da página
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutButton = document.getElementById('logout-button');
    const leadSearchForm = document.getElementById('lead-search-form');
    const leadsListDiv = document.getElementById('leads-list');
    
    const renderLeads = (leads) => { /* ... sua função renderLeads ... */ };
    const fetchLeads = async () => { /* ... sua função fetchLeads ... */ };

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
            return Promise.reject('Token inválido');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.user) {
            if(welcomeMessage) welcomeMessage.textContent = `Bem-vindo, ${data.user.email}!`;
            fetchLeads();
        }
    })
    .catch(error => {
        if (error !== 'Token inválido') {
           console.error('Erro ao buscar perfil:', error);
        }
    });

    if(logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            showNotification('Você foi desconectado com sucesso.', 'success');
            setTimeout(() => window.location.href = 'login.html', 1500);
        });
    }
    
    if(leadSearchForm) {
        leadSearchForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const businessType = document.getElementById('business-type').value;
            const city = document.getElementById('city').value;
            try {
                const response = await fetch(`${API_URL}/api/leads/request`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ businessType, city })
                });
                const data = await response.json();
                if (response.ok) {
                    showNotification(data.message);
                } else {
                    showNotification(`Erro: ${data.message}`, 'error');
                }
            } catch (error) {
                console.error('Erro de rede na busca de leads:', error);
                showNotification('Não foi possível se conectar ao servidor.', 'error');
            }
        });
    }

    // Chama a função para criar os gráficos
    createCharts();
});