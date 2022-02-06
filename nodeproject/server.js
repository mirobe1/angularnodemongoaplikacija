const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()
const cors = require('cors')
var ObjectId = require('mongodb').ObjectId; 

app.use(cors())
const connectionString = 'mongodb+srv://mirobe:Miro123@mirocluster.mk95g.mongodb.net/recepies?retryWrites=true&w=majority'

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

// spremanje recepta i njegovih sasatojaka
app.post('/recepies', (req, res) => {
  //console.log(req.body);

  const recipe = {"name":req.body.name, "description": req.body.description};
  const arraySastojaka = req.body.sastojci.split(',')
  //console.log(arraySastojaka);


  //spremanje recepta
  MongoClient.connect(connectionString, (err, client) => {
    const db = client.db('recepies')
    const cursor = db.collection('recepies').insertOne(recipe).then(results => {
      // console.log('results');
      // console.log(results);
      // console.log('recipe');
      // console.log(recipe);
      
      const objektSastojaka = [];
      arraySastojaka.forEach(element => {
        objektSastojaka.push({'recepies_id':results.insertedId, 'name':element})
      });
      //console.log('sastojci za bazu');
      //console.log(objektSastojaka);
      const cursor2 = db.collection('ingredients').insertMany(objektSastojaka).then(results => {
      
    
        res.send();
      }).catch(error => console.error(error))

      //res.send();
    })
    .catch(error => console.error(error))
  })
})

// dohvati recept za update
app.get('/recepieforupdate', (req, res) => {
  //console.log('req.query.id');
  //console.log(req.query.id);
  var o_id = new ObjectId(req.query.id);

  MongoClient.connect(connectionString, (err, client) => {
    const db = client.db('recepies')




    // const cursor = db.collection('recepies').findOne({'_id':o_id}).then(results => {
    //   console.log('jedan');
    //   console.log(results);
    //   //res.send(results);
    // })
    // .catch(error => console.error(error))


    const cursor = db.collection('recepies').aggregate( [
      { $match: {'_id':o_id} },
      {
        $lookup:
        {
          from: "ingredients",
          localField: "_id",
          foreignField: "recepies_id",
          as: "ingredients"
        }
     },
     { $unwind: "$ingredients" }
   ] ).toArray().then(results => {
      console.log(results);
      
      var result = {};
      result._id = results[0]._id;
      result.description = results[0].description;
      result.name = results[0].name;
      var sastojci = "";
      results.forEach(element => {
           sastojci = sastojci + element.ingredients.name;
           sastojci = sastojci + ',';
         });
         result.sastojci = sastojci.slice(0, -1);
         //console.log('result');
         //console.log(result);

    res.send(result);
  })
  .catch(error => console.error(error))



  })
})

// update recepta
app.put('/recepieforupdate', (req, res) => {
  //console.log(req.query.id);
  //console.log(req.body);


  var o_id = new ObjectId(req.query.id);

  MongoClient.connect(connectionString, (err, client) => {
    const db = client.db('recepies')




    // const cursor = db.collection('recepies').findOne({'_id':o_id}).then(results => {
    //   console.log('jedan');
    //   console.log(results);
    //   //res.send(results);
    // })
    // .catch(error => console.error(error))


    const cursor = db.collection('recepies').aggregate( [
      { $match: {'_id':o_id} },
      {
        $lookup:
        {
          from: "ingredients",
          localField: "_id",
          foreignField: "recepies_id",
          as: "ingredients"
        }
     },
     { $unwind: "$ingredients" }
   ] ).toArray().then(results => {
      //console.log(results);
      
      var result = {};
      result._id = results[0]._id;
      result.description = results[0].description;
      result.name = results[0].name;
      var sastojci = "";
      results.forEach(element => {
           sastojci = sastojci + element.ingredients.name;
           sastojci = sastojci + ',';
         });
         result.sastojci = sastojci.slice(0, -1);

          const arraySvihSastojakaIzAplikacije = req.body.sastojci.split(',')
          const arraySvihSastojakaIzBaze = result.sastojci.split(',')

          var arraySamoAplikacija = arraySvihSastojakaIzAplikacije.filter(x => arraySvihSastojakaIzBaze.indexOf(x) === -1);
          //console.log('arraySamoAplikacija');
          //console.log(arraySamoAplikacija);
          var arraySamoBaza = arraySvihSastojakaIzBaze.filter(x => arraySvihSastojakaIzAplikacije.indexOf(x) === -1);
          //console.log('arraySamoBaza');
          //console.log(arraySamoBaza);

          
          MongoClient.connect(connectionString, (err, client) => {
            const db = client.db('recepies')
        
            var arrayZaInsertSastojaka = [];
            var arrayZaBrisanjeSastojaka = [];
            arraySamoAplikacija.forEach(element => {
              arrayZaInsertSastojaka.push({'recepies_id': o_id, 'name': element});
            });
            
          //console.log('arrayZaInsertSastojaka');
          //console.log(arrayZaInsertSastojaka);

            arraySamoBaza.forEach(element => {
              arrayZaBrisanjeSastojaka.push(element);
            });

            //console.log('arrayZaBrisanjeSastojaka');
          //console.log(arrayZaBrisanjeSastojaka);

          const cursor2 = db.collection('ingredients').deleteMany({'recepies_id':o_id, 'name':{ $in: arrayZaBrisanjeSastojaka }}).then(results => {
            //console.log('Rezultati brisanja');
            //console.log(results);
          const cursor3 = db.collection('recepies').updateOne({ '_id': o_id }, { $set: {'name':req.body.name, 'description':req.body.description} }).then(results => {

            if(arrayZaInsertSastojaka.length > 0){
              const cursor4 = db.collection('ingredients').insertMany(arrayZaInsertSastojaka).then(results => {
                res.send();
              }).catch(error => console.error(error))

            }else{
              res.send();
            }           
                //res.send();
              }).catch(error => console.error(error))
  

              res.send();
            }).catch(error => console.error(error))


          })

        //res.send();
  })
  .catch(error => console.error(error))



  })




})
 // brisanje
