let lokalizacjaID = ""; // globalna zmienna z ID
let hasloUzytkownika = "";

// 🔥 CZARNY HUMOR – teksty do błędnego hasła
const zleHaslaTeksty = [
  "Nie, nie, nie... To nie jest dobre hasło. Może spróbuj '1234'?",
  "To hasło jest tak błędne, że aż boli bazę danych.",
  "Nie wiem, co wpisałeś, ale Bóg ci wybaczy. Ja nie.",
  "Błąd. Ale przynajmniej nie Radom.",
  "To hasło umarło z samotności.",
  "W tym tempie szybciej trafisz na promocję w Ryanairze.",
  "Czy to hasło było wymyślone po pijaku?",
  "Gdyby to było dobre hasło, życie miałoby sens.",
  "Serio? Jeszcze raz to wpiszesz, a apka sama się zamknie.",
  "To nie hasło, to dramat egzystencjalny.",
  "Firebase właśnie się załamał.",
  "To wygląda jak hasło, które wpisujesz pod przymusem psa."
];

function wrocDoGlownej() {
  zaladujStroneGlowna();
  zastosujMotywZPamieci();

}

function pokazKomunikat(tresc, czas = 3000) {
    const box = document.getElementById("komunikat");
    box.innerText = tresc;
    box.style.display = "block";
  
    setTimeout(() => {
      box.style.display = "none";
    }, czas);
  } 

function submitID() {
  const id = document.getElementById("input-id").value.trim();
  const pass = document.getElementById("input-password").value.trim();
  const error = document.getElementById("login-error");

  if (!id || !pass) {
    error.innerText = "Co to za tajemniczość? Wpisz ID i hasło, Jamesie Bondzie.";
    error.style.display = "block";
    return;
  }

  db.ref(`bazy/${id}/haslo`).once("value").then(snapshot => {
    const hasloWBazie = snapshot.val();

    if (hasloWBazie === null) {
      db.ref(`bazy/${id}/haslo`).set(pass).then(() => {
        error.style.display = "none";
        zaloguj(id, pass);
      }).catch(() => {
        error.innerText = "Firebase mówi 'nie'. Spróbuj jeszcze raz.";
        error.style.display = "block";
      });
    } else if (hasloWBazie === pass) {
      error.style.display = "none";
      zaloguj(id, pass);
    } else {
      const losowyTekst = zleHaslaTeksty[Math.floor(Math.random() * zleHaslaTeksty.length)];
      error.innerText = losowyTekst;
      error.style.display = "block";
    }
  }).catch(err => {
    console.error("Błąd połączenia z Firebase:", err);
    error.innerText = "Ups! Coś poszło bardzo nie tak (albo wybuchł serwer 🔥).";
    error.style.display = "block";
  });
}

function zaloguj(id, pass) {
  lokalizacjaID = id;
  hasloUzytkownika = pass;
  document.getElementById("modal-overlay").style.display = "none";
  document.getElementById("app").style.display = "block";
  zaladujStroneGlowna();
  zastosujMotywZPamieci();

}

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="title-bar">WYCIECZKOMAT</div>
    <div class="button-grid">
      <button onclick="goTo('losuj')">Losuj wycieczkę</button>
      <button onclick="goTo('wylosowane')">Wylosowane</button>
      <button onclick="goTo('odbyte')">Odbyte</button>
      <button onclick="goTo('panel')">Panel roboczy</button>
    </div>
    <div style="margin-top:20px;">
      <button onclick="goTo('ustawienia')">⚙️ Ustawienia</button>
    </div>
  `;
});

function goTo(section) {
    if (section === "panel") {
      zaladujPanelRoboczy();
    } else if (section === "losuj") {
      zaladujKategorieLosowania();
    } else if (section === "wylosowane") {
      zaladujWylosowane();
    } else if (section === "odbyte") {
      zaladujOdbyte();
    } else if (section === "ustawienia") {
      zaladujUstawienia();
    } else {
      alert("Tu będzie widok: " + section);
    }
  }
  
function zaladujStroneGlowna() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="title-bar">WYCIECZKOMAT</div>
    <div class="button-grid">
      <button onclick="goTo('losuj')">Losuj wycieczkę</button>
      <button onclick="goTo('wylosowane')">Wylosowane</button>
      <button onclick="goTo('odbyte')">Odbyte</button>
      <button onclick="goTo('panel')">Panel roboczy</button>
    </div>
    <button class="fab-ustawienia" onclick="goTo('ustawienia')" title="Ustawienia">⚙️</button>
  `;
  zastosujMotywZPamieci();

}

