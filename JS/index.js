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

// Classe base para os personagens (Jogador e Inimigo)
class Sprite {
    // O construtor recebe as propriedades iniciais de posição e velocidade
    constructor({position, velocidade, color = 'red', offset}) {
        this.position = position
        this.velocidade = velocidade
        this.width = 50
        this.height = 150 // Altura padrão do personagem
        this.ultimatecla // Variável para rastrear a última tecla de movimento horizontal pressionada (para movimento contínuo)
        this.attackBox = { //inicio function ataque
            position: {
                x:this.position.x,
                y: this.position.y
            },
            offset, //offset: offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.atacando
        this.saude = 100
    }

    // Método para desenhar o personagem
    draw(){
        layout.beginPath();
        layout.fillStyle = this.color // Cor do personagem
        // Desenha o retângulo do personagem
        layout.fillRect(this.position.x, this.position.y, this.width, this.height);
        layout.closePath();

        // attack box
        if (this.atacando) {
        layout.fillStyle = "green"
        layout.fillRect(this.attackBox.position.x, 
            this.attackBox.position.y, 
            this.attackBox.width, 
            this.attackBox.height
        )
        }
    }

    // Método para atualizar a posição do personagem a cada quadro de animação
    atualiza(){
        this.draw() // Redesenha o personagem na nova posição
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x //Atualiza posicao da ferramenta de ataque 
        this.attackBox.position.y = this.position.y
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
    ataque() {
    this.atacando = true
    setTimeout(() => {
        this.atacando = false
    }, 100)
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
    },
    offset: {
        x:0,
        y:0
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

function ColisaoRetangular({ retangulo1, retangulo2 }) { //funcao de colisoes (ataques)
    return(
        retangulo1.attackBox.position.x + retangulo1.attackBox.width >=
        retangulo2.position.x && retangulo1.attackBox.position.x <= retangulo2.position.x + retangulo2.width &&
        retangulo1.attackBox.position.y + retangulo1.attackBox.height >= retangulo2.position.y &&
        retangulo1.attackBox.position.y <= retangulo2.position.y + retangulo2.height 
    )
}

// Função principal de animação do jogo (Loop do Jogo)
function animacao(){
    // Solicita ao navegador para chamar 'animacao' novamente no próximo quadro
    window.requestAnimationFrame(animacao)
    //console.log('Rodando')
    
    // Redesenha o fundo a cada quadro (limpa a tela)
    layout.fillStyle = 'black'
    layout.fillRect(0, 0, canvas.width, canvas.height) 
    
    // Atualiza a posição e desenha os personagens
    jogador.atualiza() 
    inimigo.atualiza() 

    // --- Lógica de Movimento Horizontal do Jogador ---
    jogador.velocidade.x = 0 // Reseta a velocidade horizontal do jogador
    inimigo.velocidade.x = 0

    // Move para a esquerda se 'a' estiver pressionada E for a última tecla pressionada
    if(teclas.a.pressed && ultimatecla === 'a'){
        jogador.velocidade.x = -5
    // Move para a direita se 'd' estiver pressionada E for a última tecla pressionada
    }else if(teclas.d.pressed && ultimatecla === 'd'){
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