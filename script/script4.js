$(document).ready(function(){
    $("p").click(function(){
        $(".test").css("border","3px solid black");
    })

    $("#draggable").draggable();

    $(".dugme-meni").click(function(){
        $(".linkovi-zaglavlje").toggleClass("active")
    })
});