function zaladujPanelRoboczy() {
    const app = document.getElementById("app");
  
    app.innerHTML = `
      <div style="text-align: left; padding: 10px;">
        <button onclick="wrocDoGlownej()">⬅️ Wróć</button>
      </div>
      <div class="title-bar">PANEL ROBOCZY (${lokalizacjaID})</div>
      <div style="display:flex; justify-content:center; margin-top:20px;">
        <div class="dodaj-box">
          <h3>🗺️ Dodaj nową wycieczkę</h3>
  
          <div class="kategorie-przyciski">
            <button onclick="ustawKategorie('jednodniowe')" id="kat-jednodniowe">Jednodniowa</button>
            <button onclick="ustawKategorie('weekendowe')" id="kat-weekendowe">Weekendowa</button>
            <button onclick="ustawKategorie('kilkudniowe')" id="kat-kilkudniowe">Kilkudniowa</button>
            <button onclick="ustawKategorie('wakacyjne')" id="kat-wakacyjne">Wakacyjna</button>
          </div>
  
          <input type="hidden" id="kategoria-wycieczki" value="jednodniowe" />
  
          <input type="text" id="nazwa-wycieczki" placeholder="Np. Tychy, Wrocław..." class="input-wycieczka" />
  
          <button onclick="dodajWycieczke()" class="przycisk-dodaj">➕ Dodaj wycieczkę</button>
  
          <p id="info-dodaj" style="color: green; font-weight: bold; display: none; margin-top: 15px;"></p>
        </div>
      </div>
    `;
    zastosujMotywZPamieci();
  }

  function ustawKategorie(kategoria) {
    document.getElementById("kategoria-wycieczki").value = kategoria;
  
    // Resetuj style wszystkich przycisków
    const przyciski = document.querySelectorAll(".kategorie-przyciski button");
    przyciski.forEach(btn => btn.classList.remove("aktywna-kategoria"));
  
    // Podświetl wybraną kategorię
    document.getElementById("kat-" + kategoria).classList.add("aktywna-kategoria");
  }
  
function dodajWycieczke() {
  const kategoria = document.getElementById("kategoria-wycieczki").value;
  const nazwa = document.getElementById("nazwa-wycieczki").value.trim();
  const info = document.getElementById("info-dodaj");

  if (!nazwa) {
    info.innerText = "Nazwa jest pusta jak Twój portfel po wyjeździe.";
    info.style.color = "red";
    info.style.display = "block";
    return;
  }

  db.ref(`bazy/${lokalizacjaID}/wycieczki/${kategoria}`).push(nazwa)
    .then(() => {
      info.innerText = "Pomyślnie dodano! Pora się spakować 🎒";
      info.style.color = "green";
      info.style.display = "block";
      document.getElementById("nazwa-wycieczki").value = "";
    })
    .catch(() => {
      info.innerText = "Nie udało się. Wycieczka uciekła z bazy.";
      info.style.color = "red";
      info.style.display = "block";
    });
}

