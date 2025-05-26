document.addEventListener('DOMContentLoaded', () => {
    // --- Variáveis de Estado do Jogo ---
    let rendcoins = 3000;
    let currentDay = 1;
    let energy = 100; // Porcentagem
    let playerLevel = 1;
    let playerXP = 0;
    const xpToNextLevel = 100; // XP necessário para o próximo nível

    let inventory = [];

    const products = [
        { id: 'pencil', name: 'Lápis Comum', buyPrice: 10, sellPrice: 15 },
        { id: 'notebook', name: 'Caderno Básico', buyPrice: 40, sellPrice: 60 },
        { id: 'keychain', name: 'Chaveiro de Metal', buyPrice: 25, sellPrice: 35 }
    ];

    // --- Referências de Elementos da UI ---
    const rendcoinsDisplay = document.getElementById('rendcoins-display');
    const dayDisplay = document.getElementById('day-display');
    const energyBar = document.getElementById('energy-bar');
    const mainContent = document.getElementById('main-content');
    const sleepBtn = document.getElementById('sleep-btn');
    const playerLevelDisplay = document.getElementById('player-level');
    const playerXPDisplay = document.getElementById('player-xp');
    const playerXPNextDisplay = document.getElementById('player-xp-next');

    const views = document.querySelectorAll('.view');
    const menuButtons = document.querySelectorAll('.menu-btn:not(.action-btn)'); // Exclui o botão "Dormir"

    const productListDiv = document.querySelector('#market-view .product-list');
    const inventoryListDiv = document.querySelector('#market-view .inventory-list');
    const noItemsMessage = document.querySelector('.no-items-message');

    // --- Funções Auxiliares ---

    // Atualiza todos os displays na UI
    function updateUI() {
        rendcoinsDisplay.textContent = `${rendcoins.toLocaleString('pt-BR')} RC`;
        dayDisplay.textContent = `Dia ${currentDay}`;
        energyBar.style.width = `${energy}%`;
        playerLevelDisplay.textContent = playerLevel;
        playerXPDisplay.textContent = playerXP;
        playerXPNextDisplay.textContent = xpToNextLevel; // Na demo, XP para prox nível é fixo
        updateMarketUI(); // Atualiza a lista de produtos e inventário no mercado
    }

    // Adiciona uma mensagem ao log (simulado na tela principal)
    function addLogMessage(message, type = 'info') {
        const logContainer = document.querySelector('#home-view'); // Usando a home-view como log
        const p = document.createElement('p');
        p.className = `event-log-message log-message ${type}`;
        p.textContent = message;
        logContainer.prepend(p); // Adiciona no topo do log
        // Limita o número de mensagens no log (opcional)
        while (logContainer.children.length > 5 && logContainer.lastElementChild.classList.contains('event-log-message')) {
            logContainer.lastElementChild.remove();
        }
    }

    // Salva o estado do jogo no localStorage
    function saveGame() {
        const gameState = {
            rendcoins,
            currentDay,
            energy,
            playerLevel,
            playerXP,
            inventory
        };
        localStorage.setItem('zeroToRendSave', JSON.stringify(gameState));
    }

    // Carrega o estado do jogo do localStorage
    function loadGame() {
        const savedState = localStorage.getItem('zeroToRendSave');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            rendcoins = gameState.rendcoins;
            currentDay = gameState.currentDay;
            energy = gameState.energy;
            playerLevel = gameState.playerLevel;
            playerXP = gameState.playerXP;
            inventory = gameState.inventory;
            addLogMessage("Jogo carregado!", 'info');
        } else {
            // Se não houver save, inicia com a dedução do aluguel
            deductRent();
        }
        updateUI();
    }

    // Altera a view ativa
    function switchView(viewId) {
        views.forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(viewId).classList.add('active');

        menuButtons.forEach(btn => {
            if (btn.dataset.view === viewId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // --- Mecânicas do Jogo ---

    // Dedução do Aluguel
    function deductRent() {
        const rentAmount = 850;
        if (rendcoins >= rentAmount) {
            rendcoins -= rentAmount;
            addLogMessage(`Aluguel pago: -${rentAmount} RC. Saldo: ${rendcoins} RC.`, 'loss');
        } else {
            // Em uma demo, podemos apenas forçar a dívida ou game over
            addLogMessage(`Você não tem Rendcoins suficientes para o aluguel! Você está em dívida.`, 'error');
            rendcoins -= rentAmount; // Apenas para mostrar a dívida
        }
        saveGame();
        updateUI();
    }

    // Dormir (Avança um dia)
    sleepBtn.addEventListener('click', () => {
        currentDay++;
        energy = 100; // Recarrega energia
        addLogMessage(`Um novo dia (Dia ${currentDay}), novas oportunidades!`, 'info');
        if (currentDay % 7 === 1 && currentDay > 1) { // Dedução de aluguel semanal para testar
             // deductRent(); // Descomente para testar aluguel semanal na demo
        }
        saveGame();
        updateUI();
        switchView('home-view'); // Volta para a tela inicial
    });

    // --- Mecânicas de Mercado ---

    // Renderiza a lista de produtos para comprar e vender
    function updateMarketUI() {
        productListDiv.innerHTML = '';
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <div class="product-info">
                    <span class="product-name">${product.name}</span>
                    <span class="product-price">Custo: ${product.buyPrice} RC | Venda: ${product.sellPrice} RC</span>
                </div>
                <button class="action-button buy-btn" data-product-id="${product.id}">Comprar</button>
            `;
            productListDiv.appendChild(productItem);
        });

        inventoryListDiv.innerHTML = '';
        if (inventory.length === 0) {
            noItemsMessage.style.display = 'block';
        } else {
            noItemsMessage.style.display = 'none';
            inventory.forEach((item, index) => {
                const inventoryItem = document.createElement('div');
                inventoryItem.className = 'inventory-item';
                inventoryItem.innerHTML = `
                    <div class="inventory-info">
                        <span class="inventory-name">${item.name}</span>
                        <span class="inventory-price">Custo Pago: ${item.buyPrice} RC</span>
                    </div>
                    <button class="action-button sell-btn" data-inventory-index="${index}">Vender</button>
                `;
                inventoryListDiv.appendChild(inventoryItem);
            });
        }
    }

    // Event Listener para botões de compra e venda
    productListDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-btn')) {
            const productId = e.target.dataset.productId;
            const productToBuy = products.find(p => p.id === productId);
            if (productToBuy && rendcoins >= productToBuy.buyPrice) {
                rendcoins -= productToBuy.buyPrice;
                inventory.push({ ...productToBuy }); // Adiciona uma cópia do produto
                playerXP += 5; // Ganha XP por compra
                addLogMessage(`Você comprou 1 ${productToBuy.name} por ${productToBuy.buyPrice} RC.`, 'loss');
                updateUI();
                saveGame();
            } else if (productToBuy) {
                addLogMessage(`Rendcoins insuficientes para comprar ${productToBuy.name}.`, 'error');
            }
        }
    });

    inventoryListDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('sell-btn')) {
            const index = parseInt(e.target.dataset.inventoryIndex);
            if (index >= 0 && index < inventory.length) {
                const itemToSell = inventory[index];
                rendcoins += itemToSell.sellPrice;
                inventory.splice(index, 1); // Remove do inventário
                playerXP += 10; // Ganha XP por venda
                addLogMessage(`Você vendeu 1 ${itemToSell.name} por ${itemToSell.sellPrice} RC! Lucro: ${itemToSell.sellPrice - itemToSell.buyPrice} RC.`, 'gain');
                updateUI();
                saveGame();
            }
        }
    });


    // --- Navegação entre Telas ---
    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const viewId = button.dataset.view;
            switchView(viewId);
            // Atualiza a UI específica da view se necessário (ex: mercado)
            if (viewId === 'market-view') {
                updateMarketUI();
            }
        });
    });

    // --- Inicialização do Jogo ---
    loadGame(); // Tenta carregar o jogo salvo ao iniciar
});