class Complexe {
    constructor(reel, imaginaire) {
        this.reel = reel;
        this.imaginaire = imaginaire;
    }

    addition(z2) {
        return new Complexe(
            this.reel + z2.reel,
            this.imaginaire + z2.imaginaire
        );
    }

    soustraction(z2) {
        return new Complexe(
            this.reel - z2.reel,
            this.imaginaire - z2.imaginaire
        );
    }

    multiplication(z2) {
        return new Complexe(
            this.reel * z2.reel - this.imaginaire * z2.imaginaire,
            this.reel * z2.imaginaire + this.imaginaire * z2.reel
        );
    }

    division(z2) {
        let denom = z2.reel * z2.reel + z2.imaginaire * z2.imaginaire;
        if (denom === 0) throw new Error("Division par zéro !");
        return new Complexe(
            (this.reel * z2.reel + this.imaginaire * z2.imaginaire) / denom,
            (this.imaginaire * z2.reel - this.reel * z2.imaginaire) / denom
        );
    }

    oppose() { return new Complexe(-this.reel, -this.imaginaire); }
    conjugue() { return new Complexe(this.reel, -this.imaginaire); }

    inverse() {
        let d = this.reel * this.reel + this.imaginaire * this.imaginaire;
        if (d === 0) throw new Error("Inverse d'un complexe nul !");
        return new Complexe(this.reel / d, -this.imaginaire / d);
    }

    puissance(n) {
        let mod = Math.pow(this.module(), n);
        let arg = this.argument() * n;
        return new Complexe(
            mod * Math.cos(arg),
            mod * Math.sin(arg)
        );
    }

    module() {
        return Math.sqrt(this.reel * this.reel + this.imaginaire * this.imaginaire);
    }

    argument() { return Math.atan2(this.imaginaire, this.reel); }

    toCartesien() {
        let re = arrondir(this.reel);
        let im = arrondir(this.imaginaire);
        let signe = im >= 0 ? '+' : '-';
        return re + ' ' + signe + ' ' + Math.abs(im) + 'i';
    }

    toPolaire() {
        let mod = arrondir(this.module());
        let arg = arrondir(this.argument());
        return '(' + mod + ', ' + arg + ' rad)';
    }
}

// Variables globales
let partieActive = 're';
let saisiReel = '0';
let saisiImag = '0';
let operation = '';
let z1 = null;
let modeAffichage = 'cart';
let etape = 1;
let modePuissance = false;
let saisiPuissance = '';

function arrondir(val) {
    return Math.round(val * 10000) / 10000;
}

function setPartie(partie) {
    partieActive = partie;
    document.getElementById('btnRe').classList.toggle('actif', partie === 're');
    document.getElementById('btnImg').classList.toggle('actif', partie === 'img');
}

function taper(val) {
    // Mode puissance : on saisit n via le pavé
    if (modePuissance) {
        saisiPuissance += val;
        document.getElementById('affReel').textContent = 'n = ' + saisiPuissance;
        return;
    }

    if (partieActive === 're') {
        if (saisiReel === '0') saisiReel = val;
        else saisiReel += val;
        document.getElementById('affReel').textContent = saisiReel;
    } else {
        if (saisiImag === '0') saisiImag = val;
        else saisiImag += val;
        document.getElementById('affImag').innerHTML = saisiImag + '<sup>i</sup>';
    }
}

function retour() {
    if (modePuissance) {
        saisiPuissance = saisiPuissance.slice(0, -1) || '';
        document.getElementById('affReel').textContent = 'n = ' + saisiPuissance;
        return;
    }

    if (partieActive === 're') {
        saisiReel = saisiReel.slice(0, -1) || '0';
        document.getElementById('affReel').textContent = saisiReel;
    } else {
        saisiImag = saisiImag.slice(0, -1) || '0';
        document.getElementById('affImag').innerHTML = saisiImag + '<sup>i</sup>';
    }
}

function setOperation(op) {
    // Sauvegarder Z1
    z1 = new Complexe(
        parseFloat(saisiReel) || 0,
        parseFloat(saisiImag) || 0
    );
    operation = op;

    // Réinitialiser l'écran pour Z2
    saisiReel = '0';
    saisiImag = '0';
    document.getElementById('affReel').textContent = '0';
    document.getElementById('affImag').innerHTML = '0<sup>i</sup>';
    etape = 2;
}

