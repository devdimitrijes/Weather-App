const hamburgerMeni = document.querySelector("#HamburgerMeni");
const HeaderLinkovi = document.querySelector("#HeaderLinks");

const DugmeBrisanje = document.querySelector("#DeleteTh");

hamburgerMeni.addEventListener("click", function() { //Klik na Hamburger meni
    hamburgerMeni.classList.toggle("active");
    HeaderLinkovi.classList.toggle("active");
});

document.querySelectorAll(".HeaderLink").forEach(a => { //Klik na bilo koji Header link
    a.addEventListener("click", function() {
        hamburgerMeni.classList.remove("active");
        HeaderLinkovi.classList.remove("active");
    })
});

DugmeBrisanje.addEventListener("click", function() {
    localStorage.clear();
    location.reload();
});

const InputUnetGrad = document.querySelector("#InputUnosGrada");
const TekstOdgovora = document.querySelector("#Odgovor");
const apiKey = "your_API_key";
const Tabela = document.querySelector("#Tabela");

let ID_grada = 1;

InputUnetGrad.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        let grad = InputUnetGrad.value.toString();
        if (grad === "" || grad.trim() === "") {
            TekstOdgovora.textContent = "No city entered :(";
        }
        else {
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${grad}&appid=${apiKey}&units=metric&lang=en`;
    fetch(url)
    .then(response => {
        if (!response.ok) throw new Error("Network error");
        return response.json();
    })
    .then(data => {
        // console.log(data); //ispis JSON-a u konzoli
        if (/\d/.test(grad)) TekstOdgovora.textContent = "Can't find '" + grad + "'"; //provera jel ne sadrzi broj (npr. ako je postanski broj, ID, itd... Zelimo samo imena gradova, a ne ostalo)
        else { //  /\d/ - bilo koja cifra
        let temperatura = data.main.temp;
        let opisVremena = data.weather[0].description;
        TekstOdgovora.textContent = grad + ": " + temperatura + "°C, " + opisVremena

        let uspesnost = false;
        while (uspesnost === false) {
            if (localStorage.getItem('Id_grada' + ID_grada) === null) {
            uspesnost = true;
                localStorage.setItem('Id_grada' + ID_grada, ID_grada);
                localStorage.setItem('Ime_grada' + ID_grada, grad);
                localStorage.setItem('Vreme_grada' + ID_grada, temperatura + "°C, " + opisVremena);
                displayTrenutniGrad(ID_grada);
            ID_grada++; //Povecavanje ID grada za naredni grad
        } else ID_grada++; //Povecavanje ID grada da bismo pronasli ID za trenutni grad
        }
        uspesnost = false;

        }
    })
    .catch(error => {
        console.error("An error occurred:", error);
        TekstOdgovora.textContent = "Can't find '" + grad + "'"; //Ukoliko API ne može da nađe uneti grad
    });
        }

    }
});

function display() {
    //Kreiranje novog reda u tabeli
    for (let i = 1; i <= localStorage.length; i++) { //delimo sa 3 jer nam treba ID = 1, a imamo 3 elementa u lStorage: ID, Ime, Vreme
        if (localStorage.getItem('Id_grada' + i) !== null) {
        let novTr = document.createElement('tr');
        Tabela.appendChild(novTr);
        let imeGrada = document.createElement('td');
        novTr.append(imeGrada);
        imeGrada.textContent = localStorage.getItem('Ime_grada' + i);
        let Vreme = document.createElement('td');
        novTr.append(Vreme);
        Vreme.textContent = localStorage.getItem('Vreme_grada' + i);
        let Delete = document.createElement('td');
        novTr.append(Delete);
        Delete.classList.add("DeleteJedanGrad");
        Delete.textContent = "Delete";
        Delete.addEventListener("click", function() {
        this.parentElement.remove();
        localStorage.removeItem('Ime_grada' + i);
        localStorage.removeItem('Vreme_grada' + i);
        localStorage.removeItem('Id_grada' + i);
    })
        }
    }
}

function displayTrenutniGrad(ID) {
        let novTr = document.createElement('tr');
        Tabela.appendChild(novTr);
        let imeGrada = document.createElement('td');
        novTr.append(imeGrada);
        imeGrada.textContent = localStorage.getItem('Ime_grada' + ID);
        let Vreme = document.createElement('td');
        novTr.append(Vreme);
        Vreme.textContent = localStorage.getItem('Vreme_grada' + ID);
        let Delete = document.createElement('td');
        novTr.append(Delete);
        Delete.classList.add("DeleteJedanGrad");
        Delete.textContent = "Delete";
        Delete.addEventListener("click", function() {
        localStorage.removeItem('Ime_grada' + ID);
        localStorage.removeItem('Vreme_grada' + ID);
        localStorage.removeItem('Id_grada' + ID);
        this.parentElement.remove();
    })
}

// Array.from(document.getElementsByClassName("DeleteJedanGrad")).forEach(dugme => { //Array.from() - pretvara u niz!!!!!
//         dugme.addEventListener("click", function() {
//         this.parentElement.remove();
//     });
// });

display();