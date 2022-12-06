const image = document.querySelectorAll("img");
const nbImage = image.length;
const button = document.getElementById("boutton")
const réponse = document.getElementById("reponse")
const réponse_en_un_mot = document.getElementById("reponseEnUnMot")
const mot_à_trouver = document.getElementById("mot")
const recommencer = document.getElementById("recommencer")
const ipt_lettre = document.getElementById("input")
const ipt_mot = document.getElementById("input2")
const mode_facile = document.getElementById("facile")
const mode_normal = document.getElementById("normal")
const mode_difficile = document.getElementById("difficile")
const regle = document.getElementById("regle")

recommencer.style.display = "none"
button.style.display = "none"
réponse.style.display = "none"
réponse_en_un_mot.style.display = "none"
ipt_lettre.style.display = "none"
ipt_mot.style.display = "none"
mot_à_trouver.style.display = "none"

let count = 0
let coup = 0
let mauvaisPoint = 0
let exclu = []
let bonneRéponse = []
let hardmode = false

const mots = [
    "soleil","arbre","oiseau","galaxie","espace","jeux","mario","zelda","homme","israel","anticonstitutionellement","macron",
    "pendu","araignée","mygale","zoo","chips","ordinateur","robin","spiderman","saitama","nsi","discord","internet","nébuleuse","playstation",
    "skyrim","justin"];

const indices = [
    "Astre","Nature","Volatile","Grand objet spacial","Endroit dans lequel nous nous trouvons", "Le pendu est un..",
    "Personnage de JV connu","Personnage féminin Nintendo", "Synonyme de être humain","Pays", "Mot long FR",
    "Président", "Ce jeu", "Arachnides", "Arachnides", "On peut y voir des animaux", "Malbouffe", 
    "T'es sur un...", "Prénom","Super-Héros","Perso de manga", "Matière", "Application", "Réseau", "Phénomène spatial", "Console","Open-World",
    "Un gars de la TG5"]

const caracteresInterdits = [",","!","$","*","%","§",".","^","=","}","{","#","~","&","(",")","'","`","£","¨","[","]",'"',"|","+","-","/"," "]

let lemot = mots[Math.floor(Math.random()*mots.length)]
const tailleMot = lemot.length
let lettres = [""]
let lettres_à_trouver = "" //celui qui va être affiché sur la page, car si on affiche un tab en html chaque élem est séparé par des virgules 
                           //et c'est moche (ex : on aura _,_,_,_,_, à la place de _ _ _ _ _)
let lettres_à_trouver_tab = [] //servira pour la fonction compléter


for (let i=0; i < tailleMot; i++ ){
        lettres[i] = lemot[i]
        lettres_à_trouver += " _ "
        lettres_à_trouver_tab.push(" _ ")
        document.getElementById("mot").innerHTML = lettres_à_trouver
    }

for(let i =0; i < tailleMot; i++){
    if(lettres[i] == " "){
        lettres.splice(i,1)
    }
}

console.log(lettres)

///////////////////////////////////////////////////////////////////////////////////////////////////////

function ActivationModeFacile(){
    hardmode = false
    mot_à_trouver.style.display = "block"
    document.getElementById("indice").innerHTML = `Indice : ${indices[mots.indexOf(lemot)]}`
    ActivationElements()

}

function ActivationModeDifficile(){
    hardmode = true
    mot_à_trouver.style.display = "none"
    ActivationElements()
}

function ActivationModeNormal(){
    mot_à_trouver.style.display = "block"
    ActivationElements()
}

