// Instanciando o canvas
const canvas = document.querySelector('canvas'); // Seleciona o elemento <canvas> no HTML
// Obtém o contexto 2D para desenhar no canvas
const layout = canvas.getContext('2d'); // Pega o "pincel" 2D para desenhar no canvas

// Define a largura e altura do canvas (resolução do jogo)
canvas.width = 1024; // Define a largura da tela de jogo
canvas.height = 576; // Define a altura da tela de jogo

// Desenha um retângulo preto inicial no canvas
layout.beginPath();
layout.fillRect(0, 0, canvas.width, canvas.height); // Desenha um retângulo preto que cobre toda a tela (0,0 é o canto superior esquerdo)
layout.closePath();

//Aplicando gravidade nos jogadores
const gravidade = 0.7 // Define a força da gravidade que puxará os objetos para baixo

//Imagem de fundo
const background = new Sprite({ // Cria um novo objeto Sprite para a imagem de fundo
    position: {
        x: 0,
        y: 0
    },
    imageSrc: '../img/background.png' // Caminho para a imagem de fundo
})

//Imagem da casa
const casa = new Sprite({ // Cria um novo objeto Sprite para a imagem da casa/loja
    position: {
        x: 600,
        y: 128
    },
    imageSrc: '../img/shop.png', // Caminho para a imagem da loja
    scale: 2.75, // Escala a imagem (aumenta o tamanho)
    framesMax: 6 // Indica que essa imagem tem 6 quadros (para animação)
})


// Criando o jogador - Posições iniciais
const jogador = new Lutador({ // Cria o primeiro Lutador (o jogador)
    position:{ // Posição inicial (canto superior esquerdo)
    x: 0,
    y: 0
    },
    velocidade:{ // Velocidade inicial (parado)
        x: 0,
        y: 0
    },
    offset: { // Deslocamento para ajuste de posição (será sobrescrito abaixo)
        x:0,
        y:0
    },
    imageSrc: '../img/samuraiMack/Idle.png', // Imagem inicial (parado)
    framesMax: 8, // Máximo de quadros de animação para a imagem inicial
    scale: 2.5, // Escala o personagem
    offset:{ // Novo deslocamento para centralizar a imagem/caixa de colisão
        x: 210,
        y: 157
    },
    sprites: { // Define as diferentes imagens (sprites) para cada estado do jogador
      idle: { // Estado Parado
        imageSrc: '../img/samuraiMack/Idle.png',
        framesMax: 8
      },
      run: { // Estado Correndo
        imageSrc: '../img/samuraiMack/Run.png',
        framesMax: 8
      },
      jump: { // Estado Pulando
        imageSrc: '../img/samuraiMack/Jump.png',
        framesMax: 8
      }
    }
});

// Criando o inimigo
const inimigo = new Lutador({ // Cria o segundo Lutador (o inimigo)
position:{ // Posição inicial do inimigo
    x: 400,
    y: 100
    },
    velocidade:{ // Velocidade inicial (parado)
        x: 0,
        y: 0
    },
    color: 'blue', // Define uma cor (provavelmente para o retângulo de colisão se não tiver imagem)
    offset: {
        x: -50, // Ajusta a posição do inimigo
        y: 0
    }
    
});

