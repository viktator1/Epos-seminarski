
const dugme = document.getElementsByClassName("dugme-meni")[0]
const linkovi = document.getElementsByClassName("linkovi-zaglavlje")[0]
const prijava=document.getElementById("forma-prijava");

localStorage.setItem("ime","");
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

    fetch("https://grcki-kino-epos.herokuapp.com/signin",{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:ime,password:sifra})
    }).then(res=>{
        if(res.status==200) {
            localStorage.setItem("ime",ime);
            window.location.assign("kino.html");
        }
        else alert("pogresni podaci");
    })

    
}


