// dashboard.js (Versão Final Completa e Verificada)

document.addEventListener('DOMContentLoaded', () => {
    // --- FUNÇÃO PARA MOSTRAR NOTIFICAÇÕES PROFISSIONAIS ---
    const showNotification = (message, type = 'success') => {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `<i class="fas ${iconClass}"></i><span>${message}</span>`;
        
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000);
    };

    // --- FUNÇÃO PARA CRIAR OS GRÁFICOS ---
    const createCharts = (leadsCount = 0, searchesCount = 0) => {
       const leadsChartData = leadsCount === 0 ? [0, 0, 0, 0, 0, 0, 0] : [12, 19, 3, 5, 2, 3, 15];
        const searchesChartData = searchesCount === 0 ? [0, 0, 0, 0, 0, 0, 0] : [1, 2, 1, 3, 1, 4, 2];
        const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

        const chartOptions = {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } },
            elements: { point: { radius: 0 }, line: { borderWidth: 2, tension: 0.4 } }
        };

        const leadsCtx = document.getElementById('leads-chart');
        if (leadsCtx) {
            new Chart(leadsCtx.getContext('2d'), {
                type: 'line',
                data: { labels: labels, datasets: [{ data: leadsChartData, borderColor: 'rgba(59, 130, 246, 0.8)', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true }] },
                options: chartOptions
            });
        }
        
        const searchesCtx = document.getElementById('searches-chart');
        if (searchesCtx) {
            new Chart(searchesCtx.getContext('2d'), {
                type: 'line',
                data: { labels: labels, datasets: [{ data: searchesChartData, borderColor: 'rgba(16, 185, 129, 0.8)', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true }] },
                options: chartOptions
            });
        }
    };

    // --- FUNÇÃO PARA RENDERIZAR A LISTA DE LEADS ---
    // dashboard.js -> substitua apenas a função renderLeads

const renderLeads = (leads) => {
    const leadsListDiv = document.getElementById('leads-list');
    if(!leadsListDiv) return;

    leadsListDiv.innerHTML = '';
    if (leads.length === 0) {
        leadsListDiv.innerHTML = '<p>Nenhum lead gerado ainda. Preencha o formulário acima para começar.</p>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'leads-table';
    const thead = `<thead><tr><th>Nome da Empresa</th><th>Endereço</th><th>Telefone</th><th>Site</th></tr></thead>`;
    table.innerHTML = thead;
    const tbody = document.createElement('tbody');
    leads.forEach(lead => {
        const row = document.createElement('tr');
        // A MUDANÇA ESTÁ AQUI: adicionamos os atributos data-label
        row.innerHTML = `
            <td data-label="Empresa">${lead.company_name || 'N/A'}</td>
            <td data-label="Endereço">${lead.address || 'N/A'}</td>
            <td data-label="Telefone">${lead.phone || 'N/A'}</td>
            <td data-label="Site">${lead.website ? `<a href="${lead.website}" target="_blank" rel="noopener noreferrer">${lead.website}</a>` : 'N/A'}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    leadsListDiv.appendChild(table);
};

    // --- FUNÇÃO PARA BUSCAR OS LEADS ---
    const fetchLeads = async (token) => {
        try {
            const response = await fetch(`${API_URL}/api/leads`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar leads.');
            const leads = await response.json();

            const totalLeadsEl = document.getElementById('total-leads');
            if(totalLeadsEl) totalLeadsEl.textContent = leads.length;
            
            createCharts(leads.length, 0);
            renderLeads(leads);
        } catch (error) {
            console.error('Erro ao buscar leads:', error);
            if(document.getElementById('leads-list')) document.getElementById('leads-list').innerHTML = '<p style="color: red;">Erro ao carregar seus leads.</p>';
        }
    };

    // --- LÓGICA PRINCIPAL DA PÁGINA ---
    const token = localStorage.getItem('authToken');
    const API_URL = 'https://portfolio-backend-api-h7t6.onrender.com';
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const welcomeMessage = document.getElementById('welcome-message');
    const logoutButton = document.getElementById('logout-button');
    const leadSearchForm = document.getElementById('lead-search-form');

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
            fetchLeads(token);
        }
    })
    .catch(error => {
        if (error !== 'Token inválido') console.error('Erro ao buscar perfil:', error);
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
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
});