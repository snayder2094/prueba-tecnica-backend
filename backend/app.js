const express = require('express');
const mysql = require('mysql');

const  bodyParser = require('body-parser');

const PORT =  process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'DB'
})

// routes
app.get('/', (request, response) => {
    const  sql = 'SELECT * FROM DB.Users';
    connection.query(sql, (err, result) => {
        if (err) throw err
        if (result.length > 0){
            response.json(result)
        }else {
            response.send('No hay usuarios guardados')
        }
    })
})
app.post('/create', (request, response ) => {
    const  sql = 'INSERT INTO DB.Users SET ?'
    const user = {
        Citizen_id: request.body.Citizen_id,
        Name: request.body.Name,
        Country: request.body.Country
    }
    connection.query(sql, user, (err) => {
        if (err) throw err
        response.send('Usuario creado')
    })
} )

app.put('/update/:id', (request, response) => {
    const { id }= request.params;
    const { Citizen_id, Name, Country} = request.body;
    const sql = `UPDATE DB.Users SET Citizen_id = ${Citizen_id}, Name = '${Name}', Country = '${Country}' where id = ${id}`;
    connection.query(sql, (err) => {
        if (err) throw  err
        response.send('Usuario editado')
    })

})

app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const sql = `DELETE FROM DB.Users WHERE id = ${id}`
    connection.query(sql, (err) => {
        if (err) throw  err
        response.send('Usuario eliminado')
    })
})

connection.connect(err => {
    if (err) console.log(err.toString())
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))