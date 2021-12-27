"use strict";
//@ts-check 
// Joukkueen sarja on viite data.sarjat-taulukossa lueteltuihin sarjoihin
// Joukkueen leimaamat rastit ovat viitteitä data.rastit-taulukossa lueteltuihin rasteihin
// voit vapaasti luoda data-rakenteen pohjalta omia aputietorakenteita

// Kirjoita tästä eteenpäin oma ohjelmakoodisi

// Seuraavilla voit tutkia selaimen konsolissa käytössäsi olevaa tietorakennetta. 


console.log(data); 
//console.dir(data);

//1.1 JOUKKUELISTAUS
/**
 * Joukkuetulostus. Tulostetaan joukkueen nimi ja sen perään sarja, johon osallistuttu.
 * @param {Object} data käsiteltävä data
 */
function tulostaJoukkueet(data){
    /**
     * Joukkueiden listaus järjestykseen. Apuna aakkostuksessa käytetään Compare-tyypin palautusta
     * -1 (ensimmäinen nimi on pienempi), 1 (toinen pienempi) tai 0 (samat nimet)
     */
    let apu = [];// sort:tia varten luodaan apu-taulukko, jottei rikota alkuperäistä dataa!
    for (let i of data.joukkueet) {
        apu.push(i);
    }
    apu.sort(function(a, b) { 
        let eka = a.nimi.toUpperCase().trim();
        let toka = b.nimi.toUpperCase().trim();
        if (eka < toka) {
          return -1;
        }
        if (eka > toka) {
          return 1;
        }
        return 0;
      });
    
    for (let joukkue of apu){
        log(joukkue.nimi.trim() + " " + joukkue.sarja.nimi); // tulostus näytölle
    }
}

//1.2 JOUKKUEEN LISÄYS
/**
 * Joukkueen lisääminen dataan. Kaikkien parametrien täytyy olla annettu, että joukkue lisätään.
 * Tarkastetaan, että samalla nimellä ei ole jo ilmoittautumista.
 * Tarkastetaan, että sarja täsmää datassa oleviin sarjoihin.
 * @param {Object} data käsiteltävä data
 * @param {Object} joukkue joukkueen tiedot
 * @param {Object} sarja sarja, johon joukkue lisätään
 */
function lisaaJoukkue(data, joukkue, sarja) {
    // jos jokin parametreista puuttuu, palataan tekemättä mitään.
    if (data == null || joukkue == null || sarja == null) {return;}
    for (let sarja1 of data.sarjat){ // käydään data.sarjat läpi
        // seuraavalle riville olisi varmasti järkevämpikin tapa verrata samankaltaisia objekteja, ei löytynyt...
        if (sarja1.nimi === sarja.nimi && sarja1.kesto === sarja.kesto && sarja1.alkuaika === sarja.alkuaika && sarja1.loppuaika === sarja.loppuaika){
            joukkue.sarja = sarja1;
            data.joukkueet.push(joukkue);
        }
    }
}

let joukkue = { 
    "nimi": "Mallijoukkue",
    "jasenet": [
      "Lammi Tohtonen",
      "Matti Meikäläinen"
    ],
    "leimaustapa": [0,2],
    "rastit": [],
    "sarja": [],
    "id": 99999
};

let sarja = {
    "alkuaika": null,
    "kesto": 8,
    "loppuaika": null,
    "nimi": "8h"
};

lisaaJoukkue(data, joukkue, sarja);

//testi konsoliin, onnistuiko lisäys
//console.log(data);


// 1.3 SARJAN VAIHTAMINEN
/**
 * Sarjan vaihtamisen käsittelevä funktio
 * @param {Object} data käsiteltävä data
 * @param {string} vanhanimi joukkueen vanha sarjatieto
 * @param {string} uusinimi uudeksi vaihdettava sarjatieto
 */
function muutaSarjanNimi(data, vanhanimi, uusinimi) {
    for (let sarja1 of data.sarjat){
        if (sarja1['nimi'] === vanhanimi) { 
            sarja1['nimi'] = uusinimi;
            let arvo = parseInt(uusinimi);  // Muutetaan myös sarjan kesto nimeä vastaavaksi
            sarja1.kesto = arvo;            // (en tiedä saiko näin tehdä, mutta aika loogiselta tuntuisi)
        }
    }
}

muutaSarjanNimi(data, "8h", "10h");

// 1.4 RASTIKOODIEN TULOSTAMINEN RIVILLE
/**
 * Yleiskäyttöinen funktio rastikoodien listaukseen kasvavassa järjestyksessä ja
 * tulostukseen näytölle log() -funktiota hyödyntäen.
 * @param {Object} data käsiteltävä data
 */
