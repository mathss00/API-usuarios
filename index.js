const express = require("express")
const app = express()
const mysql = require("mysql2/promise")
app.use(express.json())

const pool = mysql.createPool({
    host: "localhost",
    port: 3305,
    user: "root",
    password: "1234",
    database: "usarios_api",
    waitForConnections: true
})

app.get("/usuarios", async (req, res) => {
    const [usuarios] = await pool.execute("SELECT * FROM usuario")
    return res.json(usuarios)
})

app.post("/usuarios", async (req, res) => {
  const { email, senha} = req.body;

if(!email || !senha){
        return res.status(400).json({error: "Email e senha são obrigatorios"})
        
    }

  const [resultado] = await pool.execute("INSERT INTO usuario (email, senha) VALUES (?, ?)",[email, senha])

  return res.status(201).json({id: resultado.insertId, email, senha})

  })

  app.delete("/usuarios/:id", async (req,res) => {
    const id = req.params.id

    const [resultado] = await pool.execute(
        "DELETE FROM usuario WHERE id = ?",
        [id])

        if(resultado.affectedRows == 0){
            return res.status(404).json({error: "Usuario não encontrado!"})
        }''
        return res.status(204).end()
})

app.put("/usuarios/:id", async (req,res) => {
    const { email, senha} = req.body
    const id = req.params.id

    if(!email || !senha) {
        return res.status(400).json({error: "email e senha são obrigatorios"})
    }

    const [resultado] = await pool.execute(
        "UPDATE usuario SET email = ?, senha = ? WHERE id = ?",
        [email, senha, id]
    )
    if(resultado.affectedRows == 0){
            return res.status(404).json({error: "Usuario não encontrado!"})
        }''
        return res.json({
            id, email, senha
        })
})

app.listen(3000, () => console.log("API no ar :D"))