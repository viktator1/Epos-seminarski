const express=require("express");
const cors=require("cors");
const knex=require("knex");

const app=express();

const database=knex ({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'viktor',        
      password : 'admin',   
      database : 'kino'
    }
  });



app.use(cors());
app.use(express.json());

function prikaziTabelu(){
    database.select('*').from('korisnici').then(data=>console.log(data));
}

app.post("/register",(req,res)=>{
    let ime=req.body.name;
    let sifra=req.body.password;
    database('korisnici').insert({name:ime,password:sifra})
    .then((ans)=>{       
        res.status(200).json("uspesna registracija");
    })
    .catch((err)=>{
        res.status(400).json("greska");
    });    
})

app.post("/signin",(req,res)=>{
    let ime=req.body.name;
    let sifra=req.body.password;
    database('korisnici').where({name:ime,password:sifra})
    .then(ans=>{
        if(ans.length) res.status(200).json("uspesno logovanje");
        else res.status(400).json("greska");
    })
})

app.post("/stanjeKredita",(req,res)=>{
    let ime=req.body.name;
    database.select('novac').from('korisnici').where('name','=',ime)
    .then(data=>{
        res.json({'novac':data[0].novac});
    });
})

app.put("/azuriranjeKredita",(req,res)=>{
    let kredit=req.body.kredit;
    let ime=req.body.name;
    database('korisnici').where('name','=',ime).update({novac:kredit})
    .then((data)=>res.status(200).json("uspesno azurirano"))
    .catch((err)=>res.status(400).json("greska"));
})




app.listen("3000",()=>{
    console.log("aplikacija je pokrenuta na portu 3000");
});