function tulostaRastikoodit(data) {
    let apu = []; // aputaulukko, jota myöhemmin sortataan
    for (let rasti1 of data.rastit){
        let koodi1 = rasti1.koodi;
        let arvo = parseInt(koodi1);
        
        if (!isNaN(arvo)) { 
            apu.push(koodi1);
        }
        apu.sort();
    }
    let rivi = ""; // alustus rastikoodien yhden rivin merkkijonotulosteelle
    for (let i of apu) {
        rivi += i + ";"; // lisäillään merkkijonoon rastikoodi ja erotinmerkki
    }
    log(rivi);
}

tulostaJoukkueet(data);
log(); // riviväli tehtävänannon mukaisesti
tulostaRastikoodit(data);


log("\n----------\nTaso 3\n----------\n");

// 3.1 JOUKKUEEN POISTAMINEN
/**
 * Poistamista varten yleiskäyttöinen funktio, joka osaa poistaa joukkueen annetun nimen perusteella.
 * @param {Object} data käsiteltävä data
 * @param {string} joukkue poistettavan joukkueen nimi
 */
function poistaJoukkue(data, joukkue) {
    let apuindeksi;
    let joukkueet = data.joukkueet;
    for (let i = 0; i < joukkueet.length; i++){     //etsitään joukkue ja poimitaan talteen sen indeksi
        if (joukkueet[i]['nimi'] === joukkue){
            apuindeksi = i;
        }
    }
    joukkueet.splice(apuindeksi, 1); //poistetaan splicella joukkue haetun indeksin kohdalta
}

poistaJoukkue(data, "Vara 1");
poistaJoukkue(data, "Vara 2");
poistaJoukkue(data, "Vapaat");


// 3.2 RASTITIEDON VAIHTAMINEN JOUKKUEELLE
/**
 * Vaihtaa pyydetyn rastileimauksen (indeksi) sijalle uuden rastin
 * @param {Object} joukkue joukkue-objekti, jolta rastitietoa ollaan vaihtamassa
 * @param {number} rastinIdx - rastin paikka joukkue.rastit-taulukossa
 * @param {Object} uusirasti uusi rasti-objekti joka vaihdetaan tilalle, jos sellainen löytyy
 * @param {string} Aika - Rastileimauksen aika. Jos tätä ei anneta, käytetään samaa aikaa kuin vanhassa korvattavassa leimauksessa
 */
 function vaihdaRasti(joukkue, rastinIdx, uusirasti, aika) {
    // tarkastetaan, että joukkue-objekti on oikea/olemassa, tarkastus myös rastit -taulukon osalta
    if (joukkue == null || !Array.isArray(joukkue.rastit)) {return;}
    // tarkastetaan, ettei rastin indeksiä haeta vääristä paikoista
    if (joukkue.rastit.length <= rastinIdx || rastinIdx < 0) {return;}
    if (data.rastit.indexOf(uusirasti) === -1) {return;}
    let leimausviite = joukkue.rastit[rastinIdx]; // apumuuttuja...
    leimausviite.rasti = uusirasti;
    if (aika != null) {                           // ...jolle annetaan mahdollisesti parametrin mukainen aika
        leimausviite.aika = aika;
    }    
 }

 /**
  * Apufunktio rastin etsimiseen rastin vaihtoa varten
  * @param {Object} data käsiteltävä tietorakenne
  * @param {string} rastikoodi koodi, jota ollaan etsimässä nimellä
  * @returns rasti-objekti, mikäli löytyy
  */
 function etsiRasti(data, rastikoodi) {
    // tarkastus, jos parametreista jompikumpi puuttuu.
    if (data.rastit == null || rastikoodi == null) {return; }
    for (let i of data.rastit) {
        if (i.koodi === rastikoodi) {
            return i;
        }
    }
 }

  /**
  * Apufunktio joukkueen etsimiseen rastin vaihtoa varten
  * @param {Object} data käsiteltävä tietorakenne
  * @param {string} joukkuenimi joukkueen nimi, jonka perusteella haetaan joukkue-objektia
  * @returns joukkue-objekti, mikäli löytyy
  */
 function etsiJoukkue(data, joukkuenimi) {
    // tarkastus, jos parametreista jompikumpi puuttuu.
    if (data.joukkueet == null ||joukkuenimi == null) {return; }
    for (let i of data.joukkueet) {
        if (i.nimi.toUpperCase().trim() === joukkuenimi.toUpperCase().trim()) {
            return i;
        }
    }
 }