function afficherResultat() {
    if (!z1 || operation === '') {
        alert("Veuillez entrer Z1 et choisir une opération !");
        return;
    }

    let z2 = new Complexe(
        parseFloat(saisiReel) || 0,
        parseFloat(saisiImag) || 0
    );

    try {
        let resultat;
        switch (operation) {
            case '+': resultat = z1.addition(z2); break;
            case '-': resultat = z1.soustraction(z2); break;
            case '*': resultat = z1.multiplication(z2); break;
            case '/': resultat = z1.division(z2); break;
        }
        afficherSurEcran(resultat);
    } catch (e) {
        alert("Erreur : " + e.message);
    }
}

function calculerDirect(op) {
    // Mode puissance : activer la saisie de n
    if (op === 'puissance') {
        modePuissance = true;
        saisiPuissance = '';
        document.getElementById('affReel').textContent = 'n = ';
        document.getElementById('affImag').innerHTML = 'Entrez n';
        return;
    }

    let z = new Complexe(
        parseFloat(saisiReel) || 0,
        parseFloat(saisiImag) || 0
    );

    try {
        let resultat;
        switch (op) {
            case 'oppose': resultat = z.oppose(); break;
            case 'conjugue': resultat = z.conjugue(); break;
            case 'inverse': resultat = z.inverse(); break;
            case 'module':
                let mod = arrondir(z.module());
                document.getElementById('affReel').textContent = mod;
                document.getElementById('affImag').innerHTML = '0<sup>i</sup>';
                afficherResultatSimple('Module : ' + mod, '-');
                return;
            case 'argument':
                let arg = arrondir(z.argument());
                document.getElementById('affReel').textContent = arg + ' rad';
                document.getElementById('affImag').innerHTML = '0<sup>i</sup>';
                afficherResultatSimple('Argument : ' + arg + ' rad', '-');
                return;
            case 'puissanceCalc':
                if (saisiPuissance === '') {
                    alert("Entrez d'abord la puissance n !");
                    return;
                }
                let n = parseInt(saisiPuissance);
                if (isNaN(n)) {
                    alert("Puissance invalide !");
                    return;
                }
                z = new Complexe(
                    parseFloat(saisiReel) || 0,
                    parseFloat(saisiImag) || 0
                );
                resultat = z.puissance(n);
                modePuissance = false;
                saisiPuissance = '';
                break;
        }
        afficherSurEcran(resultat);
    } catch (e) {
        alert("Erreur : " + e.message);
    }
}

function afficherSurEcran(resultat) {
    let re = arrondir(resultat.reel);
    let im = arrondir(resultat.imaginaire);

    document.getElementById('affReel').textContent = re;
    document.getElementById('affImag').innerHTML = im + '<sup>i</sup>';

    let ecranRes = document.getElementById('ecranResultat');
    ecranRes.style.display = 'block';

    if (modeAffichage === 'cart') {
        document.getElementById('resCart').textContent =
            'Cart: ' + resultat.toCartesien();
        document.getElementById('resPol').textContent =
            'Pol: ' + resultat.toPolaire();
    } else {
        document.getElementById('resCart').textContent =
            'Cart: ' + resultat.toCartesien();
        document.getElementById('resPol').textContent =
            'Pol: ' + resultat.toPolaire();

        // Appliquer le mode actuel
        toggleAffichage();
        toggleAffichage();
    }
}

function afficherResultatSimple(cart, pol) {
    let ecranRes = document.getElementById('ecranResultat');
    ecranRes.style.display = 'block';
    document.getElementById('resCart').textContent = cart;
    document.getElementById('resPol').textContent = pol;
}

function toggleAffichage() {
    modeAffichage = modeAffichage === 'cart' ? 'pol' : 'cart';
    let btn = document.getElementById('btnCart');
    btn.textContent = modeAffichage === 'cart' ? 'cart' : 'pol';

    let ecranRes = document.getElementById('ecranResultat');

    if (modeAffichage === 'cart') {
        // Affiche uniquement cartésien
        document.getElementById('resCart').style.display = 'block';
        document.getElementById('resPol').style.display = 'none';
    } else {
        // Affiche uniquement polaire
        document.getElementById('resCart').style.display = 'none';
        document.getElementById('resPol').style.display = 'block';
    }
}

function effacer() {
    saisiReel = '0';
    saisiImag = '0';
    operation = '';
    z1 = null;
    etape = 1;
    modePuissance = false;
    saisiPuissance = '';
    document.getElementById('affReel').textContent = '0';
    document.getElementById('affImag').innerHTML = '0<sup>i</sup>';
    document.getElementById('ecranResultat').style.display = 'none';
    document.getElementById('resCart').textContent = '-';
    document.getElementById('resPol').textContent = '-';
}
function gererPuissance() {
    if (!modePuissance) {
        calculerDirect('puissance');
    } else {
        calculerDirect('puissanceCalc');
    }
}