app.delete('/deleterecepie', (req, res) => {
  var o_id = new ObjectId(req.query.id);
  MongoClient.connect(connectionString, (err, client) => {
    const db = client.db('recepies')
  const cursor = db.collection('ingredients').deleteMany({'recepies_id':o_id}).then(results => {
    const cursor2 = db.collection('recepies').deleteOne({'_id':o_id}).then(results => {
      res.send();
  }).catch(error => console.error(error))

}).catch(error => console.error(error))
})
})



// glavna za filtriranje
app.get('/recepies', (req, res) => {
  console.log(req.query)
  if(req.query.name != undefined){
    var query = '.*' +req.query.name+ '.*';
  }else{
    var query = '.*';
  }


    if(req.query.ingredient != undefined){
      var ingred = '.*' +req.query.ingredient+ '.*';
    }else{
      var ingred = '.*';
    }


    var pageNumber = 1;
    var pageSize = 2;
    if(req.query.pagenumber != undefined){
        pageNumber = parseInt(req.query.pagenumber);
    }
    //var ingred = req.query.ingredient;
    //console.log(ingred)
 MongoClient.connect(connectionString, (err, client) => {
      const db = client.db('recepies')
    const cursor = db.collection('recepies').aggregate( [
      { $match: {"name" : {"$regex" : query }} },
      {
        $lookup:
        {
          from: "ingredients",
          //localField: "_id",
          //foreignField: "recepies_id",
          let: { recepieId: "$_id"},
          pipeline: [
            { $match:
                { $expr:
                    { $and:
                        [
                           
                           { $eq: ["$$recepieId", "$recepies_id" ] }
                           //,{ $eq: [ingred, "$name" ] }
                          //  {
                          //   $regexMatch: {
                          //     input: "$name",
                          //     regex: ingred,
                          //   }
                          // }
                        ]
                    }
                }
            }
        ],
          as: "ingredienti"
        }
     }
     //,{ $unwind: "$ingredients" }
     ,{
      $match: {"ingredienti.name": {"$regex" : ingred }}
      }
   ] ).toArray().then(results => {

    var numberOfResults = results.length;
    
    if(numberOfResults % pageSize == 0){
      var numberOfPages = numberOfResults / pageSize;
    }else{
      var numberOfPages = (parseInt(numberOfResults / pageSize)) + 1;
    }

console.log('Broj stranica');
console.log(numberOfPages);
    const cursor2 = db.collection('recepies').aggregate( [
      { $match: {"name" : {"$regex" : query }} },
      {
        $lookup:
        {
          from: "ingredients",
          //localField: "_id",
          //foreignField: "recepies_id",
          let: { recepieId: "$_id"},
          pipeline: [
            { $match:
                { $expr:
                    { $and:
                        [
                           
                           { $eq: ["$$recepieId", "$recepies_id" ] }
                        ]
                    }
                }
            }
        ],
          as: "ingredienti"
        }
     }
     ,{
      $match: {"ingredienti.name": {"$regex" : ingred }}
      }
   ] ).skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * pageSize ) : 0 ).limit(pageSize).toArray().then(results => {
    //console.log('Rezultati');
      //console.log(results);
      var objektZaPovratak = {};
      objektZaPovratak.recepies = results;
      objektZaPovratak.currentPage = pageNumber;
      objektZaPovratak.numberOfPages = numberOfPages;
      console.log('Rezultantni objekt');
        console.log(objektZaPovratak);
        res.send(objektZaPovratak);
   })  .catch(error => console.error(error))


   })  .catch(error => console.error(error))
  })

})
  // stara za dohvacanje
app.get('/recepies', (req, res) => {
  MongoClient.connect(connectionString, (err, client) => {
  const db = client.db('recepies')
  const cursor = db.collection('recepies').find().toArray().then(results => {
    // console.log('Iz baze')
    // console.log(results)
    res.send(results);
  })
  .catch(error => console.error(error))
})
})


app.listen(3000, function() {
  console.log('listening on 3000')
})
