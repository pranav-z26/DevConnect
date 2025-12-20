const express = require('express');

const app = express();
const port = 7777;

app.get('/test', (req, res)=> {
  console.log(req.query); //http://localhost:7777/test?id=101&name=pranav
  res.send('This is a get test endpoint!'); 
})

app.get('/test/:id', (req, res)=> {
  console.log(req.params);
  const id = req.params.id;
  res.send(`This is a get test endpoint with id: ${id}`); 
})

// app.post('/test', (req, res)=> {
//   res.send({firstName:"Pranav", lastName: "Zagade"}); 
// })

// app.put('/test', (req, res)=> { 
//   res.send('Data updated in db!'); 
// })

// app.delete('/test', (req, res)=> {
//   res.send('Data deleted from db!'); 
// })

// app.use('/test', (req, res) => {
//   res.send('test test test!');
// });


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});