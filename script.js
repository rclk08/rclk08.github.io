// Begriffe
const terms = {
  de: [
    "Auto","Haus","Schule","Supermarkt","Zug","Fahrrad","Computer","Telefon","Arzt","Krankenhaus",
    "Pizza","Buch","Stuhl","Tisch","Fernseher","Lampe","Katze","Hund","Vogel","Flugzeug",
    "Kino","Schwimmbad","Park","Superheld","Schuhe","Jacke","Brille","Eis","Schokolade","Ball",
    "Stadium","Bank","Restaurant","Café","Taxi","Bus","Polizei","Feuerwehr","Schiff",
    "Brücke","Straße","Ampel","Museum","Theater","Musik","Kamera","Bleistift","Uhr","Buchladen"
  ],
  tr: [
    "Araba","Ev","Okul","Market","Tren","Bisiklet","Bilgisayar","Telefon","Doktor","Hastane",
    "Pizza","Kitap","Sandalye","Masa","Televizyon","Lamba","Kedi","Köpek","Kuş","Uçak",
    "Sinema","Yüzme havuzu","Park","Süper kahraman","Ayakkabı","Ceket","Gözlük","Dondurma","Çikolata","Top",
    "Stadyum","Banka","Restoran","Kafe","Taksi","Otobüs","Polis","İtfaiye","Gemi",
    "Köprü","Sokak","Trafik ışığı","Müze","Tiyatro","Müzik","Kamera","Kurşun kalem","Saat","Kitapçı"
  ]
};


const imposterText = { de: "Imposter", tr: "İmpostor" };

let currentLanguage = "de";
let roles = [];
let chosenTerm = "";
let usedTerms = [];  // bereits genutzte Begriffe pro Runde
let currentPlayerIndex = 0;
let totalPlayers = 0;

// Elemente
const settingsDiv = document.getElementById("settings");
const languageSelect = document.getElementById("languageSelect");
const playerCountInput = document.getElementById("playerCount");
const imposterCountInput = document.getElementById("imposterCount");
const startBtn = document.getElementById("startBtn");
const infoText = document.getElementById("infoText");

const gameArea = document.getElementById("gameArea");
const cardsContainer = document.getElementById("cardsContainer");
const playerInfo = document.getElementById("playerInfo");
const startMessage = document.getElementById("startMessage");
const displayText = document.getElementById("displayText");
const card = document.getElementById("card");
const cardHint = document.getElementById("cardHint");
const nextBtn = document.getElementById("nextBtn");

const endButtons = document.getElementById("endButtons");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");

// Sprache
languageSelect.addEventListener("change", e => currentLanguage = e.target.value);

// Shuffle
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
}

// Spiel initialisieren
function initializeGame(){
  const players = +playerCountInput.value;
  const imposters = +imposterCountInput.value;

  if(players<3 || imposters<1 || imposters>=players){
    infoText.textContent="Ungültige Eingaben.";
    return false;
  }

  totalPlayers = players;

  // Neuen Begriff für die Runde wählen
  pickNewTerm();

  // Rollen erstellen
  roles = [];
  for(let i=0;i<imposters;i++) roles.push("imposter");
  for(let i=0;i<players-imposters;i++) roles.push("normal");
  shuffle(roles);

  currentPlayerIndex = 0;

  return true;
}

// Neuen Begriff für die Runde auswählen (kein Repeat bis alle durch)
function pickNewTerm(){
  const availableTerms = terms[currentLanguage].filter(t => !usedTerms.includes(t));

  if(availableTerms.length === 0){
    // Alle Begriffe waren schon dran → Reset
    usedTerms = [];
    pickNewTerm();
    return;
  }

  const index = Math.floor(Math.random() * availableTerms.length);
  chosenTerm = availableTerms[index];
  usedTerms.push(chosenTerm);
}

// Start Button
startBtn.addEventListener("click", () => {
  if(!initializeGame()) return;

  settingsDiv.classList.add("hidden");
  infoText.textContent="";
  gameArea.classList.remove("hidden");
  endButtons.classList.add("hidden");

  showPlayer();
});

// Spieler anzeigen
function showPlayer(){
  if(currentPlayerIndex>=roles.length){
    // Alle Spieler fertig → Fade-Out Kartencontainer
    cardsContainer.classList.add("fade-out");

    setTimeout(() => {
      cardsContainer.classList.add("hidden");
      cardsContainer.classList.remove("fade-out");

      const startingPlayerIndex = Math.floor(Math.random() * totalPlayers);
      startMessage.textContent = `Viel Spaß beim Diskutieren!\nSpieler ${startingPlayerIndex+1} startet die Runde.`;
      startMessage.classList.add("fade-in");
      startMessage.classList.remove("hidden");

      endButtons.classList.add("fade-in");
      endButtons.classList.remove("hidden");

      nextBtn.style.display = "none";
    }, 500);

    return;
  }

  // Pop-Up Animation
  cardsContainer.classList.remove("pop-up");
  void cardsContainer.offsetWidth;
  cardsContainer.classList.add("pop-up");

  playerInfo.textContent = `Spieler ${currentPlayerIndex+1}`;
  playerInfo.classList.remove("hidden");
  card.classList.remove("hidden");
  startMessage.classList.add("hidden");
  cardsContainer.classList.remove("hidden");
  endButtons.classList.add("hidden");

  // Begriff/Imposter setzen
  displayText.textContent = roles[currentPlayerIndex]==="imposter"?imposterText[currentLanguage]:chosenTerm;
  displayText.classList.add("text-hidden");
  displayText.classList.remove("text-fade-in");
  cardHint.style.display="block";

  // Weitergeben deaktiviert bis Klick
  nextBtn.disabled = true;
  nextBtn.style.display = "inline-block";

  // Prüfen: letzter Spieler?
  if(currentPlayerIndex === roles.length - 1){
    nextBtn.textContent = "Runde starten";
  } else {
    nextBtn.textContent = "Weitergeben";
  }
}

// Klick auf Karte → Text sichtbar, Weitergeben aktivieren
card.addEventListener("click", ()=>{
  displayText.classList.remove("text-hidden");
  displayText.classList.add("text-fade-in");
  cardHint.style.display="none";

  nextBtn.disabled = false;
});

// Weitergeben
nextBtn.addEventListener("click", ()=>{
  currentPlayerIndex++;
  showPlayer();
});

// Spiel neu starten
restartBtn.addEventListener("click", ()=>{
  if(!initializeGame()) return;

  endButtons.classList.add("hidden");
  startMessage.classList.add("hidden");
  startMessage.classList.remove("fade-in");

  cardsContainer.classList.remove("hidden");
  cardsContainer.classList.add("fade-in");

  showPlayer();
});

// Zum Hauptmenü
menuBtn.addEventListener("click", ()=>{
  settingsDiv.classList.remove("hidden");
  gameArea.classList.add("hidden");
  endButtons.classList.add("hidden");
  startMessage.classList.remove("fade-in");
});