// Definindo o estado das teclas (se estão pressionadas ou não)
const teclas = { // Objeto que rastreia o estado de pressionamento de cada tecla
    a:{
        pressed: false // 'a' não está pressionada inicialmente
    },
    d:{
        pressed: false // 'd' não está pressionada
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
// Variável global para a última tecla horizontal pressionada do jogador (não está declarada aqui, mas é usada nos lutadores)

diminuicaoTempo() // Função (não definida aqui) que deve iniciar a contagem regressiva/cronômetro do jogo

// Função principal de animação do jogo (Loop do Jogo)
function animacao(){
    // Solicita ao navegador para chamar 'animacao' novamente no próximo quadro
    window.requestAnimationFrame(animacao) // Cria um loop infinito para o jogo rodar
    //console.log('Rodando')
    
    // Redesenha o fundo a cada quadro (limpa a tela)
    layout.fillStyle = 'black'
    layout.fillRect(0, 0, canvas.width, canvas.height) // Limpa a tela desenhando um fundo preto (embora o background e a casa sejam desenhados logo abaixo)
    background.atualiza() // Desenha o fundo e atualiza sua animação (se houver)
    casa.atualiza() // Desenha a casa e atualiza sua animação
    
    // Atualiza a posição e desenha os personagens
    jogador.atualiza() // Move o jogador e aplica a gravidade
    //inimigo.atualiza() // Move o inimigo e aplica a gravidade (está comentado, mas provavelmente deveria estar ativo)

    // --- Lógica de Movimento Horizontal do Jogador ---
    jogador.velocidade.x = 0 // Reseta a velocidade horizontal do jogador a cada quadro
    inimigo.velocidade.x = 0 // Reseta a velocidade horizontal do inimigo

    // Move para a esquerda se 'a' estiver pressionada E for a última tecla pressionada
    jogador.switchSprite('idle') // Assume que o jogador está parado por padrão
    if(teclas.a.pressed && jogador.ultimatecla === 'a'){
        jogador.velocidade.x = -5 // Move para a esquerda
        jogador.switchSprite('run') // Muda para a animação de corrida
    // Move para a direita se 'd' estiver pressionada E for a última tecla pressionada
    }else if(teclas.d.pressed && jogador.ultimatecla === 'd'){
        jogador.velocidade.x = 5 // Move para a direita
        jogador.switchSprite('run') // Muda para a animação de corrida
    }
    // Lógica para mudar para o sprite de pulo
    if (jogador.velocidade.y < 0){ // Se a velocidade vertical for negativa, está subindo (pulando)
        jogador.switchSprite('jump') // Muda para a animação de pulo
    }

    // Move para a esquerda/direita do inimigo (Lógica idêntica à do jogador)
    if(teclas.ArrowLeft.pressed && inimigo.ultimatecla === 'ArrowLeft'){
        inimigo.velocidade.x = -5
    // Move para a direita se 'ArrowRight' estiver pressionada E for a última tecla pressionada
    }else if(teclas.ArrowRight.pressed && inimigo.ultimatecla === 'ArrowRight'){
        inimigo.velocidade.x = 5
    }

    //detecta colisoes (ataques) do jogador
    if (
        ColisaoRetangular({ // Chama a função para verificar se o retângulo de ataque do jogador colidiu com o inimigo
            retangulo1: jogador,
            retangulo2: inimigo
        }) &&
        jogador.atacando // Verifica se o jogador está no estado de ataque
    ){
        jogador.atacando = false // Desativa o ataque após a colisão
        inimigo.saude -= 20 // Subtrai 20 pontos de vida do inimigo
        document.querySelector('#saude_inimigo').style.width = inimigo.saude + '%' // Atualiza visualmente a barra de vida do inimigo
    }

    if (
        ColisaoRetangular({ // Chama a função para verificar se o retângulo de ataque do inimigo colidiu com o jogador
            retangulo1: inimigo,
            retangulo2: jogador
        }) &&
        inimigo.atacando // Verifica se o inimigo está no estado de ataque
    ){
        inimigo.atacando = false // Desativa o ataque do inimigo
        jogador.saude -= 20 // Subtrai 20 pontos de vida do jogador
        document.querySelector('#saude_jogador').style.width = jogador.saude + '%' // Atualiza visualmente a barra de vida do jogador
    }
    // fim do jogo baseado na vida
if (inimigo.saude <=0 || jogador.saude <=0){ // Verifica se a vida de algum personagem chegou a zero
    determinaVencedor({jogador, inimigo, timerId}) // Função (não definida aqui) que para o jogo e declara o vencedor
}
}


// Inicia o loop de animação
animacao() // Primeira chamada que inicia o loop infinito do jogo

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
    case ' ': // Ataque (tecla Espaço)
        jogador.ataque() // Chama o método de ataque do jogador (não definido aqui)
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
    case 'ArrowUp': // Pulo do inimigo
        inimigo.velocidade.y = -20
        break

    case 'ArrowDown': // Ataque inimigo
        inimigo.atacando = true // Define o estado de ataque do inimigo como ativo
        break
    }
    
    //console.log(event.key) // Exibe a tecla pressionada no console
});

// Adiciona um evento para detectar quando uma tecla é solta
window.addEventListener('keyup', (event) =>{
    switch (event.key){
        // --- Controles do Jogador ---
        case 'd':
        teclas.d.pressed = false // Quando 'd' é solta, para de marcar como pressionada
        break
        case 'a':
        teclas.a.pressed = false // Quando 'a' é solta, para de marcar como pressionada
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