function ActivationElements(){
    mode_facile.style.display = "none"
    mode_normal.style.display = "none"
    mode_difficile.style.display = "none"
    regle.style.display = "none"
    button.style.display = "block"
    réponse.style.display = "block"
    réponse_en_un_mot.style.display = "block"
    ipt_lettre.style.display = "block"
    ipt_mot.style.display = "block"
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function jeu(){

    let réponseInsérer = réponse.value.toLowerCase();

    if(réponse_en_un_mot.value.toLowerCase() != ""){
        if(réponse_en_un_mot.value.toLowerCase() == lemot){
            coup++
            check = true
            win()
        }
        else{
            mauvaisPoint++
            change()
        }
    }

    if(doublons(lettres,bonneRéponse) === true){
        win()
    }

    if(lettres.indexOf(réponseInsérer) == -1){ //Si == -1, alors la lettre qu'on a inséré n'est pas dans le tableau lettres.
        if(exclusion(réponseInsérer) === true){ //Si on a déjà écrit cette lettre (qui est fausse) : prévenir le joueur
            console.log("ça y est déjà")
        }
        else if(réponseInsérer != "" && caracteresInterdits.indexOf(réponseInsérer) == -1){
            console.log("test")
            mauvaisPoint++
            change()
        }
    }

    if(mauvaisPoint == 9){
        button.parentNode.removeChild(button)
        recommencer.style.display = "block"
        document.getElementById("res").innerHTML = `Le mot a trouvé était ${lemot}`
    }

    if(exclusion(réponseInsérer) === true){
        console.log("ça y est déjà")
    }else{
        for(i=0; i<tailleMot; i++){
            if(réponseInsérer == lettres[i]){
                exclusion(réponseInsérer)
                bonneRéponse.push(réponseInsérer)
                if(hardmode === false){
                    compléter(lettres[i])
                }
                break
            }
        }
    }
    
}

function change(){
    ///permet de changer d'étapes du pendu
    image[count].classList.remove('active');

    if(count < nbImage - 1){
        count++
    }
    image[count].classList.add('active')
}

function exclusion(lettre){
    ///prend un str en entrée, vérifie s'il se trouve dans le tableau "exclu" si c'est le cas renvoi true sinon le met dans exclu
    if(exclu.indexOf(lettre) !== -1){
        return true
    }else if(lettre != ""  && caracteresInterdits.indexOf(lettre) == -1){
        exclu.push(lettre)
        document.getElementById("lettresTrouvées").innerHTML = `Lettres utilisées : ${exclu}`
        return exclu
    }
}


function compléter(lettre){
    ///prend un str en entrée, cherche si ce str se trouve dans lettres et si c'est vrai alors il va remplacer lettres_à_trouver_tab[i] par ce
    ///str autant de fois qu'il apparaît dans lettres, puis il va mettre à jour lettre_à_trouver afin de l'insérer dans le html.
    lettres_à_trouver = ""
    for(i=0; i<tailleMot ;i++){
        if(lettres[i] == lettre){
            lettres_à_trouver_tab[i] = lettres[i]
            }
        } 
    for(i=0; i<tailleMot; i++){
        lettres_à_trouver += lettres_à_trouver_tab[i]
        document.getElementById("mot").innerHTML = lettres_à_trouver
    }
}


function doublons(tab,tab2){
    ///Prend 2 tableaux en entrée, supprime les doublons du premier
    ///si la taille du tableau sans doublons == taille du deuxième tableau : return true
    const uniqueSet = new Set(tab)
    const unique = [...uniqueSet] ///on veut un tableau array, et non un "set"
    if(unique.length == tab2.length){
        return true
    }
}

function win(){
    ///Ne prend rien en entrée, supprime le bouton de réponse et affiche le score du joueur
    button.parentNode.removeChild(button)
    recommencer.style.display = "block"
    lettres_à_trouver = lemot
    document.getElementById("mot").innerHTML = lettres_à_trouver
    document.getElementById("res").innerHTML = `Bravo ! Tu as trouvé le mot ${lemot} en ${exclu.length+coup} coup(s) ! `
}

button.addEventListener('click',jeu)
mode_facile.addEventListener('click',ActivationModeFacile) //active le mode facile
mode_normal.addEventListener('click',ActivationModeNormal) //active le mode normal
mode_difficile.addEventListener('click',ActivationModeDifficile) //active le mode difficile