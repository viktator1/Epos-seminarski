const {database}=require('pg');

const express=require("express");
const cors=require("cors");
const knex=require("knex");

const app=express();

const database=knex ({
    client: 'pg',
    connection: {
        connectionString : process.env.DATABASE_URL,
        ssl:true
    }
  });

const PORT=process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

function prikaziTabelu(){
    database.select('*').from('korisnici').then(data=>console.log(data));
}

app.get("/",(req,res)=>{
    prikaziTabelu();
    res.send("aplikacija radi");
})

app.post("/register",(req,res)=>{
    let ime=req.body.name;
    let sifra=req.body.password;
    console.log("ime: ",ime," sifra: ",sifra);
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
    })
    .catch((err)=>res.status(400).json("greska"));
})

app.put("/azuriranjeKredita",(req,res)=>{
    let kredit=req.body.kredit;
    let ime=req.body.name;
    database('korisnici').where('name','=',ime).update({novac:kredit})
    .then((data)=>res.status(200).json("uspesno azurirano"))
    .catch((err)=>res.status(400).json("greska"));
})




app.listen(PORT,()=>{
    console.log(`aplikacija je pokrenuta na portu ${PORT}`);
});

