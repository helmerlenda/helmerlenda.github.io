// dashboard-publico.js (Versão Corrigida)

document.addEventListener('DOMContentLoaded', () => {
    // O nome da sua API estava diferente no código anterior
    const API_URL = 'https://portfolio-backend-helme.onrender.com'; 
    const documentosListDiv = document.getElementById('documentos-list');

    const renderDocumentos = (documentos) => {
        if (!documentosListDiv) return;

        documentosListDiv.innerHTML = '';
        if (documentos.length === 0) {
            documentosListDiv.innerHTML = '<p>Nenhum documento processado ainda.</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'leads-table';
        const thead = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Assinaturas</th>
                    <th>Reconhecimento Facial</th>
                    <th>Hash</th>
                    <th>Data</th>
                </tr>
            </thead>
        `;
        table.innerHTML = thead;
        const tbody = document.createElement('tbody');
        documentos.forEach(doc => {
            const row = document.createElement('tr');
            const signCount = [doc.assinatura_1, doc.assinatura_2, doc.assinatura_3, doc.assinatura_4, doc.assinatura_5].filter(Boolean).length;
            
            row.innerHTML = `
                <td>${doc.id}</td>
                <td>${signCount} de 5</td>
                <td>${doc.reconhecimento_facial || 'N/A'}</td>
                <td>${doc.hash ? doc.hash.substring(0, 10) + '...' : 'N/A'}</td>
                <td>${new Date(doc.created_at).toLocaleString('pt-BR')}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        documentosListDiv.appendChild(table);
    };

    const fetchDocumentos = async () => {
        // Verifica se o elemento existe antes de tentar buscar
        if (!documentosListDiv) return; 

        try {
            const response = await fetch(`${API_URL}/api/documentos`);
            if (!response.ok) throw new Error('Falha ao buscar dados.');
            const documentos = await response.json();
            renderDocumentos(documentos);
        } catch (error) {
            console.error('Erro ao buscar documentos:', error);
            documentosListDiv.innerHTML = '<p style="color: red;">Erro ao carregar os dados.</p>';
        }
    };

    // Inicia a busca de dados
    fetchDocumentos();
});