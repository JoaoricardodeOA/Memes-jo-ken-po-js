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
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides:{
        player1:"player-cards",
        player1Box:document.querySelector("#player-cards"),
        computer:"computer-cards",
        computerBox:document.querySelector("#computer-cards"),
        
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
        name: "Doge Dog",
        type: "Paper",
        //img: `${pathImages}dragon.png`,
        img: "https://cdn.i-scmp.com/sites/default/files/styles/768x768/public/d8/images/canvas/2023/08/21/c080045a-e333-40c5-aee8-17c42ce9b47e_65e19817.jpg?itok=KNdRuSea&v=1692611441",
        winOf:[1],
        loseOf:[2]
    },
    {
        id:1,
        name: "Nyan Cat",
        type: "Rock",
        //img: `${pathImages}magician.png`,
        img:"https://scontent.frec5-1.fna.fbcdn.net/v/t39.30808-6/339987830_809519707433896_755662950091862691_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=cisGlfXkVdgAX8hTqo3&_nc_ht=scontent.frec5-1.fna&oh=00_AfCeg__cdSPWe5xcsllTy3tPyS_R2QlFW01Cd0JNnWXSJQ&oe=659E84BE",
        winOf:[2],
        loseOf:[0]
    },
    {
        id:2,
        name: "Keyboard Cat",
        type: "Scissors",
        //img: `${pathImages}exodia.png`,
        img: "https://i.kym-cdn.com/entries/icons/facebook/000/000/166/keyboar.jpg",
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
    await removeAllCardsImages()
    let idComputerCard = await getRandomIdCard()

    await showHiddenCardDetails(true)

    await hiddenCardDetails()


    await drawCardsInField(cardData[idCard].img,cardData[idComputerCard].img)

    let duelResults = await checkDuelresults(idCard,idComputerCard)

    await updateScore()
    await drawButton(duelResults)
}

async function drawCardsInField(playerCard,computerCard){
    state.fieldsCards.player.src = playerCard
    state.fieldsCards.computer.src = computerCard
}

async function showHiddenCardDetails(value){
    if(value){
        state.fieldsCards.player.style.display = "block"
        state.fieldsCards.computer.style.display = "block"
    }else{
        state.fieldsCards.player.style.display = "none"
        state.fieldsCards.computer.style.display = "none"
        
    }
}

async function hiddenCardDetails(){
    state.cardSprites.avatar.src = ""
    state.cardSprites.name.innerText = ""
    state.cardSprites.type.innerText = ""
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose : ${state.score.computerScore}`
}

async function  drawButton(duelResults){
    state.actions.button.innerText = duelResults.toUpperCase()
    state.actions.button.style.display = "block"
}


async function checkDuelresults(idCard,idComputerCard){
    state.cardSprites.avatar.classList.remove("show-card")
    state.cardSprites.avatar.style.display = "none"
    let duelResults = "draw"
    let playerCard = cardData[idCard]

    if(playerCard.winOf.includes(idComputerCard)){
        duelResults = "win"
        state.score.playerScore++
    }else if(playerCard.loseOf.includes(idComputerCard)){
        duelResults = "lose"
        state.score.computerScore++
    }
    await playAudio(duelResults)
    return duelResults
}

async function removeAllCardsImages(){
    let {computerBox,player1Box} = state.playerSides
    let imgElements = computerBox.querySelectorAll("img")
    imgElements.forEach((img => img.remove()))


    imgElements = player1Box.querySelectorAll("img")
    imgElements.forEach((img => img.remove()))
}

async function drawSelectedCard(idCard){
    state.cardSprites.avatar.style.display = "block"
    state.cardSprites.avatar.classList.add("show-card")
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
async function resetDuel(){
    state.cardSprites.avatar.src = ""
    state.actions.button.style.display = "none"

    state.fieldsCards.player.style.display = "none"
    state.fieldsCards.computer.style.display = "none"

    init()
}

async function playAudio(status){
    try {
        const audio = new Audio(`./src/assets/audios/${status}.wav`)
        audio.play()
    } catch (error) {
        
    }
}

function init(){
    state.cardSprites.avatar.style.display = "none"
    showHiddenCardDetails(false)

    drawCards(5,playerSides.player1)
    drawCards(5,playerSides.computer)

    const bgm = document.getElementById("bgm")
    bgm.play()
}

init()