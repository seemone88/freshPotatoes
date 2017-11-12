const sqlite3 = require('sqlite3'),
      Sequelize = require('sequelize'),
      request = require('request'),
      express = require('express'),
      app = express();

const { PORT=3000, NODE_ENV='development', DB_PATH='./db/database.db' } = process.env;
let db = new sqlite3.Database('db/database.db');
// START SERVER
Promise.resolve()
  .then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch((err) => { if (NODE_ENV === 'development') console.error(err.stack); });


// ROUTES
app.get('/films/:id/recommendations', getFilmRecommendations);
app.get('/', function (req, res) {

  db.all('SELECT * FROM films', [], function(err, rows) {
    if (err) {
      throw err;
    }
    rows.forEach(function(row) {
      console.log(row.title);
      console.log(row.id);
      console.log(row.release_date);
      console.log(row.genre_id);
  db.all('SELECT name FROM genres WHERE id=?',row.genre_id, function(err, name){
    console.log(name);

    });
    });
  });
});

// var server = app.listen(3000, function () {
//     console.log('Server is running..');
// });
// ROUTE HANDLER
function getFilmRecommendations(req, res) {
  var rec = {};
  var arry = [];
  db.all('SELECT * FROM films WHERE id=?', req.params.id, function(err, film){

    db.all('SELECT id, title, genre_id, release_date FROM films WHERE genre_id=? ORDER BY id', film[0].genre_id, function(err, rows){

      rows.forEach(function(row){

        var obj = {
          id : row.id,
          title : row.title,
          releaseDate : row.release_date
        };

        db.all('SELECT name FROM genres WHERE id=?', row.genre_id, function(err, name){
          obj.genre = name[0].name;
          arry.push(obj);
        });

      })
      setTimeout(function(){
        rec.recommendations = arry;
        console.log(rec);
      },1000);
    });
  })
  res.end();
}

module.exports = app;
