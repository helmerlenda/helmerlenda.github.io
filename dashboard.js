// dashboard.js (Versão Final com a Tabela Correta)

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const API_URL = 'https://portfolio-backend-api-h7t6.onrender.com';

    // Elementos da página
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutButton = document.getElementById('logout-button');
    const leadSearchForm = document.getElementById('lead-search-form');
    const leadsListDiv = document.getElementById('leads-list');

    // --- FUNÇÃO PARA RENDERIZAR A LISTA DE LEADS NA TELA ---
    const renderLeads = (leads) => {
        leadsListDiv.innerHTML = ''; // Limpa a área

        if (leads.length === 0) {
            leadsListDiv.innerHTML = '<p>Nenhum lead gerado ainda. Preencha o formulário para começar.</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'leads-table';

        // Cabeçalho da tabela com as colunas que você pediu
        const thead = `
            <thead>
                <tr>
                    <th>Nome da Empresa</th>
                    <th>Endereço</th>
                    <th>Telefone</th>
                    <th>Site</th>
                </tr>
            </thead>
        `;
        table.innerHTML = thead;

        // Corpo da tabela com os novos dados
        const tbody = document.createElement('tbody');
        leads.forEach(lead => {
            const row = document.createElement('tr');
            // Buscamos os campos 'phone' e 'website' que agora existem no banco
            row.innerHTML = `
                <td>${lead.company_name || 'N/A'}</td>
                <td>${lead.address || 'N/A'}</td>
                <td>${lead.phone || 'N/A'}</td>
                <td>${lead.website ? `<a href="${lead.website}" target="_blank" rel="noopener noreferrer">${lead.website}</a>` : 'N/A'}</td>
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

    // --- LÓGICA PRINCIPAL ---
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
            fetchLeads(); // Depois de confirmar o login, busca os leads
        }
    })
    .catch(error => {
        if (error !== 'Token inválido') {
           console.error('Erro ao buscar perfil:', error);
        }
    });

    // Lógica do Logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        alert('Você foi desconectado com sucesso.');
        window.location.href = 'login.html';
    });
    
    // Lógica do Formulário de Busca de Leads
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
            alert(data.message);
            // Após um novo pedido, busca a lista de leads atualizada
            if (response.ok) {
                fetchLeads();
            }
        } catch (error) {
            console.error('Erro de rede na busca de leads:', error);
            alert('Não foi possível se conectar ao servidor. Tente novamente.');
        }
    });
});