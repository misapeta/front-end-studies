"use strict";
//@ts-check 


window.onload = function () {
    luodaanLiukupalkkeja(15);
    luodaanKuva();
    
};

//--------------KUVA LIIKKUMAAN OSITTAIN NELJÄÄN SUUNTAAN--------------

/**
 * Luodaan kuva haetusta source:sta ja paloitellaan se neljään osaan
 */
function luodaanKuva() {
    // haetaan paikka ja ufonn kuva
    let div = document.getElementsByClassName("kuva")[0];
    let img = new Image();
    img.src = "ufo.png";
    
    // palastellaan ufon neljään osaan
    let palat = new Set();
    img.addEventListener("load", () => {
        palat.add(otaPalaKuvasta(img, 0, 0, img.width/2, img.height/2, img.width/2, img.height/2, "vasen-yla"));
        palat.add(otaPalaKuvasta(img, img.width/2, 0, img.width, img.height/2, img.width, img.height/2, "oikea-yla"));
        palat.add(otaPalaKuvasta(img, 0, img.height/2, img.width/2, img.height, img.width/2, img.height, "vasen-ala"));
        palat.add(otaPalaKuvasta(img, img.width/2, img.height/2, img.width, img.height, img.width, img.height, "oikea-ala"));
        // liitetään palat sivulle
        for (let i of palat) {
            div.appendChild(i);
        }
    });
}


/**
 * Leikataan kuvasta canvakselle parametrien kokoinen pala
 * @param {*} kuva 
 * @param {*} sx 
 * @param {*} sy 
 * @param {*} sWidth 
 * @param {*} sHeight 
 * @param {*} dWidth 
 * @param {*} dHeight 
 * @param {*} luokka 
 * @returns canvakselle piirretty kuva
 */
function otaPalaKuvasta(kuva, sx, sy, sWidth, sHeight, dWidth, dHeight, luokka) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    canvas.width = sWidth - sx;
    canvas.height = sHeight - sy;
    ctx.drawImage(kuva, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);
    canvas.setAttribute("class", luokka);
    return canvas;
}

//--------------PALKKIGRADIENTIT--------------

/**
 * Luodaan liukupalkkeja annetun lukumäärän verran ja laitetaan palkit liikkeelle.
 * @param {*} lkm 
 */
function luodaanLiukupalkkeja(lkm) {
    let div = document.getElementsByClassName("palkkigradientit")[0];
    let defs = luodaanGradientteja();
    for (let i = 0; i < lkm; i++) {
        let liukupalkki = luodaanPalkki(defs);
        div.appendChild(liukupalkki);
        animoidaanPalkkiviive(liukupalkki, i);
    }
}


/**
 * Luo palkin (koko- ja väriasetuksineen)
 * @param {*} gradient 
 */
function luodaanPalkki(gradient) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    svg.appendChild(rect);
    let defs = gradient;
    svg.appendChild(defs);

    svg.setAttribute("class", "palkki");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("width", "10%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("fill", 'url(#Gradient1)');

    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    return svg;
}


/**
 * Luodaan defs -lohkon sisään kaksi linearGradient.ia
 */
function luodaanGradientteja() {
    let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    let linGrad1 = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    let linGrad2 = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    linGrad1.id = 'Gradient1';

    let pysaytykset = [
        {
            "color": "black",
            "offset": "0%",
        }, {
            "color": "blue",
            "offset": "50%",
        }, {
            "color": "black",
            "offset": "100%",
        }
    ];

    for (let i = 0; i < pysaytykset.length; i++) {
        let stop = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
        stop.setAttribute('offset', pysaytykset[i].offset);
        stop.setAttribute('stop-color', pysaytykset[i].color);
        linGrad1.appendChild(stop);
    }

    linGrad2.id = 'Gradient2';
    pysaytykset = [
        {
            "color": "black",
            "offset": "0%",
        }, {
            "color": "green",
            "offset": "50%",
        }, {
            "color": "black",
            "offset": "100%",
        }
    ];

    for (let i = 0; i < pysaytykset.length; i++) {
        let stop = document.createElementNS("http://www.w3.org/2000/svg", 'stop');
        stop.setAttribute('offset', pysaytykset[i].offset);
        stop.setAttribute('stop-color', pysaytykset[i].color);
        linGrad2.appendChild(stop);
    }
    defs.appendChild(linGrad1);
    defs.appendChild(linGrad2);
    return defs;
}


/**
 * Asetetaan palkin animaatiolle viive
 * @param {palkki, jota animoidaan} palkki 
 * @param {viiveen määrää varten: monesko palkki kyseessä} i 
 */
function animoidaanPalkkiviive(palkki, i) {
    let viive = (0.19 * i) + "s";
    palkki.style.animationDelay = viive;
}





/** KEYFRAMESIT 
 * Etsitään CSS tiedostosta tietynniminen keyframes -lohko
 * Lähde: pääteohjaus 4 -canvas, svg ja animaatiot
 * @param {keyframes lohkon nimi} rule 
 */
function findKeyframesRule(rule) {
    let ss = document.styleSheets;
    for (let i = 0; i < ss.length; ++i) {
        for (let j = 0; j < ss[i].cssRules.length; ++j) {
            if (ss[i].cssRules[j].type == window.CSSRule.KEYFRAMES_RULE &&
                ss[i].cssRules[j].name == rule) {
                return ss[i].cssRules[j];
            }
        }
    }
    return null;
}

