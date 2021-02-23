let brojKombinacija=0;
let kredit=0;
let kvota=1;
let izvuceniBrojevi=[];
let uplaceniBrojevi=[];
let iznosUplate=0;
let postojiUplata=false;
let ime="";

function podesavanjeImena(){
    
    let prenosImena=document.getElementById("prenos-imena");
    prenosImena.innerHTML= localStorage.getItem("ime");
    ime=localStorage.getItem("ime");
    
    proveraImena();
}

function proveraImena(){
    if(ime==null || ime.length<3){
        window.location.assign("index.html");       
    }
}

async function podesiKredit(){
    let kreditPolje=document.getElementById("kredit");
    const jedan= await fetch("https://grcki-kino-epos.herokuapp.com/stanjeKredita",{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:ime})
     });
     const dva=await jedan.json();
     const tri=await dva.novac;
     kredit=tri;
     kreditPolje.innerHTML=tri;
     
    
}

async function izvlacenje(){
    let dugmeZaIzvlacenje=document.getElementById("pokreni");
    dugmeZaIzvlacenje.disabled=true;
    resetuj();
    let brojac=0;
    let polje=document.getElementById("izvlacenje-broja");
    let poljeZaBrojeve=document.getElementById("izvuceni-brojevi");
    izvuceniBrojevi =[];

    while(brojac<20){
        let znak=true;
        let broj;
        while(znak){
            // generisanje broja i provera da li je vec izvucen 
            broj= Math.round(Math.random()*1000) % 80 + 1;
            izvuceniBrojevi.includes(broj) ? znak=true :znak=false;
        }
        izvuceniBrojevi[brojac]=broj;
        polje.innerHTML=broj;
        brojac++;
        poljeZaBrojeve.innerHTML=izvuceniBrojevi;
        document.getElementById(broj).classList.add("izvucen");
        let promise=new Promise((resolve,reject)=>{
            setTimeout(()=>{resolve()},1000);
        })
        await promise;

    }   
    
    proveraIzvucenihBrojeva();
    napraviDivZaIzvuceneBrojeve();
    postojiUplata=false;
    dugmeZaIzvlacenje.disabled=false;

}

function uplata(){
    document.getElementById("za-uplatu").style.zIndex=1;
}
function zatvori(){
    document.getElementById("za-uplatu").style.zIndex=-1;
}
function uplati(){

    if(postojiUplata){
        alert("Mozete uplatiti najvise jedan tiket za jedno kolo");
        return;
    }

    uplaceniBrojevi=[];
    for(let i=0;i<brojKombinacija;i++){
        let pom=document.getElementsByClassName("broj-za-uplatu"+(i+1));
        if(!daLiJeBrojIspravan(pom[0].value)){
            alert("Broj na poziciji "+(i+1) +" je neispravan");
            return;
        }

        uplaceniBrojevi[i]=pom[0].value;

    }

    if(imaLiDuplikata(uplaceniBrojevi)){
        alert("Brojevi moraju biti jedinstveni");
        return;
    }

    iznosUplate=document.getElementById("iznosUplate").value;
    if(!daLiJeUplataIspravna(iznosUplate)){
        console.log(kredit,iznosUplate);
        alert("Uplata nije ispravna");
        return;
    }

    kredit=kredit-iznosUplate;
    postojiUplata=true;

    

    podesiKreditInterno();
    napraviDivZaBrojeve();
    ocistiPoljaZaBrojeve();
    zatvori();
}
function resetuj(){
    for(let i=1;i<81;i++){
        document.getElementById(i).classList.remove("izvucen");
    }
}
function potvrdi(){

    brojKombinacija=document.getElementById("izborBrojeva").value;
    let prozorZaKombinacije=document.getElementById("prozor-za-izbor-brojeva");

    
    ocistiPoljaZaBrojeve();

    kvota=1;

    //kreiranje polja za izbor brojeva
    for(let i=0;i<brojKombinacija;i++){
        kvota *=4;
        let div=document.createElement("DIV");
        let node=document.createElement("P");
        let text=document.createTextNode((i+1)+":");
        node.appendChild(text);
        let input=document.createElement("INPUT");
        //style
        node.style.width="10%";
        node.style.margin="0";
        div.style.display="flex";
        input.classList.add("broj-za-uplatu"+(i+1));

        div.appendChild(node);
        div.appendChild(input)
        prozorZaKombinacije.appendChild(div);
        
    }

    //polje za uplatu
    let div=document.createElement("DIV");
    let node=document.createElement("P");
    let text=document.createTextNode("Iznos uplate:");
    let input=document.createElement("INPUT");
    input.id="iznosUplate";
    node.appendChild(text);
    div.appendChild(node);
    div.appendChild(input);
    prozorZaKombinacije.appendChild(div);

    //labela za kvou
    let p=document.createElement("P");
    let text1=document.createTextNode("Vasa kvota je "+ kvota);
    p.appendChild(text1);
    prozorZaKombinacije.appendChild(p);

    

}

