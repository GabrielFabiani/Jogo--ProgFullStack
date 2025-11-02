// Instanciando o canvas
const canvas = document.querySelector('canvas');
// Obtém o contexto 2D para desenhar no canvas
const layout = canvas.getContext('2d');

// Define a largura e altura do canvas (resolução do jogo)
canvas.width = 1024;
canvas.height = 576;

// Desenha um retângulo preto inicial no canvas
layout.beginPath();
layout.fillRect(0, 0, canvas.width, canvas.height);
layout.closePath();

//Aplicando gravidade nos jogadores
const gravidade = 0.2

// Classe base para os personagens (Jogador e Inimigo)
class Sprite {
    // O construtor recebe as propriedades iniciais de posição e velocidade
    constructor({position, velocidade}) {
        this.position = position
        this.velocidade = velocidade
        this.height = 150 // Altura padrão do personagem
        this.ultimatecla // Variável para rastrear a última tecla de movimento horizontal pressionada (para movimento contínuo)
    }

    // Método para desenhar o personagem
    draw(){
        layout.beginPath();
        layout.fillStyle = 'red' // Cor do personagem
        // Desenha o retângulo do personagem
        layout.fillRect(this.position.x, this.position.y, 50, this.height);
        layout.closePath();
    }

    // Método para atualizar a posição do personagem a cada quadro de animação
    atualiza(){
        this.draw() // Redesenha o personagem na nova posição

        // Atualiza a posição com base na velocidade
        this.position.x += this.velocidade.x
        this.position.y += this.velocidade.y

        // Verifica se o personagem está no chão
        if (this.position.y + this.height + this.velocidade.y >= canvas.height){
            this.velocidade.y = 0; // Para a queda (velocidade vertical = 0)
        } else
            // Aplica a gravidade se o personagem não estiver no chão
            this.velocidade.y += gravidade 
    }
}

// Criando o jogador - Posições iniciais
const jogador = new Sprite({
    position:{ // Posição inicial (canto superior esquerdo)
    x: 0,
    y: 0
    },
    velocidade:{ // Velocidade inicial (parado)
        x: 0,
        y: 0
    }
});

// Criando o inimigo
const inimigo = new Sprite({
position:{ // Posição inicial do inimigo
    x: 400,
    y: 100
    },
    velocidade:{ // Velocidade inicial (parado)
        x: 0,
        y: 0
    }
});

// Definindo o estado das teclas (se estão pressionadas ou não)
const teclas = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{ // Tecla de pulo do jogador
        pressed: false
    },

    // teclas do inimigo
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
    ArrowUp:{ // Tecla de pulo do inimigo
        pressed: false
    }
}
// Variável global para a última tecla horizontal pressionada do jogador
let ultimatecla

// Função principal de animação do jogo (Loop do Jogo)
function animacao(){
    // Solicita ao navegador para chamar 'animacao' novamente no próximo quadro
    window.requestAnimationFrame(animacao)
    console.log('Rodando')
    
    // Redesenha o fundo a cada quadro (limpa a tela)
    layout.fillStyle = 'black'
    layout.fillRect(0, 0, canvas.width, canvas.height) 
    
    // Atualiza a posição e desenha os personagens
    jogador.atualiza() 
    inimigo.atualiza() 

    // --- Lógica de Movimento Horizontal do Jogador ---
    jogador.velocidade.x = 0 // Reseta a velocidade horizontal do jogador

    // Move para a esquerda se 'a' estiver pressionada E for a última tecla pressionada
    if(teclas.a.pressed && ultimatecla === 'a'){
        jogador.velocidade.x = -1
    // Move para a direita se 'd' estiver pressionada E for a última tecla pressionada
    }else if(teclas.d.pressed && ultimatecla === 'd'){
        jogador.velocidade.x = 1
    }

    // --- Lógica de Movimento Horizontal do Inimigo ---
    inimigo.velocidade.x = 0 // Reseta a velocidade horizontal do inimigo

    // Move para a esquerda se 'ArrowLeft' estiver pressionada E for a última tecla pressionada
    if(teclas.ArrowLeft.pressed && inimigo.ultimatecla === 'ArrowLeft'){
        inimigo.velocidade.x = -1
    // Move para a direita se 'ArrowRight' estiver pressionada E for a última tecla pressionada
    }else if(teclas.ArrowRight.pressed && inimigo.ultimatecla === 'ArrowRight'){
        inimigo.velocidade.x = 1
    }
}

// Inicia o loop de animação
animacao()

// Adiciona um evento para detectar o pressionamento de teclas
window.addEventListener('keydown', (event) =>{
    switch (event.key){
        // --- Controles do Jogador ---
        case 'd':
        teclas.d.pressed = true // Marca 'd' como pressionada
        ultimatecla = 'd' // Define 'd' como a última tecla horizontal pressionada
        break
        case 'a':
        teclas.a.pressed = true // Marca 'a' como pressionada
        ultimatecla = 'a' // Define 'a' como a última tecla horizontal pressionada
        break
        case 'w': // Pulo
        jogador.velocidade.y = -10 // Aplica uma velocidade vertical negativa (para cima)
        break

        // --- Controles do Inimigo ---
        case 'ArrowRight':
        teclas.ArrowRight.pressed = true 
        inimigo.ultimatecla = 'ArrowRight'
        break
        case 'ArrowLeft':
        teclas.ArrowLeft.pressed = true 
        inimigo.ultimatecla = 'ArrowLeft'
        break
        case 'ArrowUp': // Pulo
        inimigo.velocidade.y = -10
        break
    }
    console.log(event.key) // Exibe a tecla pressionada no console
});

// Adiciona um evento para detectar quando uma tecla é solta
window.addEventListener('keyup', (event) =>{
    switch (event.key){
        // --- Controles do Jogador ---
        case 'd':
        teclas.d.pressed = false // Marca 'd' como NÃO pressionada (para movimento parar)
        break
        case 'a':
        teclas.a.pressed = false // Marca 'a' como NÃO pressionada
        break

        // --- Controles do Inimigo ---
        case 'ArrowRight':
        teclas.ArrowRight.pressed = false 
        break
        case 'ArrowLeft':
        teclas.ArrowLeft.pressed = false 
        break
        
    }
    console.log(event.key) // Exibe a tecla solta no console
});