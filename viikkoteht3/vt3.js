"use strict";  // pidä tämä ensimmäisenä rivinä
//@ts-check 


//"Pääohjelma"
window.onload = function() {

    //console.log(data);
    lisaaRadiopainikkeet();
    lisaaJasenKenttia(2); // oletukseksi tulevat kaksi kenttää jäsenten lisäämistä varten.

    //Eventlistenerit joukkueen lisäämiseksi ja validointiviestin palauttamiseksi alkutilaan.
    document.getElementById('joukkueenLisaysLomake').addEventListener("submit", lisaaJoukkue);
    document.getElementById('joukkueNimi').addEventListener("input", palautaValidointi);
    
    //Tulostaa sivulle listauksen (joukkue, sarja ja jäsenet) tietorakenteen mukaisesti.
    tulostaJoukkueet();
};

/**
 * Funktio, jolla haetaan lomakkeelle tietorakenteen mukaiset sarjat. Näistä luodaan vastaavat radio-vaihtoehdot.
 */
function lisaaRadiopainikkeet() {
    let p = document.getElementById("sarjaNimi"); // haetaan sarjoja vastaava elementti

    //Otetaan sarjat talteen numerojärjestyksessä
    let listaSarjoista = data.sarjat.sort(function(a,b) {
        if (a.nimi < b.nimi) {return -1;}
        return 1; 
    });
    
    //Luodaan jokaiselle sarjalle label ja input (radiobutton)
    for (let i in listaSarjoista) {
        let span = document.createElement('span');
        //Input
        let input = document.createElement('input');
        input.type = "radio";
        input.name = "sarjat";
        input.id = "id" + listaSarjoista[i].id;
        input.value = listaSarjoista[i].id;
        if (i == 0) {input.setAttribute("checked", "checked");} // oletusvalinnaksi eka radio
        //Label
        let label = document.createElement('label');
        label.setAttribute("for", "id"+listaSarjoista[i].id);
        
        label.appendChild(document.createTextNode(listaSarjoista[i].nimi));
        span.appendChild(label);
        span.appendChild(input);
        p.appendChild(span);
    }
}

/**
 * Funktio jäsenkenttien muodostamiseksi lomakkeelle
 * @param {*} maara montako jäsenkenttää lisätään
 */
function lisaaJasenKenttia(maara) {
    let p = document.getElementById("jasenet");
    let jasentenLkm = p.getElementsByTagName('label').length;
    
    // luodaan jokaiselle jäsenkentälle label- ja input-elementti.
    for (let i = 0; i < maara; i++) {
        jasentenLkm++;
        let div = document.createElement('div');
        // Input
        let input = document.createElement('input');
        input.type = "text";
        input.name = "jasen" + jasentenLkm;
        input.id = "jasen" + jasentenLkm;
        //Päivittää kaikkien jäsenkenttien validiutta kun kenttää muutetaan
        input.addEventListener('input', tarkistaJasenet);

        let label = document.createElement('label');
        label.setAttribute("for", ("jasen" + jasentenLkm));
        label.appendChild(document.createTextNode("Jäsen " + jasentenLkm));
        div.appendChild(label);
        div.appendChild(input);
        p.appendChild(div);
    }
}

/**
 * Sarjan hakeminen lomakkeen valinnan perusteella
 * @returns sarja, joka radiovalikosta oli valittu
 */
 function haeSarja() {
    let radiot = document.getElementById("sarjaNimi").getElementsByTagName("input");
    let valittuSarja;
    for ( let i in radiot ) {
        if (radiot[i].checked) {
            valittuSarja = Number(radiot[i].value);
            break;
        }
    }
    return valittuSarja;
}