function zaladujKategorieLosowania() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div style="text-align: left; padding: 10px;">
      <button onclick="wrocDoGlownej()">⬅️ Wróć</button>
    </div>
    <div class="title-bar">KATEGORIE</div>
    <div class="button-grid">
      <button onclick="pokazEkranLosowania('jednodniowe')">Jednodniowe</button>
      <button onclick="pokazEkranLosowania('weekendowe')">Weekendowe</button>
      <button onclick="pokazEkranLosowania('kilkudniowe')">Kilkudniowe</button>
      <button onclick="pokazEkranLosowania('wakacyjne')">Wakacyjne</button>
    </div>
  `;
  zastosujMotywZPamieci();

}

function pokazEkranLosowania(kategoria) {
  const app = document.getElementById("app");
  const humorTeksty = [
    "UWAGAAAA... coś się kręci w powietrzu 🌪️",
    "Twoja podróż już się czai za rogiem 😈",
    "Ktoś pakuje plecak... to chyba Ty 🎒",
    "Szykuj się, bo zaraz pojedziesz gdzieś, gdzie nie planowałeś 😅",
    "A może Radom? Nie no, żartuję... a może? 👀",
    "Wycieczka się ładuje jak memy po Wi-Fi w PKP 📶"
  ];
  const tekst = humorTeksty[Math.floor(Math.random() * humorTeksty.length)];

  app.innerHTML = `
    <div style="text-align: left; padding: 10px;">
      <button onclick="zaladujKategorieLosowania()">⬅️ Wróć</button>
    </div>
    <div class="title-bar">${kategoria.toUpperCase()}</div>
    <div style="padding: 20px; font-size: 1.2em;">
      <p>${tekst}</p>
      <button onclick="losujWycieczke('${kategoria}')">LOSUJ 🎰</button>
    </div>
    <div id="wynik-losowania" style="margin-top: 30px; font-size: 1.5em;"></div>
  `;
  zastosujMotywZPamieci();

}

function zaladujWylosowane() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div style="text-align: left; padding: 10px;">
        <button onclick="wrocDoGlownej()">⬅️ Wróć</button>
      </div>
      <div class="title-bar">WYLOSOWANE</div>
      <div id="lista-wylosowanych" style="padding: 20px;"></div>
    `;
    zastosujMotywZPamieci();

  
    const lista = document.getElementById("lista-wylosowanych");
  
    db.ref(`bazy/${lokalizacjaID}/wylosowane`).once("value").then(snapshot => {
      const dane = snapshot.val();
  
      if (!dane) {
        lista.innerHTML = "<p>Nie ma żadnych wylosowanych wycieczek. No rusz się, losuj coś!</p>";
        return;
      }
  
      Object.entries(dane).forEach(([klucz, obiekt]) => {
        const div = document.createElement("div");
        div.style.marginBottom = "20px";
        div.innerHTML = `
          <b>${obiekt.nazwa}</b> (${obiekt.kategoria})<br/>
          <button onclick="zrobioneWycieczka('${klucz}', '${obiekt.nazwa}', '${obiekt.kategoria}')">Zrobione!</button>
          <button onclick="przywrocWycieczke('${klucz}', '${obiekt.nazwa}', '${obiekt.kategoria}')">Przywróć</button>
          <hr/>
        `;
        lista.appendChild(div);
      });
    });
  }

  function zaladujOdbyte() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div style="text-align: left; padding: 10px;">
        <button onclick="wrocDoGlownej()">⬅️ Wróć</button>
      </div>
      <div class="title-bar">ODBYTE WYCIECZKI</div>
      <div class="button-grid">
        <button onclick="pokazOdbyteKategorie('jednodniowe')">Jednodniowe</button>
        <button onclick="pokazOdbyteKategorie('weekendowe')">Weekendowe</button>
        <button onclick="pokazOdbyteKategorie('kilkudniowe')">Kilkudniowe</button>
        <button onclick="pokazOdbyteKategorie('wakacyjne')">Wakacyjne</button>
      </div>
    `;
    zastosujMotywZPamieci();

  }
  
  function przywrocWycieczke(klucz, nazwa, kategoria) {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div style="text-align: left; padding: 10px;">
        <button onclick="zaladujWylosowane()">⬅️ Wróć</button>
      </div>
      <div class="title-bar">PRZYWRACANIE</div>
      <div style="padding: 20px; font-size: 1.2em;">
        <p>Na pewno chcesz PRZYWRÓCIĆ wycieczkę <b>${nazwa}</b> do bazy?</p>
        <button onclick="potwierdzPrzywroc('${klucz}', '${nazwa}', '${kategoria}')">✅ Tak, przywróć</button>
        <button onclick="zaladujWylosowane()" style="margin-left:10px;">❌ Nie</button>
      </div>
    `;
    zastosujMotywZPamieci();

  }

  function potwierdzPrzywroc(klucz, nazwa, kategoria) {
    db.ref(`bazy/${lokalizacjaID}/wycieczki/${kategoria}`).push(nazwa)
      .then(() => db.ref(`bazy/${lokalizacjaID}/wylosowane/${klucz}`).remove())
      .then(() => {
        pokazKomunikat("Przywrócono! Wycieczka znowu czeka na losowanie 🎯");
        zaladujWylosowane();
      });
  }  

  function zrobioneWycieczka(klucz, nazwa, kategoria) {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div style="text-align: left; padding: 10px;">
        <button onclick="zaladujWylosowane()">⬅️ Wróć</button>
      </div>
      <div class="title-bar">ZROBIONE!</div>
      <div style="padding: 20px;">
        <p><b>${nazwa}</b> (${kategoria})</p>
        <label>${kategoria === "jednodniowe" ? "Data:" : "Zakres dat (od - do):"}</label><br />
        <input type="date" id="data-od" /> ${
          kategoria !== "jednodniowe"
            ? `<input type="date" id="data-do" style="margin-left:10px;" />`
            : ""
        }
        <br /><br />
        <button onclick="zapiszDoOdbytych('${klucz}', '${nazwa}', '${kategoria}')">Zrobione!</button>
        <div id="komunikat" style="margin-top: 20px; padding: 10px; border-radius: 8px;"></div>
      </div>
    `;
    zastosujMotywZPamieci();
  }
  
  
function losujWycieczke(kategoria) {
  const wynik = document.getElementById("wynik-losowania");
  wynik.innerText = "🎰 Losujemy... trzymaj majty! 🎰";

  const ref = db.ref(`bazy/${lokalizacjaID}/wycieczki/${kategoria}`);
  ref.once("value").then(snapshot => {
    const dane = snapshot.val();

    if (!dane) {
      wynik.innerText = "Brak wycieczek w tej kategorii. Może czas coś dodać?";
      return;
    }

    const klucze = Object.keys(dane);
    const losowyIndex = Math.floor(Math.random() * klucze.length);
    const losowyKey = klucze[losowyIndex];
    const wylosowanaNazwa = dane[losowyKey];

    let i = 0;
    const animacja = setInterval(() => {
      const losowaNazwa = dane[klucze[Math.floor(Math.random() * klucze.length)]];
      wynik.innerText = "🎰 " + losowaNazwa + " 🎰";
      i++;
      if (i > 20) {
        clearInterval(animacja);
        wynik.innerText = `👉 Wylosowano: ${wylosowanaNazwa}`;
        db.ref(`bazy/${lokalizacjaID}/wylosowane`).push({ nazwa: wylosowanaNazwa, kategoria });
        db.ref(`bazy/${lokalizacjaID}/wycieczki/${kategoria}/${losowyKey}`).remove();
      }
    }, 80);
  });
}
function zapiszDoOdbytych(klucz, nazwa, kategoria) {
    const dataOd = document.getElementById("data-od").value;
    const dataDo = kategoria !== "jednodniowe" ? document.getElementById("data-do").value : null;
  
    if (!dataOd || (kategoria !== "jednodniowe" && !dataDo)) {
      pokazKomunikat("Uzupełnij daty, obiboku.");
      return;
    }
  
    const data = kategoria === "jednodniowe" ? dataOd : `${dataOd} – ${dataDo}`;
  
    db.ref(`bazy/${lokalizacjaID}/odbyte/${kategoria}`).push({ nazwa, data })
      .then(() => db.ref(`bazy/${lokalizacjaID}/wylosowane/${klucz}`).remove())
      .then(() => {
        pokazKomunikat("Zapisano jako odbyta wycieczka 🚗");
        zaladujWylosowane();
      });
  }
  function pokazOdbyteKategorie(kategoria) {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div style="text-align: left; padding: 10px;">
        <button onclick="zaladujOdbyte()">⬅️ Wróć</button>
      </div>
      <div class="title-bar">${kategoria.toUpperCase()}</div>
      <div id="lista-odbytych" style="padding: 20px;"></div>
    `;
    zastosujMotywZPamieci();

  
    const lista = document.getElementById("lista-odbytych");
  
    db.ref(`bazy/${lokalizacjaID}/odbyte/${kategoria}`).once("value").then(snapshot => {
      const dane = snapshot.val();
  
      if (!dane) {
        lista.innerHTML = "<p>Brak odbytych wycieczek w tej kategorii. Czas coś nadrobić!</p>";
        return;
      }
  
      // wyświetl od najnowszych do najstarszych
      const entries = Object.entries(dane).reverse();
  
      entries.forEach(([klucz, obiekt]) => {
        const div = document.createElement("div");
        div.className = "odbyta-wycieczka";
        div.innerHTML = `
          <b>${obiekt.nazwa}</b><br/>
          <i>${obiekt.data}</i><br/>
          <button onclick="usunOdbyta('${klucz}', '${kategoria}')" 
  style="padding:6px 10px; font-size:0.9em; margin-top:8px; border-radius:8px;">
  🗑️
</button>

          <hr/>
        `;
        lista.appendChild(div);
      });
    });
  }
  function usunOdbyta(klucz, kategoria) {
    const app = document.getElementById("app");
  
    app.innerHTML = `
      <div style="text-align: left; padding: 10px;">
        <button onclick="pokazOdbyteKategorie('${kategoria}')">⬅️ Wróć</button>
      </div>
      <div class="title-bar">USUWANIE</div>
      <div style="padding: 20px; font-size: 1.2em;">
        <p>Czy na pewno chcesz usunąć tę wycieczkę z historii?<br/><b style="color:red;">Tego nie da się cofnąć 😢</b></p>
        <button class="usun-potwierdzenie" onclick="potwierdzUsuniecie('${klucz}', '${kategoria}')">✅ Tak, usuń</button>
        <button onclick="pokazOdbyteKategorie('${kategoria}')" style="margin-left:10px;">❌ Nie</button>
      </div>
    `;
    zastosujMotywZPamieci();
  }  
  
  function potwierdzUsuniecie(klucz, kategoria) {
    db.ref(`bazy/${lokalizacjaID}/odbyte/${kategoria}/${klucz}`).remove()
      .then(() => {
        pokazKomunikat("Usunięto z historii. Ta wycieczka przeszła do legendy 🪦");
        pokazOdbyteKategorie(kategoria);
      })
      .catch(() => {
        pokazKomunikat("Nie udało się usunąć. Może wycieczka jeszcze walczy? 😬");
      });
  }  

  function zaladujUstawienia() {
    const app = document.getElementById("app");
    const aktualnyMotyw = localStorage.getItem("wybranyMotyw") || "niebieski";
    const aktualnyTryb = localStorage.getItem("tryb") || "jasny";
  
    app.innerHTML = `
      <div style="text-align: left; padding: 10px;">
        <button onclick="wrocDoGlownej()">⬅️ Wróć</button>
      </div>
      <div class="title-bar">USTAWIENIA</div>
      <div style="padding: 20px;">
        <h3>🎨 Wybierz motyw kolorystyczny:</h3>
        <div id="motywy-przyciski" style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-bottom:15px;">
          <!-- KLASYCZNE -->
          <button onclick="zmienMotywNa('niebieski')" style="background:#1e88e5;">🔵</button>
          <button onclick="zmienMotywNa('czerwony')" style="background:#e53935;">🔴</button>
          <button onclick="zmienMotywNa('rozowy')" style="background:#d81b60;">🌸</button>
          <button onclick="zmienMotywNa('zielony')" style="background:#43a047;">🟢</button>
          <button onclick="zmienMotywNa('zolty')" style="background:#fbc02d;">🟡</button>
          <button onclick="zmienMotywNa('fioletowy')" style="background:#8e24aa;">🟣</button>
          <button onclick="zmienMotywNa('pomaranczowy')" style="background:#fb8c00;">🟠</button>
          <button onclick="zmienMotywNa('turkusowy')" style="background:#00acc1;">🧊</button>
  
          <!-- PASTELE -->
          <button onclick="zmienMotywNa('pastel-blekitny')" style="background:#aec6cf; color:#000;">🩵</button>
          <button onclick="zmienMotywNa('pastel-lawendowy')" style="background:#e6e6fa; color:#000;">💜</button>
          <button onclick="zmienMotywNa('pastel-mietowy')" style="background:#b2f2bb; color:#000;">💚</button>
          <button onclick="zmienMotywNa('pastel-brzoskwinia')" style="background:#ffd1a4; color:#000;">🧡</button>
          <button onclick="zmienMotywNa('pastel-limonka')" style="background:#faffc1; color:#000;">💛</button>
          <button onclick="zmienMotywNa('pastel-cytrynowy')" style="background:#fff9b1; color:#000;">🍋</button>
  
          <!-- NEONY -->
          <button onclick="zmienMotywNa('neon-zielony')" style="background:#39ff14; color:#000;">⚡💚</button>
          <button onclick="zmienMotywNa('neon-rozowy')" style="background:#ff44cc; color:#000;">⚡💖</button>
          <button onclick="zmienMotywNa('neon-niebieski')" style="background:#00ffff; color:#000;">⚡💙</button>
          <button onclick="zmienMotywNa('neon-zolty')" style="background:#ffff33; color:#000;">⚡💛</button>
          <button onclick="zmienMotywNa('neon-czerwony')" style="background:#ff1744; color:#000;">⚡❤️</button>
          <button onclick="zmienMotywNa('neon-pomaranczowy')" style="background:#ff9100; color:#000;">⚡🧡</button>
  
          <!-- KOLOROWY RANDOM -->
          <button onclick="zmienMotywNa('kolorowy')" style="background:linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet); color:#000;">🌈</button>
        </div>
  
        <h3 style="margin-top:20px;">🌗 Wybierz tryb:</h3>
        <div style="display:flex; justify-content:center; gap:10px;">
          <button onclick="zmienTrybNa('jasny')">🌞 Jasny</button>
          <button onclick="zmienTrybNa('ciemny')">🌚 Ciemny</button>
        </div>
  
        <hr/>
        <button onclick="pokazTekstUstawien('regulamin')">📜 Regulamin</button>
        <button onclick="pokazTekstUstawien('polityka')">🔐 Polityka prywatności</button>
        <button onclick="pokazTekstUstawien('tworca')">🧠 O twórcy</button>
  
        <div id="ustawienia-tekst" style="margin-top: 20px; padding: 10px; background: #f7f7f7;"></div>
      </div>
    `;
  
    zastosujMotywZPamieci();
  }
  

  function zmienMotyw() {
    const motyw = document.getElementById("wybor-motywu").value;
    const tryb = document.getElementById("wybor-trybu").value;
  
    localStorage.setItem("wybranyMotyw", motyw);
    localStorage.setItem("tryb", tryb);
  
    zastosujMotywZPamieci();
  }
  
  
  function pokazTekstUstawien(typ) {
    const kontener = document.getElementById("ustawienia-tekst");
  
    if (typ === "regulamin") {
      kontener.innerHTML = `
        <b>REGULAMIN:</b><br/>
        1. Zakazuje się zbyt częstego losowania, aby nie nadwyrężać budżetu domowego.<br/>
        2. Apka nie ponosi odpowiedzialności za spóźnienia do pracy.<br/>
        3. Jeśli partner mówi „znowu gdzieś jedziesz?”, udawaj, że aplikacja kazała.<br/>
        4. Nawet do Radomia – jedziesz na własną odpowiedzialność.<br/>
        5. W razie kłótni o kierunek podróży – rzuć monetą.`;
    } else if (typ === "polityka") {
      kontener.innerHTML = `
        <b>POLITYKA PRYWATNOŚCI:</b><br/>
        - Spokojnie, nie wiem kim jesteś.<br/>
        - Twoje dane są tak bezpieczne, jak memy w Twoim telefonie.<br/>
        - Nie zapisuję haseł, maili ani sekretów z dzieciństwa.<br/>
        - Wszystko działa lokalnie – bez serwerów, bez Big Brothera.<br/>
        - Jeśli coś się popsuje, to raczej Twoja przeglądarka niż ja 😎`;
    } else if (typ === "tworca") {
      kontener.innerHTML = `
        <b>O TWÓRCY:</b><br/>
        Autorem tej apki jest człowiek, który:<br/>
        - przebił wszystkie poziomy lenistwa i zrobił aplikację do losowania wyjazdów, bo nie chciało mu się myśleć,<br/>
        - zjada pizzę szybciej niż Chrome zjada RAM,<br/>
        - raz powiedział „zróbmy to porządnie” i... zrobił.<br/>
        Kontakt z autorem?<br>
        Nie ma. Jeśli użyjesz apki źle – on sam Cię znajdzie.`;
    }
  }

  function zastosujMotywZPamieci() {
    const motyw = localStorage.getItem("wybranyMotyw") || "niebieski";
    const tryb = localStorage.getItem("tryb") || "jasny";
  
    const kolorGlownegoTla = tryb === "ciemny" ? "#111" : "#fff";
    const kolorTekstu = tryb === "ciemny" ? "#eee" : "#111";
    let kolorAkcentu;

     // 🔄 Resetuj wszystkie kolory (po motywie "kolorowy")
  document.querySelectorAll("*").forEach(el => {
    el.style.background = "";
    el.style.color = "";
  });
  
    switch (motyw) {
      // 🌸 PASTEL
      case "pastel-blekitny": kolorAkcentu = "#aec6cf"; break;
      case "pastel-lawendowy": kolorAkcentu = "#e6e6fa"; break;
      case "pastel-mietowy": kolorAkcentu = "#b2f2bb"; break;
      case "pastel-brzoskwinia": kolorAkcentu = "#ffd1a4"; break;
      case "pastel-limonka": kolorAkcentu = "#faffc1"; break;
      case "pastel-cytrynowy": kolorAkcentu = "#fff9b1"; break;
  
      // ⚡ NEON
      case "neon-zielony": kolorAkcentu = "#39ff14"; break;
      case "neon-rozowy": kolorAkcentu = "#ff44cc"; break;
      case "neon-niebieski": kolorAkcentu = "#00ffff"; break;
      case "neon-zolty": kolorAkcentu = "#ffff33"; break;
      case "neon-czerwony": kolorAkcentu = "#ff1744"; break;
      case "neon-pomaranczowy": kolorAkcentu = "#ff9100"; break;
  
      // 🌈 KOLOROWY – random dla wszystkiego
      case "kolorowy":
        const randomColor = () => "#" + Math.floor(Math.random()*16777215).toString(16);
        document.body.style.background = randomColor();
        document.body.style.color = randomColor();
        const wszystkie = document.querySelectorAll("*");
        wszystkie.forEach(el => {
          el.style.background = randomColor();
          el.style.color = randomColor();
        });
        kolorAkcentu = randomColor(); // fallback
        break;
  
      // 🔵 DOTYCHCZASOWE MOTYWY
      case "czerwony": kolorAkcentu = "#e53935"; break;
      case "rozowy": kolorAkcentu = "#d81b60"; break;
      case "zielony": kolorAkcentu = "#43a047"; break;
      case "zolty": kolorAkcentu = "#fbc02d"; break;
      case "fioletowy": kolorAkcentu = "#8e24aa"; break;
      case "pomaranczowy": kolorAkcentu = "#fb8c00"; break;
      case "turkusowy": kolorAkcentu = "#00acc1"; break;
      case "niebieski": kolorAkcentu = "#1e88e5"; break;
  
      // 🔙 DOMYŚLNY
      default: kolorAkcentu = "#1e88e5"; break;
    }
  
    document.body.style.background = kolorGlownegoTla;
    document.body.style.color = kolorTekstu;
  
    // jeśli widoczny ekran logowania – zmieniamy jego styl
    const logowanie = document.getElementById("logowanie-box");
    if (logowanie && logowanie.style.display !== "none") {
      logowanie.style.backgroundColor = tryb === "ciemny" ? "#222" : "#fff";
      logowanie.style.color = kolorTekstu;
      logowanie.style.border = "1px solid " + kolorTekstu;
      logowanie.style.borderRadius = "12px";
    }
  
    // poprawiamy widoczność dodatkowych kontenerów
    const teksty = document.querySelectorAll("#ustawienia-tekst, #lista-wylosowanych, #lista-odbytych, #wynik-losowania, #komunikat");
    teksty.forEach(el => {
      el.style.color = kolorTekstu;
      el.style.backgroundColor = tryb === "ciemny" ? "#222" : "#f7f7f7";
    });
  
    // pasek tytułu
    const titleBars = document.getElementsByClassName("title-bar");
    for (let bar of titleBars) {
      bar.style.background = kolorAkcentu;
      bar.style.color = "#fff";
    }
  
    // przyciski
    const buttons = document.getElementsByTagName("button");
    for (let btn of buttons) {
      btn.style.background = kolorAkcentu;
      btn.style.color = "#fff";
    }
  
    // floating przycisk ustawień
    const fab = document.querySelector(".fab-ustawienia");
    if (fab) {
      fab.style.backgroundColor = kolorAkcentu;
      fab.style.color = tryb === "ciemny" ? "#fff" : "#111";
    }
  }
  
  
  
  document.addEventListener("DOMContentLoaded", () => {
    zastosujMotywZPamieci();
  });  

  function zmienMotywNa(nazwa) {
    localStorage.setItem("wybranyMotyw", nazwa);
    zastosujMotywZPamieci();
  }
  
  function zmienTrybNa(tryb) {
    localStorage.setItem("tryb", tryb);
    zastosujMotywZPamieci();
  }
  