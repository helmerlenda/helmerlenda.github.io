// dashboard.js (Versão Final com Gráficos e Notificações)

document.addEventListener('DOMContentLoaded', () => {
    // --- FUNÇÃO PARA MOSTRAR NOTIFICAÇÕES PROFISSIONAIS ---
    const showNotification = (message, type = 'success') => {
        const container = document.getElementById('notification-container');
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
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } },
            elements: {
                point: { radius: 0 },
                line: {
                    borderWidth: 2,
                    tension: 0.4,
                }
            }
        };

        // Cria o Gráfico de Leads
        const leadsCtx = document.getElementById('leads-chart').getContext('2d');
        new Chart(leadsCtx, {
            type: 'line',
            data: {
                labels: leadsData.labels,
                datasets: [{ 
                    label: 'Leads', 
                    data: leadsData.data, 
                    borderColor: 'rgba(59, 130, 246, 0.8)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true
                }]
            },
            options: chartOptions
        });
        
        // Cria o Gráfico de Buscas
        const searchesCtx = document.getElementById('searches-chart').getContext('2d');
        new Chart(searchesCtx, {
            type: 'line',
            data: {
                labels: searchesData.labels,
                datasets: [{ 
                    label: 'Buscas', 
                    data: searchesData.data,
                    borderColor: 'rgba(16, 185, 129, 0.8)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true
                }]
            },
            options: chartOptions
        });
    };


    // --- LÓGICA PRINCIPAL DA PÁGINA ---
    const token = localStorage.getItem('authToken');
    const API_URL = 'https://portfolio-backend-api-h7t6.onrender.com';
    // (O resto do seu código de fetch, logout e formulário continua aqui,
    // mas trocando todos os `alert()` por `showNotification()`)
    
    // Exemplo de como trocar o alert no formulário de busca:
    // ... dentro do `leadSearchForm.addEventListener` ...
    // if (response.ok) {
    //   showNotification(data.message); // ANTES: alert(data.message);
    // } else {
    //   showNotification(`Erro: ${data.message}`, 'error'); // ANTES: alert(`Erro: ${data.message}`);
    // }

    // (Cole o resto do seu código `dashboard.js` aqui, fazendo as trocas dos alerts)

    // Finalmente, chama a função para criar os gráficos
    createCharts();
});