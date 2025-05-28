// Referências aos elementos HTML
const hamburgerToggle = document.getElementById('hamburger-toggle');
const mainMenu = document.getElementById('main-menu');

// Adiciona um "listener" de evento para o clique no botão de hambúrguer
hamburgerToggle.addEventListener('click', () => {
    // Alterna a classe 'menu-active' no menu principal
    // Se a classe estiver presente, remove; se não estiver, adiciona.
    mainMenu.classList.toggle('menu-active');
});


// --- Lógica de jogo básica (mantida do exemplo anterior) ---

// Exemplo simples: Aumentar o número de RC ao clicar em "Vender"
document.querySelector('.sell').addEventListener('click', () => {
    let currentRC = parseInt(document.getElementById('resource-coins').innerText);
    document.getElementById('resource-coins').innerText = currentRC + 50;
    alert('Venda realizada! +50 RC');
});

// Exemplo simples: Mostrar um alerta ao clicar em "Inventário"
document.querySelector('.inventory').addEventListener('click', () => {
    // Primeiro, fecha o menu hambúrguer se ele estiver aberto
    if (mainMenu.classList.contains('menu-active')) {
        mainMenu.classList.remove('menu-active');
    }
    alert('Abrindo o inventário...');
});

// Você pode adicionar mais lógica para os outros botões do menu aqui
// Por exemplo:
/*
document.querySelector('.skills').addEventListener('click', () => {
    if (mainMenu.classList.contains('menu-active')) {
        mainMenu.classList.remove('menu-active');
    }
    alert('Acessando habilidades...');
});
*/