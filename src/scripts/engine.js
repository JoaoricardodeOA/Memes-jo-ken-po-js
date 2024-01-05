const state = {
    score:{
        playerScore:0,
        computerScore:0,
        scoreBox:document.getElementById("score_points")
    },
    cardSprites:{
        avatar:document.getElementById("card-image"),
        name:document.getElementById("card-name"),
        type:document.getElementById("card-type")
    },
    fieldsCards:{
        player:document.getElementById("player-field-card"),
        player:document.getElementById("computer-field-card"),
    },
    actions:{
        button:document.getElementById("next-duel")
    }
}
const playerSides ={
    player1:"player-cards",
    computer:"computer-cards"
}

const pathImages = './src/assets/icons/'

const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf:[1],
        loseOf:[2]
    },
    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf:[2],
        loseOf:[0]
    },
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf:[0],
        loseOf:[1]
    }
]

async function getRandomIdCard(){
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

async function createCardImage(idCard, fieldSide){
    const cardImage = document.createElement("img")
    cardImage.setAttribute("height","100px")
    cardImage.setAttribute("src",`${pathImages}card-back.png`)
    cardImage.setAttribute("data-id",idCard)
    cardImage.classList.add("card")

    if(fieldSide===playerSides.player1){
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"))
        })     

        cardImage.addEventListener("mouseover",()=>{
            drawSelectedCard(idCard) 
         })
    }

    

    return cardImage
}

async function setCardsField(idCard){
    await removeAllCardsImage()
    let idComputerCard = await getRandomIdCard()

    state.fieldsCards.player.style.display = "block"
    state.fieldsCards.computer.style.display = "block"

    state.fieldsCards.player.src = cardData[idCard].img
    state.fieldsCards.computer.src = cardData[idComputerCard].img

    let duelResults = await checkDuelresults(idCard,idComputerCard)
}

async function drawSelectedCard(idCard){
    state.cardSprites.avatar.src = cardData[idCard].img
    state.cardSprites.name.innerText  = cardData[idCard].name
    state.cardSprites.type.innerText = `Atribute: ${cardData[idCard].type}` 
}


async function drawCards(cardNumbers,fieldSide){
    for (let i = 0; i<cardNumbers;i++){
        const randomIdCard = await getRandomIdCard()
        const cardImage = await createCardImage(randomIdCard, fieldSide)


        document.getElementById(fieldSide).appendChild(cardImage)
    }
}


function init(){
    drawCards(5,playerSides.player1)
    drawCards(5,playerSides.computer)
}

init()