let joukkio4 = etsiJoukkue(data, "Dynamic Duo"); // aiempia testauksia tehty sittemmin poistetuille joukkioille 1-3...
let uusrasti = etsiRasti(data, "32");
vaihdaRasti(joukkio4, 73, uusrasti, "2021-03-18 14:11:30");


// 3.3 RASTIEN YHTEISPISTEMÄÄRÄN LASKEMINEN JOUKKUEILLE
/**
 * Laskee joukkueen yhteispisteet. Uusi lähtöleimaus nollaa yhteispisteet ja maalileimaus lopettaa laskennan.
 * @param {Object} joukkue joukkue, jolle rastien yhteispisteet lasketaan
 * @returns yhteispistemäärä rasteista
 */
function laskeYhteispisteet(joukkue) {
    if (joukkue === undefined ) { return 0; }
    let yhteispisteet = 0;
    let lahtoId = -1;
    let maaliId = -1;
    // haetaan viimeisimmän lähtöleimauksen indeksi
    for (let i = 0; i < joukkue.rastit.length; i++) {
        if (joukkue.rastit[i].rasti == null || joukkue.rastit[i].rasti.koodi == null) {continue;} // data ei pelitä
        if (joukkue.rastit[i].rasti.koodi === "LAHTO") {
            lahtoId = i;
        }
    }
    // haetaan ensimmäinen lähtöleimauksen jälkeinen maalileimauksen indeksi
    for (let i = lahtoId+1; i< joukkue.rastit.length; i++) {
        if (joukkue.rastit[i].rasti == null || joukkue.rastit[i].rasti.koodi == null) {continue;} // data ei pelitä
        if (joukkue.rastit[i].rasti.koodi === "MAALI") {
            maaliId = i;
            break;
        }
    }
    // jos lähtöä tai maalia ei ole leimattu, tai lähtöleimauksen jälkeen ei ole leimattu maalia
    if (lahtoId === -1 || maaliId === -1 || lahtoId > maaliId) {
        return 0;
    }

    let aputaulukko = new Set();
    // set-aputaulukko, jolla uniikit koodit talteen:
    for (let i = lahtoId+1; i<maaliId; i++) {
        if (joukkue.rastit[i].rasti == null || joukkue.rastit[i].rasti.koodi == null) {continue;} // data ei pelitä
        if (joukkue.rastit[i].rasti.koodi) {
            aputaulukko.add(joukkue.rastit[i].rasti.koodi);
        }
    }
    //pisteiden ynnäys:
    for (let i = lahtoId+1; i<maaliId; i++) {
        if (joukkue.rastit[i].rasti == null || joukkue.rastit[i].rasti.koodi == null) {continue;} // data ei pelitä
        let loytynyt = joukkue.rastit[i].rasti.koodi;
        if (loytynyt == null) {continue;}
        // Varmistetaan että rasti lasketaan vain kerran
        if (!aputaulukko.has(loytynyt)) {continue;}
        aputaulukko.delete(loytynyt);
        let arvo = loytynyt.charAt(0);
        //console.log(loytynyt, arvo);
        let pistemaara = parseInt(arvo);
        if (!isNaN(pistemaara)) {
            yhteispisteet = yhteispisteet + pistemaara;
        }
    }
    return yhteispisteet;
}

/**
 * Funktiolla järjestetään joukkueet pistemäärän mukaiseen järjestykseen (laskeva). Jos samat pisteet, niin joukkueet aakkosjärjestyksessä.
 * Tämä tehdään apu-taulukossa, jottei alkuperäinen tietorakenne muutu
 * @param {Object} data käytettävä tietorakenne
 */
function tulostaJoukkueetPistemaaranMukaan(data) {
    let joukkio = data.joukkueet;
    let apu = [];
    for (let i of joukkio) {
        let joukkuepisteet = {
            nimi: i.nimi,
            pisteet: laskeYhteispisteet(i),
         };
        apu.push(joukkuepisteet);
    }
    apu.sort(function(a, b) {
        if (a.pisteet > b.pisteet) {
            return -1;
        }
        if (a.pisteet < b.pisteet) {
            return 1;
        }
        if (a.nimi < b.nimi) {
            return -1;
        }
        if (a.nimi > b.nimi) {
            return 1;
        }
        return 0;
    });
    for (let i of apu) {
        log(i.nimi + " (" + i.pisteet + " p)");
    }
}

tulostaJoukkueetPistemaaranMukaan(data);

log("\n----------\nTaso 5\n----------\n");

