let timesFetched = 0
const poketypesColors = {
    bug : '#acba29',
    dark: '#503d2e',
    dragon: '#7862de',
    electric: '#f5bd2a',
    fairy: '#f4b3f5',
    fighting: '#7d351d',
    fire: '#e23b11',
    flying: '#96a5f8',
    ghost: '#5d5fac',
    grass: '#74bf3e',
    ground: '#cba753',
    ice: '#a5e6f8',
    normal: '#c9c6bf',
    poison: '#964499',
    psychic: '#f34381',
    rock: '#9f853a',
    steel: '#908f9d',
    water: '#3291ef',
    //this is not a type, it's for the error
    void: 'rgba(0,0,0,0)'
}
const pokeImageChange = url => {
    const pokeimg = document.getElementById('pokeimg')
    pokeimg.src = url
}
const pokeNameAndIdDisplayer = (id, name) => {
    const pokeDisplayer = document.getElementById('pokemonIdAndName')
    let textid = ''
    if(id === 0){
        textid = ''
    } else if(id < 10){
        textid = `#00${id}`
    } else if(id < 100){
        textid = `#0${id}`
    } else {
        textid = `#${id}`
    }
    
    let textDisplayed = `${textid}-${name.toUpperCase()}`
    pokeDisplayer.innerHTML = textDisplayed
}
const displayPokeSize = (height, weight)=>{
    const pokeHeightDiv = document.getElementById('pokeheight')
    const pokeWeightDiv = document.getElementById('pokeweight')
    let pokeheightMts = `${height / 10}m`
    let pokeweightMts = `${weight / 10}Kg`

    pokeHeightDiv.innerHTML = `HEIGHT: ${pokeheightMts}`
    pokeWeightDiv.innerHTML = `WEIGHT ${pokeweightMts}`
}
const displayPokeTypes = types => { 
    const poketypesDiv = document.getElementById('poketypes')
    let poketypes = ''

    if(timesFetched > 0){
        const type0 = document.getElementById('type_0')
        const type1 = document.getElementById('type_1')

        if(type0 !== null) type0.remove()
        if(type1 !== null) type1.remove()
    }
    if(types === 'void'){
        return
    }
    for(let i = 0; i<types.length; i++){
        let individType = types[i].type.name
        let paragraph = document.createElement('p')
        paragraph.textContent = individType
        paragraph.id = `type_${i}`
        paragraph.className = `type_${individType.toUpperCase()}`
        paragraph.style.backgroundColor = `${poketypesColors[individType]}`
        poketypesDiv.appendChild(paragraph)
    }
    poketypes = poketypes.trim()
}

