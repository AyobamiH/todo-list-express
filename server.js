// Require all modules

const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
const store = require("store2");
require('dotenv').config()



// declare, initialise variable 
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

    // Connect to the database using mongoclient
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })


    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Setting up routes for CRUD operation

app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    const itemscompleted = await db.collection('todos').countDocuments({completed: true} )
   
    response.render('index.ejs', { items: todoItems, left: itemsLeft, completed: itemscompleted })
    // db.collection('todos').find().toArray()
    // .then(data => {
        
    //     db.collection('todos').countDocuments({completed: false})

        
    //     .then((itemsLeft) => {
    //         response.render('index.ejs', { items: data, left: itemsLeft, completed: itemsCompleted})
    //     })
    // })
    // .catch(error => console.error(error))
})


app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false, deleted: false, pomocount: request.body.pomoValue, createdAt: Date.now})
    
    .then(result => {
        console.log('Todo Added')
        
         response.redirect('/')
    })
    .catch(error => console.error(error))
})


app.put('/markComplete', (request, response) => {

    db.collection('todos').updateOne({thing: request.body.itemFromJS },{
        $set: {
            completed: true,
            pomocount: [request.body.pomoValue, Date.now],

          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')

        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})



// app.put('/updateSession', (request, response) => {
//     console.log()
//     db.collection('todos').updateOne({thing: request.body.itemFromJS},{
//         $set: {

//             pomocount: request.body.sessionFromJS
            
//           }
//     },{
//         sort: {_id: -1},
//         upsert: true
//     })
//     .then(result => {
//         console.log('session updated ')
//         response.json('session updated')
//     })
//     .catch(error => console.error(error))

// })



app.put('/markUnComplete', (request, response) => {
    
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false,
            pomocount: request.body.pomoValue
            
          }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Marked InComplete')
        response.json('Marked InComplete')
    })
    .catch(error => console.error(error))

})

// TODO: Add delete status to documents in collection

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},
        {
            $set: {
                deleted: [true, Date.now]
                
            }
        })
    
    .then(result => {
        console.log('Todo Deleted')
        
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
}) 