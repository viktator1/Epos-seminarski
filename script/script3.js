function padajuciMeni(){
    const dugme = document.getElementsByClassName("dugme-meni")[0]
    const linkovi = document.getElementsByClassName("linkovi-zaglavlje")[0]

    dugme.addEventListener('click', () =>{
        linkovi.classList.toggle('active')
    })
}


window.onload=padajuciMeni();