const displayPokeStats = (stats)=>{
    if(stats.length === 0){
        statbars = document.getElementsByClassName('stat-bar')
        for(let i=0; i<statbars.length; i++){
            statbars[i].innerHTML = ''
        }
        return
    }
    for(let i=0; i<stats.length; i++){
        //mediaquery, don't remove
        const mediasize = window.matchMedia("(max-width: 768px)")

        let statname = stats[i].stat.name
        //every bar represents 20 stat points, so for making the iterations i will divide the stat size by 20
        let iterations = stats[i].base_stat / 20
        for(let x=0; x < iterations; x++){
            //target the bar in function of the stat name
            let statbar = document.getElementById(`${statname}-bar`)
            let aBar = document.createElement('div')
            aBar.className = 'stat-slice'
            aBar.style.height = '0.75vh'
            aBar.style.width = '2.5vw'
            aBar.style.marginBottom = '0.125rem'
            //in case than the mediaquery matches
            if(mediasize.matches){
                aBar.style.height = '4vh'
                aBar.style.width = '2.5vw'
                aBar.style.marginBottom = '0'
                aBar.style.marginLeft = '0.25rem'
            }
            aBar.style.backgroundColor = 'aquamarine'
            statbar.appendChild(aBar)
        }
    }
}
let pokemoveindex = 0
let pokemovesCopy = []
const displayPokeMoves = (moves, index) => {
    if(!moves.length ){
        return
    }
    const pokemovesDiv = document.getElementById('pokemoves')
    let pokemove = document.createElement('p')
    pokemove.innerText = moves[index].move.name
    pokemove.className = 'pokemove'
    pokemove.style.marginTop = '1.5vh'
    pokemove.style.fontFamily = 'Retro Gaming'
    pokemovesDiv.appendChild(pokemove)
}
const nextMoveBtn = ()=>{
    let pokemove = document.getElementsByClassName('pokemove')
    if(timesFetched > 0 && pokemove.length !== 0){
    pokemove[0].remove()
    }
    if(pokemoveindex < pokemovesCopy.length -1){
        pokemoveindex +=1
        displayPokeMoves(pokemovesCopy, pokemoveindex)
    } else if (pokemoveindex === pokemovesCopy.length -1) {
        pokemoveindex = 0
        displayPokeMoves(pokemovesCopy, pokemoveindex)
    }
}
const prevMoveBtn = ()=>{
    let pokemove = document.getElementsByClassName('pokemove')
    if(timesFetched > 0 && pokemove.length !== 0){
    pokemove[0].remove()
    }
    if(pokemoveindex === 0){
        pokemoveindex = pokemovesCopy.length -1
        displayPokeMoves(pokemovesCopy, pokemoveindex)
    } else {
        pokemoveindex -= 1
        displayPokeMoves(pokemovesCopy, pokemoveindex)
    }
}

const pokeFetch = async () => {
    const spaceregex = /\s/g
    const pokeinput = document.getElementById('pokeinput')
    let pokeInputName = pokeinput.value
    pokeInputName = pokeInputName.toLowerCase()
    pokeInputName =     pokeInputName.replace(spaceregex, '-')

    const url = `https://pokeapi.co/api/v2/pokemon/${pokeInputName}`

    let response = await fetch(url)

    if(!response.ok || !pokeInputName){
        console.log('not found on the pokedex my boy')
        pokeImageChange('./img/missigno.webp')
        pokeNameAndIdDisplayer(0, 'Not Found, try again')
        displayPokeSize(0, 0)
        displayPokeTypes('void')
        displayPokeStats([])
        displayPokeMoves([], 0)
        pokemoveindex = 0
        pokemovesCopy = []
        return
    }
    let pokedata = await response.json()
    //delete every stat bar
    if(timesFetched > 0){
        const artificialStatArr = ['hp', 'attack', 'defense', 'special-attack', 'special-defense','speed']
        for(let i=0; i<artificialStatArr.length; i++){
            let statname = artificialStatArr[i]
            let statbar = document.getElementById(`${statname}-bar`)
            statbar.replaceChildren()
        }
        let pokemove = document.getElementsByClassName('pokemove')
        if(pokemove.length !== 0 && pokemove) {
            pokemove[0].remove()
        }
    }
    let pokeobj = {
        pokeimgUrl : pokedata.sprites.front_default,
        pokename : pokedata.name,
        pokeid : pokedata.id,
        pokeheight : pokedata.height,
        pokeweight : pokedata.weight,
        poketypes : pokedata.types,
        pokestats : pokedata.stats,
        pokemoves : pokedata.moves,
    }
    pokemoveindex = 0
    pokemovesCopy = pokeobj.pokemoves.map(el => el)

    pokeImageChange(pokeobj.pokeimgUrl)
    pokeNameAndIdDisplayer(pokeobj.pokeid, pokeobj.pokename)
    displayPokeSize(pokeobj.pokeheight, pokeobj.pokeweight)
    displayPokeTypes(pokeobj.poketypes)
    displayPokeStats(pokeobj.pokestats)
    displayPokeMoves(pokeobj.pokemoves, 0)

    console.log(pokedata)
    timesFetched += 1
}