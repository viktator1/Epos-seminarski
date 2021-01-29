const dugme = document.getElementsByClassName("dugme-meni")[0]
const linkovi = document.getElementsByClassName("linkovi-zaglavlje")[0]
const prijava=document.getElementById("forma-prijava");

// dugme.addEventListener('click', () =>{
//     linkovi.classList.toggle('active')
// })
prijava.addEventListener("submit",prenosImena);

function prenosImena(e){
    e.preventDefault();
    let ime=document.getElementById("ime").value;
    let sifra=document.getElementById("sifra").value;
    document.getElementById("ime").value="";
    document.getElementById("sifra").value="";

    if(ime.length<3) {
        alert("Ime mora imati bar 3 slova");
        return;
    };

    if(sifra.length<5){
        alert("Sifra mora imati bar 5 slova");
        return;
    }

    fetch("https://grcki-kino-epos.herokuapp.com/register",{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:ime,password:sifra})
    }).then(res=>{
        if(res.status==200) window.location.assign("index.html");
        else alert("losi podaci");
    });

}
