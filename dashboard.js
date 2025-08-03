// dashboard.js (Versão Final com Exibição de Leads)

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const API_URL = 'https://portfolio-backend-api-h7t6.onrender.com';

    // Elementos da página que vamos manipular
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutButton = document.getElementById('logout-button');
    const leadSearchForm = document.getElementById('lead-search-form');
    const leadsListDiv = document.getElementById('leads-list');

    // --- FUNÇÃO PARA RENDERIZAR A LISTA DE LEADS NA TELA ---
    const renderLeads = (leads) => {
        // Limpa a mensagem "Nenhum lead gerado ainda."
        leadsListDiv.innerHTML = '';

        if (leads.length === 0) {
            leadsListDiv.innerHTML = '<p>Nenhum lead gerado ainda. Preencha o formulário acima para começar.</p>';
            return;
        }

        // Cria uma tabela para exibir os leads
        const table = document.createElement('table');
        table.className = 'leads-table'; // Para estilização futura

        // Cria o cabeçalho da tabela
        const thead = `
            <thead>
                <tr>
                    <th>Nome da Empresa</th>
                    <th>CNPJ</th>
                    <th>Endereço</th>
                    <th>Status</th>
                </tr>
            </thead>
        `;
        table.innerHTML = thead;

        // Cria o corpo da tabela e preenche com os leads
        const tbody = document.createElement('tbody');
        leads.forEach(lead => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${lead.company_name || 'N/A'}</td>
                <td>${lead.cnpj || 'N/A'}</td>
                <td>${lead.address || 'N/A'}</td>
                <td><span class="status">${lead.status || 'N/A'}</span></td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        
        leadsListDiv.appendChild(table);
    };

    // --- FUNÇÃO PARA BUSCAR OS LEADS DA API ---
    const fetchLeads = async () => {
        try {
            const response = await fetch(`${API_URL}/api/leads`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar leads.');
            
            const leads = await response.json();
            renderLeads(leads); // Chama a função para exibir os leads na tela
        } catch (error) {
            console.error('Erro ao buscar leads:', error);
            leadsListDiv.innerHTML = '<p style="color: red;">Erro ao carregar seus leads.</p>';
        }
    };


    // --- LÓGICA PRINCIPAL (JÁ EXISTENTE, COM UMA ADIÇÃO) ---
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
            welcomeMessage.textContent = `Bem-vindo, ${data.user.email}!`;
            // -- ADIÇÃO IMPORTANTE: Depois de confirmar o login, busca os leads --
            fetchLeads();
        }
    })
    .catch(error => { /* ...código de catch já existente... */ });

    // Lógica do Logout (já existente)
    logoutButton.addEventListener('click', () => { /* ...código do logout... */ });
    
    // Lógica do Formulário de Busca (já existente)
    leadSearchForm.addEventListener('submit', async (event) => { /* ...código do form... */ });
});