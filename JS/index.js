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
const gravidade = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: '/img/background.png'
})

// Criando o jogador - Posições iniciais
const jogador = new Lutador({
    position:{ // Posição inicial (canto superior esquerdo)
    x: 0,
    y: 0
    },
    velocidade:{ // Velocidade inicial (parado)
        x: 0,
        y: 0
    },
    offset: {
        x:0,
        y:0
    }
});

// Criando o inimigo
const inimigo = new Lutador({
position:{ // Posição inicial do inimigo
    x: 400,
    y: 100
    },
    velocidade:{ // Velocidade inicial (parado)
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
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

diminuicaoTempo()

// Função principal de animação do jogo (Loop do Jogo)
function animacao(){
    // Solicita ao navegador para chamar 'animacao' novamente no próximo quadro
    window.requestAnimationFrame(animacao)
    //console.log('Rodando')
    
    // Redesenha o fundo a cada quadro (limpa a tela)
    layout.fillStyle = 'black'
    layout.fillRect(0, 0, canvas.width, canvas.height) 
    background.atualiza()
    
    // Atualiza a posição e desenha os personagens
    jogador.atualiza() 
    inimigo.atualiza() 

    // --- Lógica de Movimento Horizontal do Jogador ---
    jogador.velocidade.x = 0 // Reseta a velocidade horizontal do jogador
    inimigo.velocidade.x = 0

    // Move para a esquerda se 'a' estiver pressionada E for a última tecla pressionada
    if(teclas.a.pressed && jogador.ultimatecla === 'a'){
        jogador.velocidade.x = -5
    // Move para a direita se 'd' estiver pressionada E for a última tecla pressionada
    }else if(teclas.d.pressed && jogador.ultimatecla === 'd'){
        jogador.velocidade.x = 5
    }

    // --- Lógica de Movimento Horizontal do Inimigo ---
    inimigo.velocidade.x = 0 // Reseta a velocidade horizontal do inimigo

    // Move para a esquerda se 'ArrowLeft' estiver pressionada E for a última tecla pressionada
    if(teclas.ArrowLeft.pressed && inimigo.ultimatecla === 'ArrowLeft'){
        inimigo.velocidade.x = -5
    // Move para a direita se 'ArrowRight' estiver pressionada E for a última tecla pressionada
    }else if(teclas.ArrowRight.pressed && inimigo.ultimatecla === 'ArrowRight'){
        inimigo.velocidade.x = 5
    }

    //detecta colisoes (ataques) do jogador
    if (
        ColisaoRetangular({ //chamada de funcao para ataque do jogador
            retangulo1: jogador,
            retangulo2: inimigo
        }) &&
        jogador.atacando
    ){
        jogador.atacando = false
        inimigo.saude -= 20 //cada vez que atacarmos, sera subtraido 20 de vida
        document.querySelector('#saude_inimigo').style.width = inimigo.saude + '%'
    }

    if (
        ColisaoRetangular({ //chamada de funcao para ataque do inimigo
            retangulo1: inimigo,
            retangulo2: jogador
        }) &&
        inimigo.atacando
    ){
        inimigo.atacando = false
        jogador.saude -= 20
        document.querySelector('#saude_jogador').style.width = jogador.saude + '%'
    }
    // fim do jogo baseado na vida
if (inimigo.saude <=0 || jogador.saude <=0){
    determinaVencedor({jogador, inimigo, timerId})
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
        jogador.ultimatecla = 'd' // Define 'd' como a última tecla horizontal pressionada
        break
    case 'a':
        teclas.a.pressed = true // Marca 'a' como pressionada
        jogador.ultimatecla = 'a' // Define 'a' como a última tecla horizontal pressionada
        break
    case 'w': // Pulo
        jogador.velocidade.y = -20 // Aplica uma velocidade vertical negativa (para cima)
        break
    case ' ':
        jogador.ataque()
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
        inimigo.velocidade.y = -20
        break

    case 'ArrowDown': // Ataque inimigo
        inimigo.atacando = true
        break
    }
    
    //console.log(event.key) // Exibe a tecla pressionada no console
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
    //console.log(event.key) // Exibe a tecla solta no console
});