function ocistiPoljaZaBrojeve(){
    let div=document.getElementById("prozor-za-izbor-brojeva");
    while(div.hasChildNodes()){
        div.removeChild(div.firstChild);
    }
}
function daLiJeBrojIspravan(broj){
    let int=Number(broj);
    if(Number.isInteger(int) && int>0 && int<81){
        return true;
        }
    
    return false;
}
function daLiJeUplataIspravna(broj){
    let int = Number(broj);
    if(int > 0 && int<=kredit) return true;
    return false;
}

function proveraIzvucenihBrojeva(){
    for(let i=0;i<uplaceniBrojevi.length;i++){
        let broj=Number(uplaceniBrojevi[i]);
      if(!izvuceniBrojevi.includes(broj)){
          return;
      }
    }
    
    kredit=kredit+iznosUplate*kvota;
    podesiKreditInterno();
}

function imaLiDuplikata(niz) {
    return (new Set(niz)).size !== niz.length;
}

function napraviDivZaBrojeve(){

    let div=document.createElement("DIV");
    div.style.display="flex";
    div.style.flexWrap="wrap";
    div.style.backgroundColor="blue";
    div.style.width="100%";
    div.style.margin="3px";
    div.style.justifyContent="center";
    for(let i=0;i<uplaceniBrojevi.length;i++){
        let kuglica=document.createElement("div");
        let text=document.createTextNode(uplaceniBrojevi[i]);
        kuglica.appendChild(text);
        kuglica.style.width="25px";
        kuglica.style.height="25px";
        kuglica.style.borderRadius="50px";
        kuglica.style.backgroundColor="crimson";
        kuglica.style.margin="3px";
        kuglica.style.textAlign="center";
        div.appendChild(kuglica);
    }

    let pom=document.getElementsByClassName("desno");
    pom[0].appendChild(div);

}

function napraviDivZaIzvuceneBrojeve(){
    let div=document.createElement("div");
    div.style.display="flex";
    div.style.flexWrap="wrap";
    div.style.backgroundColor="blue";
    div.style.width="100%";
    div.style.margin="3px";
    div.style.justifyContent="center";
    let niz=izvuceniBrojevi.sort(function (a,b){return a-b});
    for(let i=0;i<niz.length;i++){
        let kuglica=document.createElement("div");
        let text=document.createTextNode(niz[i]);
        kuglica.appendChild(text);
        kuglica.style.width="25px";
        kuglica.style.height="25px";
        kuglica.style.borderRadius="50px";
        kuglica.style.backgroundColor="crimson";
        kuglica.style.margin="3px";
        kuglica.style.textAlign="center";
        div.appendChild(kuglica);
    }
    let pom=document.getElementsByClassName("levo");
    pom[0].appendChild(div);
}

function padajuciMeni(){
    const dugme = document.getElementsByClassName("dugme-meni")[0]
    const linkovi = document.getElementsByClassName("linkovi-zaglavlje")[0]

    dugme.addEventListener('click', () =>{
        linkovi.classList.toggle('active')
    })
}

function podesiKreditInterno(){
    let kreditPolje=document.getElementById("kredit");
    kreditPolje.innerHTML=kredit;
    azurirajKreditNaServeru();
}

function azurirajKreditNaServeru(){
    console.log("da");
    fetch("https://grcki-kino-epos.herokuapp.com/azuriranjeKredita",{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:ime,kredit:kredit})
    }).catch((err)=>alert("Doslo je do greske prilikom azuriranja na serveru"));
}


window.onload=podesavanjeImena();
window.onload=podesiKredit();
window.onload=padajuciMeni();
