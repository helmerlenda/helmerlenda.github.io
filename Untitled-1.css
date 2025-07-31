// A URL da sua webhook
const WEBHOOK_URL = 'https://n8n.gudanbolizante.site/webhook-test/a50bbe19-2fe5-4037-945e-b39cb8be2ff5';

// Adiciona um "ouvinte" ao evento de envio do formulário
document.getElementById('contact-form').addEventListener('submit', async function(event) {
    // Impede o envio padrão do formulário, que recarregaria a página
    event.preventDefault(); 

    // Pega o formulário e os dados dos campos
    const form = event.target;
    const name = form.elements['name'].value;
    const email = form.elements['email'].value;
    const message = form.elements['message'].value;

    // Cria um objeto com os dados que serão enviados
    const data = {
        name: name,
        email: email,
        message: message
    };

    try {
        // Usa a função fetch para enviar os dados para a webhook
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST', // O método de envio é POST
            headers: {
                'Content-Type': 'application/json' // Informa que o corpo da requisição é um JSON
            },
            body: JSON.stringify(data) // Converte o objeto para uma string JSON
        });

        // Verifica se a requisição foi bem-sucedida (código 200)
        if (response.ok) {
            alert('Mensagem enviada com sucesso! Obrigado por entrar em contato.');
            form.reset(); // Limpa os campos do formulário
        } else {
            // Se a requisição falhou, exibe uma mensagem de erro
            alert('Houve um erro ao enviar a mensagem. Por favor, tente novamente.');
        }
    } catch (error) {
        // Em caso de erro de rede ou outro problema, exibe uma mensagem genérica
        alert('Houve um erro de conexão. Verifique sua internet e tente novamente.');
    }
});