//funcao de colisoes (ataques)
function ColisaoRetangular({ retangulo1, retangulo2 }) { 
    return(
        retangulo1.attackBox.position.x + retangulo1.attackBox.width >=
        retangulo2.position.x && retangulo1.attackBox.position.x <= retangulo2.position.x + retangulo2.width &&
        retangulo1.attackBox.position.y + retangulo1.attackBox.height >= retangulo2.position.y &&
        retangulo1.attackBox.position.y <= retangulo2.position.y + retangulo2.height 
    )
}

function determinaVencedor({jogador, inimigo, timerId}){
    clearTimeout(timerId)
    document.querySelector('#resultado').style.display = 'flex' //altera o local de onde vai aparecer o texto de resultado
    
    if (jogador.saude === inimigo.saude) {
        document.querySelector('#resultado').innerHTML = 'Empate'
    } 
    
    else if (jogador.saude > inimigo.saude) {
        document.querySelector('#resultado').innerHTML = 'Player 1 Wins'
    }

    else if (jogador.saude < inimigo.saude) {
        document.querySelector('#resultado').innerHTML = 'Player 2 Wins'
    }
}

//Funcao para diminuir gradativamente o tempo do timer
let timer = 60
let timerId
function diminuicaoTempo(){     
    if (timer>0) {
        timerId = setTimeout(diminuicaoTempo, 1000) //para o tempo quando encerra a luta por esgotamento de vida
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0){
        determinaVencedor({jogador, inimigo, timerId})
    }
}