/**
 * Kurssimateriaalissa annettu apufunktio etäisyyden mittaamiseen kahdessa eri koordinaattipisteessä
 * @param {*} lat1 ensimmäisen paikan lat
 * @param {*} lon1 ensimmäisen paikan lon
 * @param {*} lat2 toisen paikan lat
 * @param {*} lon2 toisen paikan lon
 * @returns kuljettu matka kilometreinä
 */
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

/**
 * Kurssimateriaalissa annettu apufunktio asteiden (deg) muuttamiseksi radiaaneiksi (rad)
 * funktiota hyödynnetään getDistanceFromLatLonInKm -funktiossa
 * @param {*} deg asteluku
 * @returns asteluku radiaaneina
 */
function deg2rad(deg) {
    return deg * (Math.PI/180);
}

let paikka1 = data.joukkueet[0].rastit[0].rasti.lon;
let paikka2 = data.joukkueet[0].rastit[0].rasti.lat;
let paikka3 = data.joukkueet[0].rastit[1].rasti.lon;
let paikka4 = data.joukkueet[0].rastit[1].rasti.lat;

/**
 * Funktio joukkueen kulkeman matkan laskemiseksi viimeisestä lähtöleimauksesta alkaen ja ko. leimausta seuraavaan maalileimaukseen saakka
 * @param {Object} data käytettävä data
 * @param {Object} joukkue joukkue, jonka matkaa lasketaan
 * @returns kuljettu matka pyöristettynä kokonaisiksi kilometreiksi
 */
 function laskeYhteismatka(joukkue) {
    if (joukkue === undefined ) { return 0; }
    let matka = 0;
    let lahtoId = -1;
    let maaliId = -1;
    // haetaan viimeisimmän lähtöleimauksen indeksi
    for (let i = 0; i < joukkue.rastit.length; i++) {
        if (joukkue.rastit[i].rasti == null || joukkue.rastit[i].rasti.koodi == null) {continue;} // data ei pelitä
        if (joukkue.rastit[i].rasti.koodi === "LAHTO") {
            lahtoId = i;
        }
    }
    // haetaan ensimmäinen lähtöleimauksen jälkeinen maalileimauksen indeksi
    for (let i = lahtoId+1; i< joukkue.rastit.length; i++) {
        if (joukkue.rastit[i].rasti == null || joukkue.rastit[i].rasti.koodi == null) {continue;} // data ei pelitä
        if (joukkue.rastit[i].rasti.koodi === "MAALI") {
            maaliId = i;
            break;
        }
    }
    // tarkastus, onko lähtö tai maali leimaamatta, tai jos maalia ei ole leimattu viimeisen lähtöleimauksen jälkeen
    if (lahtoId === -1 || maaliId === -1 || lahtoId > maaliId) { return 0; }
    let aputaulukko = new Set();
    // set-aputaulukko, jolla uniikit koodit talteen:
    for (let i = lahtoId+1; i<maaliId; i++) {
        if (joukkue.rastit[i].rasti == null || joukkue.rastit[i].rasti.koodi == null) {continue;} // data ei pelitä
        if (joukkue.rastit[i].rasti.koodi) {
            aputaulukko.add(joukkue.rastit[i].rasti.koodi);
        }
    }
    //matkan ynnäys rastikäyntien perusteella:
    for (let i = lahtoId+1; i<=maaliId; i++) { // tarkastellaan kierroksilla aina edelliseltä nykyiselle rastille kuljettua matkaa.
        if (joukkue.rastit[i].rasti == null || joukkue.rastit[i].rasti.koodi == null) {continue;}   // data ei pelitä
		if (joukkue.rastit[i].rasti.lon == null || joukkue.rastit[i].rasti.lat == null) {continue;} // myös lon ja lat -datan tarkastelu
        let loytynyt = joukkue.rastit[i].rasti.koodi;
        if (loytynyt == null) {continue;}
		let loytynytLon1 = joukkue.rastit[i-1].rasti.lon; //edellinen leimaus
		let loytynytLat1 = joukkue.rastit[i-1].rasti.lat; //edellinen leimaus
		let loytynytLon2 = joukkue.rastit[i].rasti.lon; //nykyinen leimaus
		let loytynytLat2 = joukkue.rastit[i].rasti.lat; //nykyinen leimaus
        if (loytynytLon1 == null || loytynytLat1 == null || loytynytLon2 == null || loytynytLat2 == null) {continue;}
        // Varmistetaan seuraavaksi että kyseessä oleva rasti otetaan mukaan vain kerran
        if (!aputaulukko.has(loytynyt)) {continue;}
        aputaulukko.delete(loytynyt);
        matka += getDistanceFromLatLonInKm(loytynytLon1, loytynytLat1, loytynytLon2, loytynytLat2);
    }
    matka = Math.floor(matka);
    return matka;
}

