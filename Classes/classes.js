//Classe base para o background
class Sprite {
    // O construtor recebe as propriedades iniciais de posição e imagem
    constructor({position, imageSrc}) {
        this.position = position
        this.width = 50
        this.height = 150 // Altura padrão do personagem
        this.image = new Image() //linhas para insercao de img de fundo
        this.image.src = imageSrc
    }

    // Método para desenhar a imagem de fundo
    draw(){
        layout.drawImage(this.image, this.position.x, this.position.y)
    }
    // Método para atualizar a posição do personagem a cada quadro de animação
    atualiza(){
        this.draw() // Redesenha o personagem na nova posição
    }
}

// Classe base para os personagens (Jogador e Inimigo)
class Lutador { 
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
        if (this.position.y + this.height + this.velocidade.y >= canvas.height - 96){ //define ate onde o jogador vai cair no inicio
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