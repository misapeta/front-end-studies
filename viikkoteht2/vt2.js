"use strict";
//@ts-check 
// data-muuttuja on lähes sama kuin viikkotehtävässä 1.
//

//"PÄÄOHJELMA"
window.onload = function() {
    console.log(data);

    // Lisätään sarja- ja joukkuetiedot datasta taulukkoon
    tulostaJoukkueet(data);

    // Luodaan rastinlisäystä varten form
    luoRastiForm();
    let uusiRasti = document.getElementById("rasti");
    uusiRasti.addEventListener("click", lisaaRasti, false);
};

/**
 * Tehdään tarvittavat muokkaukset tulostaulukkoon ja tulostetaan taulukkomuodossa joukkueet ja 
 * joukkueiden sarjat tehtävänannon mukaisesti.
 * @param {*} data käsiteltävä tietorakenne
 */
function tulostaJoukkueet(data) {

    // Luodaan apulista, jossa joukkueet järjestettynä tehtävänannon mukaan
    let apulista = jarjestaJoukkueet(data);

    // Haetaan muokattava elementti, table
    let table = document.getElementById("tupa").getElementsByTagName("table")[0];


    // Luodaan joka kierroksella joukkueelle elementti /rivi, jossa joukkueelle lisätään nimi ja sarja
    for (let i in apulista) {
        let tr = document.createElement("tr"); //luo rivi 
        let tdSarja = document.createElement("td"); //luo riville sarake sarjaa varten
        let tdNimi  = document.createElement("td"); //luo riville sarake nimeä varten

        let sarjatieto = document.createTextNode(apulista[i].sarja);
        let nimitieto  = document.createTextNode(apulista[i].joukkue.nimi);
        tdSarja.appendChild(sarjatieto);
        tdNimi.appendChild(nimitieto);

        tr.appendChild(tdSarja);
        tr.appendChild(tdNimi);
        table.appendChild(tr);
    }
}

/**
 * Järjestysfunktio, joka palauttaa listan joukkueista ensisijaisesti sarjan ja toissijaisesti joukkueen nimen perusteella
 * @param {*} data käsiteltävä tietorakenne
 * @returns lista järjestettynä
 */
function jarjestaJoukkueet(data) {
    let apulista = [];
    for (let joukkue of data.joukkueet) {
        apulista.push({"joukkue":joukkue, "sarja":annaSarjanNimi(joukkue.sarja)});
    }

    return apulista.sort(function(a,b) {
        if (a.sarja < b.sarja) {return -1;}
        if (a.sarja > b.sarja) {return  1;}
        if(a.joukkue.nimi.toLowerCase().trim() < b.joukkue.nimi.toLowerCase().trim()) {return -1;}
        return 1;
    });
}

function annaSarjanNimi(sarjaId) {
    for (let sarja of data.sarjat) {
        if (sarja.id == sarjaId) {return sarja.nimi;}
    }
}

// Luodaan rastinlisäystä varten sisältöä HTML:n väliotsikon "Lisää rasti" alla valmiina olevaan formiin
function luoRastiForm() {
    let tieto = document.getElementsByTagName("form")[0]; //haetaan Lisää rasti -väliotsikon jälkeinen form (ensimmäinen kahdesta)
    tieto.id = "lomakeId"; //luodaan id form:lle
    //tehdään tehtävänannon mukainen lomake
    let rastinLuonti = document.getElementById("lomakeId");
    //Luodaan fieldset-elementti ja legend-elementti
    let fieldset = document.createElement("fieldset");
    let legend = document.createElement("legend");
    //Liitetään lapsiksi (+ luodaan textNode)
    rastinLuonti.appendChild(fieldset);
    fieldset.appendChild(legend);
    legend.appendChild(document.createTextNode("Rastin Tiedot"));
    //Luodaan tietokentät Lat/Lon/Koodi, käytetään apuna taulukkoa
    let tiedot = ["Lat", "Lon", "Koodi"];
    //Lisätään silmukassa
    for (let i = 0; i<tiedot.length; i++) {
        let label = document.createElement("label");
        let span = document.createElement("span");
        span.appendChild(document.createTextNode(tiedot[i])); // kun mallissa oli <span>:it
        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("value", "");        
        rastinLuonti.appendChild(fieldset);
        fieldset.appendChild(label);
        label.appendChild(span);
        label.appendChild(input);
    }
    // Luodaan painike rastin lisäämistä varten
    let painike = document.createElement("button");
    painike.id = "rasti";
    painike.appendChild(document.createTextNode("Lisää rasti"));
    fieldset.appendChild(painike);
}

function lisaaRasti(e) {
    e.preventDefault();
    // haetaan rastilomakkeen tiedot:
    let rastilomake = document.getElementById("lomakeId");
    // Lat- ja Lon-arvot reaalilukuja, joten koitetaan parsimista
    let latArvo = parseFloat(rastilomake.getElementsByTagName("input")[0].value);   // Lomakkeen ylimpään kenttään syötetään lat-arvo,
    let lonArvo = parseFloat(rastilomake.getElementsByTagName("input")[1].value);   // keskimmäiseen lon,
    let annettuKoodi = rastilomake.getElementsByTagName("input")[2].value;          // ja alimpaan rastin koodi.

    // tarkastetaan, onko kentät, kuten pitää (koodi voi olla mikä tahansa merkkijono, muttei tyhjä)
    if (isNaN(latArvo) || isNaN(lonArvo) || annettuKoodi == "") {return; }

    // annetaan rastille uniikki id (suurin id + 1)
    let rastiIdHaku = data.rastit;
    let suurin = 1; // laitoin nyt tämän "riittävän pieneksi arvoksi" suurimman vertaamisessa
    for (let id of rastiIdHaku) {
        let arvo = id.id;
        if (arvo > suurin) {suurin = arvo; }
    }
    let uusiID = suurin + 1;
    let uusiRasti = {
        lon: lonArvo.toString(),
        koodi: annettuKoodi,
        lat: latArvo.toString(),
        id: uusiID,
    };

    // lisätään uuden rastin tiedot rastit-listan perään
    data.rastit.push(uusiRasti);
    // apulista sorttausta varten
    let apulista = [];
    for (let rasti of data.rastit) {
        apulista.push(rasti.koodi + "\t\t" + rasti.lat + "\t" + rasti.lon);
    }
    apulista.sort(); // toimii suoraan sortilla, kun string (eikä objecteja)
    // Tulostus konsoliin tehtävänannon mukaan. Käytetään yhtä merkkijonoa, niin on ehkä helpommin luettavissa/kopioitavissa leikepöydälle tms..
    console.log("Rasti\t\tLat\t\tLon\n" + apulista.join("\n"));
    // jos rastilomakkeen tiedot ok, lisätään rastit-listaan ja tyhjennetään lomakekenttä seuraavaa täyttöä varten.
    rastilomake.reset();
}