//Tarkistaa kenttien validiuden, ja jos kaikki kentät kelpaavat, lisää joukkueen tietorakenteeseen
function lisaaJoukkue(e) {
    e.preventDefault();
    if (!tarkistaJoukkueSyote()) {
        document.getElementById("joukkueenLisaysLomake").reportValidity(); // tuo ensimmäisen virheen esiin koko lomakkeesta
        return;
    } // jos kaikki ok, tarkastusfunktio sallii tallennuksen

    let uusiJoukkue = {
        nimi: document.getElementById("joukkueNimi").value.trim(),
        id: uusiId(),
        jasenet: haeJasenet(),
        leimaustapa: [0],
        sarja: haeSarja(), 
        rastit: []
    };
    data.joukkueet.push(uusiJoukkue);

    // joukkueen lisäämisen jälkeen tyhjennetään kentät
    tyhjennaLomakekentat();
    
    //Tulostetaan päivitetty lista joukkueista
    tulostaJoukkueet();
}

/**
 * Funktio joukkuesyötteen oikeellisuuden tarkastamiseksi (joukkue- ja jäsentiedot).
 * @returns false , mikäli annetaan virheilmoitus, 'true' jos kaikki kentät on täytetty vaatimusten mukaan.
 */
function tarkistaJoukkueSyote() {
    let nimikentta = document.getElementById("joukkueNimi");
    nimikentta.setCustomValidity("");
    let jasenKentta = document.getElementById("jasenet").getElementsByTagName("input");
    jasenKentta[0].setCustomValidity("");
    
    //Tarkastetaan, että joukkueen nimikenttä on täytetty
    if (nimikentta.value.trim().length < 1) { 
        nimikentta.setCustomValidity("Joukkueen nimi ei saa olla tyhjä.");
        return false; 
    }

    //Tarkastetaan, että joukkueen nimen pituus vähintään 2 merkkiä
    if (nimikentta.value.trim().length < 2) { 
        nimikentta.setCustomValidity("Joukkueen nimen on oltava vähintään kaksi merkkiä.");
        tyhjennaJoukkueKentta();
        return false; 
    }

    //Tarkastetaan tietorakenteen nimet läpikäymällä, onko joukkueen nimi jo käytössä.
    for (let i in data.joukkueet) {
        if (data.joukkueet[i].nimi.trim().toLowerCase() == nimikentta.value.trim().toLowerCase()) {
            nimikentta.setCustomValidity("Samanniminen joukkue on jo olemassa.");
            tyhjennaJoukkueKentta();
            return false;
        }
    }

    //Tarkistetaan jäsenten nimet sisältävien kenttien validius
    //haeJasenet palauttaa listan epätyhjistä jäsenkentistä, jos alle kaksi kenttää on täytetty, syöte ei kelpaa
    if ( haeJasenet().length < 2 ) {
        jasenKentta[0].setCustomValidity("Joukkueella on oltava vähintään kaksi jäsentä");
        return false;
    }

    // Set-listan ja tavallisen listan vertauksella duplikaattien huomiointi
    // mappaus, jotta saadaan eri kirjainkoolla kirjoitetut samaksi (Mikko == mikko == mIKKo)
    if (new Set(haeJasenet().map(nimi => nimi.toLowerCase())).size != haeJasenet().length) {
        jasenKentta[0].setCustomValidity("Joukkueen jäsenillä ei voi olla samoja nimiä");
        return false;
    }
    return true;
}

/**
 * Funktio, jolla palautetaan validointi takaisin tyhjäksi merkkijonoksi.
 * @param {*} e 
 */
function palautaValidointi(e) {
    e.target.setCustomValidity("");
}

/**
 * Funktiossa käydään läpi kaikki jäsenkentät.
 * Palautetaan lista täytetyistä kentistä saaduista nimistä.
 * @returns lista joukkueen jäsenten nimistä
 */
function haeJasenet() {
    let nimet = [];
    let jasenKentanSisalto = document.getElementById("jasenet");
    let jasenKentat = jasenKentanSisalto.getElementsByTagName("input");
    for (let i in jasenKentat) {
        if (jasenKentat[i].value == null) {continue;}
        let jasen = jasenKentat[i].value.trim();
        if (jasen != "") { 
            nimet.push(jasen); 
        }
    }
    return nimet;
}

/**
 * Funktio joukkueiden tulostamiseksi sivulle tehtävänannon mukaisena listauksena
 * Joukkueet aakkostettu, jäsenet aakkostettu
 */
