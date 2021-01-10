var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var txtKaynak = document.getElementById("txtKaynak");
var chkCikmazGoster =  document.getElementById("chkCikmazGoster");
var btnAnimasyon =  document.getElementById("btnAnimasyon");
var rangeHiz =  document.getElementById("rangeHiz");
var satirAdet, sutunAdet, hucreGen, hucreYuk;


// belirtilen koordinat labirent üzerindeki bir 0 değerine (yola) karşılık geliyor mu?
function yolAcikMi(labirent, x, y) {
    return x >= 0 && y >= 0 && 
        x < labirent[0].length && y < labirent.length && 
        labirent[y][x] == "0";
}

function hedefeUlasildiMi (labirent, x, y) {
    var satirAdet = labirent.length;
    var sutunAdet = labirent[0].length;
    return x == sutunAdet - 1 && y == satirAdet - 1 && labirent[y][x] == "0";
}

function hucreGuncelle(labirent, x, y, deger) {
    labirent[y][x] = deger;
    degisim.push({ x: x, y: y, deger: deger });
}

function ara(labirent, x = 0, y = 0) {
    if (!yolAcikMi(labirent, x, y)) return false;
    
    if (hedefeUlasildiMi (labirent, x, y)) {
        hucreGuncelle(labirent, x, y, "7");
        return true;
    }

    // vardığımız noktayı işaretleyelim
    hucreGuncelle(labirent, x, y, "7");

    if (ara(labirent, x, y + 1)) return true; // aşağıda ara
    if (ara(labirent, x + 1, y)) return true; // sağında ara
    if (ara(labirent, x, y - 1)) return true; // üstünde ara
    if (ara(labirent, x - 1, y)) return true; // solunda ara

    hucreGuncelle(labirent, x, y, "9"); // çıkmaz sokak olarak işaretle
    return false;
}

var degisim = [];
function labirentCoz(cizimli = true) {
    var labirent = diziyeDonustur();
    degisim = [ { x: 0, y: 0, deger: 0 } ];
    ara(labirent);
    if (cizimli)
        labirentCiz(labirent);
}

// x: sütun no  y: satır no   w: genislik   h: yükseklik 
function hucreCiz(x, y, w, h, renk = "black" ) {
    ctx.fillStyle = renk;
    ctx.fillRect(x * w, y * h, w, h);
}

function labirentCiz(labirent) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // temizle
    var dizi = labirent;
    if (!dizi) dizi = diziyeDonustur();
    satirAdet = dizi.length;
    sutunAdet = dizi[0].length;
    hucreGen = canvas.width / sutunAdet;
    hucreYuk = canvas.height / satirAdet;

    for (var y = 0; y < sutunAdet; y++) {

        for (var x = 0; x < satirAdet; x++) {
            var deger = dizi[y][x];
            var renk = renkBelirle(deger);
            hucreCiz(x, y, hucreGen, hucreYuk, renk);
        }

    }

}

function renkBelirle(deger) {
    switch (deger) {
        case "0":
            renk = "white"; // yol rengi
            break;
        case "1":
            renk = "black"; // duvar rengi
            break;
        case "7":
            renk = "green"; // gezilen yol
            break;
        case "9":
            renk = chkCikmazGoster.checked ? "red" : "white"; // çıkmaz yol
            break;
        default:
            renk = "white";
    }

    return renk;
}

function diziyeDonustur() {
    var kaynak = txtKaynak.value.trim();
    var satirlar = kaynak.split("\n");
    var dizi = [];
    for (var i = 0; i < satirlar.length; i++) {
        dizi.push(satirlar[i].split(""));
    }
    return dizi;
}

function diziKopyala(dizi) {
    return JSON.parse(JSON.stringify(dizi));
}

animasyonBasladiMi = false;
var animIndex = 0;
function animasyon() {
    if (!animasyonBasladiMi) return;

    if (animIndex == 0) {
        labirentCoz(false); // çizimsiz çöz
        labirentCiz(); // çözümsüz labirenti çiz, sonraki değişimler üzerinde sırayla gösterilecek
    }
    var d = degisim[animIndex];
    hucreCiz(d.x, d.y, hucreGen, hucreYuk, renkBelirle(d.deger));

    setTimeout(function() {
        if (++animIndex < degisim.length) {
            animasyon();
        }
        else {
            animIndex = 0;
            btnAnimasyon.textContent = "Gezinme Animasyonunu Başlat";
            animasyonBasladiMi = false;
        }
    }, Math.round(1000 / rangeHiz.value));
}

btnAnimasyon.addEventListener("click", function() {
    if (!animasyonBasladiMi) {
        animasyonBasladiMi = true;
        btnAnimasyon.textContent = "Gezinme Animasyonunu Duraklat";
        animasyon();
    } else {
        animasyonBasladiMi = false;
        btnAnimasyon.textContent = "Gezinme Animasyonuna Devam Et";
    }
});

labirentCiz();