/**
 * Funktio joukkueen kilpailuajan määrittämiseksi. Otetaan huomioon viimeisen lähtöleimauksen ja sitä seuraavan ensimmäisen maalileimauksen välinen aika
 * @param {Object} joukkue 
 * @returns kisassa kulunut aika muodossa "hh:mm:ss"
 */
function laskeAika(joukkue) {
    if (joukkue === undefined ) { return 0; }
    let lahtoId = -1;
    let maaliId = -1;
	let lahtoaika = 0;
	let maaliaika = 0;
    // haetaan viimeisimmän lähtöleimauksen indeksi
    for (let i = 0; i < joukkue.rastit.length; i++) {
        if (joukkue.rastit[i].rasti == null || joukkue.rastit[i].rasti.koodi == null || joukkue.rastit[i].aika == null) {continue;} // data ei pelitä
        if (joukkue.rastit[i].rasti.koodi === "LAHTO") {
            lahtoId = i;
			lahtoaika = joukkue.rastit[i].aika;			
        }
    }
    // haetaan ensimmäinen lähtöleimauksen jälkeinen maalileimauksen indeksi
    for (let i = lahtoId+1; i< joukkue.rastit.length; i++) {
        if (joukkue.rastit[i].rasti == null || joukkue.rastit[i].rasti.koodi == null) {continue;} // data ei pelitä
        if (joukkue.rastit[i].rasti.koodi === "MAALI") {
            maaliId = i;
			maaliaika = joukkue.rastit[i].aika;			
            break;
        }
    }
    // tarkastus, onko lähtö tai maali leimaamatta, tai jos maalia ei ole leimattu viimeisen lähdön jälkeen
    if (lahtoId === -1 || maaliId === -1 || lahtoId > maaliId) { return "00:00:00";}

    let alku = new Date(lahtoaika);
    let loppu = new Date(maaliaika);
    let sekunteina = (loppu.getTime() - alku.getTime()) / 1000; // getTime -arvot millisekunneista sekunneiksi
    let tunteina = Math.floor(sekunteina / (60*60));
    if (tunteina < 10 ) { tunteina = "0"+tunteina; }
    let tuntiJakoJaannos = sekunteina % (60*60);
    let minuutteina = Math.floor(tuntiJakoJaannos / 60);
    if (minuutteina < 10 ) { minuutteina = "0"+minuutteina; }
    let minuuttiJakoJaannos = tuntiJakoJaannos % 60;
    sekunteina = minuuttiJakoJaannos;
    if (sekunteina < 10 ) { sekunteina = "0" + sekunteina; }
    let kisaAika = "" + tunteina + ":" + minuutteina + ":" + sekunteina;
    return kisaAika;
}

/**
 * Funktiolla järjestetään joukkueet pistemäärän mukaiseen järjestykseen (laskeva). Jos samat pisteet, niin joukkueet tulostetaan kisaan käytetyn ajan perusteella.
 * Tulostus muotoa joukkueen nimi, pisteet, matka kilometreissä, aika muodossa "hh:mm:ss" esim: Kahden joukkue, 295 p, 55 km, 08:05:38 
 * Tämä tehdään apu-taulukossa, jottei alkuperäinen tietorakenne muutu
 * @param {Object} data käytettävä tietorakenne
 */
function tulostaJoukkueetPistemaaranMatkanJaAjanMukaan(data) {
    let joukkio = data.joukkueet;
    let apu = [];
    for (let i of joukkio) {
        let joukkuetulos = {
            nimi: i.nimi,
            pisteet: laskeYhteispisteet(i),
			matka: laskeYhteismatka(i),
			aika: laskeAika(i),
         };
        apu.push(joukkuetulos);
    }
    apu.sort(function(a, b) {
        if (a.pisteet > b.pisteet) {
            return -1;
        }
        if (a.pisteet < b.pisteet) {
            return 1;
        }
        if (a.aika < b.aika) {
            return -1;
        }
        if (a.aika > b.aika) {
            return 1;
        }
        if (a.nimi < b.nimi) {
            return -1;
        }
        if (a.nimi > b.nimi) {
            return 1;
        }
        return 0;
    });
    for (let i of apu) {
        log(i.nimi + ", " + i.pisteet + " p, " + i.matka + " km, " + i.aika);
    }
}

tulostaJoukkueetPistemaaranMatkanJaAjanMukaan(data);