function tulostaJoukkueet() {
    let joukkueetJarjestettyna = data.joukkueet.sort(function(a,b) {
        if (a.nimi.trim().toLowerCase() < b.nimi.trim().toLowerCase()) { return -1; }
        return 1;
    });
    let lista = document.getElementById("tulostaJoukkueet");
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    for ( let i in joukkueetJarjestettyna) {
        let li = document.createElement("li");
        let nimi = joukkueetJarjestettyna[i].nimi;
        li.appendChild(document.createTextNode(nimi));
        let strong = document.createElement("strong");
        let sarjaNimi = haeSarjaNimi(joukkueetJarjestettyna[i].sarja);
        let sarja = document.createTextNode(" " + sarjaNimi);
        strong.appendChild(sarja);
        li.appendChild(strong);

        let ul = document.createElement('ul');

        let jasenet = joukkueetJarjestettyna[i].jasenet.sort(function(a,b) { if (a < b) {return -1;} return 1;}); //jäsenetkin aakkosjärjestykseen
        // lisätään jäsenet joukkueen alle sisempään listaan
        for ( let j in jasenet ) {
            let lisattava = document.createElement('li');
            lisattava.appendChild(document.createTextNode(jasenet[j]));
            ul.appendChild(lisattava);
        }
        li.appendChild(ul);
        lista.appendChild(li);
    }
}

/**
 * Apufunktio, jolla saadaan sarjan nimi sarjan id.n avulla
 * @param {*} sarjaId id, jolla nimeä haetaan 
 * @returns sarjan nimi
 */
function haeSarjaNimi(sarjaId) {
    for (let i in data.sarjat) {
        if (data.sarjat[i].id == sarjaId) {
            return data.sarjat[i].nimi;
        }
    }
}

/**
 * Apufunktio, palauttaa tietorakenteen suurimman joukkue-id:n lisättynä yhdellä
 * @returns uusi, uniikki id-arvo (suurin id)
 */
function uusiId() {
    let suurin = 0;
    for (let i in data.joukkueet) {
        if (data.joukkueet[i].id > suurin) {suurin = data.joukkueet[i].id;}
    }
    return (suurin+1);
}

/**
 * Funktio jäsenkenttien lisäämiseksi, jos viimeistä kenttää ollaan täyttämässä
 * Tästä funktiosta myös tarkastus jäsenkenttien validiuden osalta
 * @param {*} e 
 */
function tarkistaJasenet(e) {
    palautaValidointi(e); // mahdollistetaan uusi submit, mikäli aiemmin on tapahtunut virhe (ehkä tämän olisi voinut helpomminkin toteuttaa)
    let labelLista = document.getElementById("jasenet").getElementsByTagName('label');
    if (e.target.id == labelLista[labelLista.length-1].getAttribute("for")) {
        lisaaJasenKenttia(1);
    }
}

/**
 * Tyhjennetään joukkueen ja jäsenten nimikentän tiedot seuraavaa lomakkeen täyttöä varten.
 */
function tyhjennaLomakekentat() {
    let poistaJoukkueNimi = document.getElementById("joukkueNimi");
    poistaJoukkueNimi.value = "";
    //Poistetaan kaikki jäsenkentät lisäyksen jälkeen viimeisestä aloittaen
    let poistettava = document.getElementById("jasenet");
    while (poistettava.firstChild) {
        poistettava.removeChild(poistettava.firstChild);
    }
    // tyhjennyksen jälkeen uutta täyttöä varten kaksi jäsenkenttää.
    lisaaJasenKenttia(2);
}

/**
 * Funktio joukkueen nimen poistamiseksi lomakekentästä
 * Käyttö, mikäli virheellinen joukkueen nimisyöte
 */
function tyhjennaJoukkueKentta() {
    //Tyhjennetään joukkueen nimikentän tiedot
    let poistaJoukkueNimi = document.getElementById("joukkueNimi");
    poistaJoukkueNimi.value = "";
}