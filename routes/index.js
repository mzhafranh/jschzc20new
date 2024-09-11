var express = require('express');
var router = express.Router();

// module.exports = router;
module.exports = function (db) {

  function add(name, height, weight, birthdate, married, callback) {
    db.run('INSERT INTO data (name, height, weight, birthdate, married) VALUES (?, ?, ?, ?, ?)', [name, height, weight, birthdate, married], (err) => {
      callback(err);
    });
  }

  function select(id, callback) {
    db.all('SELECT * FROM data WHERE id = ?', [id], (err, data) => {
      console.log(data)
      callback(err, data);
    })
  }

  function update(id, name, height, weight, birthdate, married, callback) {
    db.run('UPDATE data SET name = ?, height = ?, weight = ?, birthdate = ?, married = ? WHERE id = ?', [name, height, weight, birthdate, married, id], (err) => {
      callback(err);
    });
  }

  function remove(id, callback) {
    db.run('DELETE FROM data WHERE id = ?', [id], (err) => {
      callback(err);
    })
  }

  /* GET home page. */
  router.get('/', function (req, res, next) {
    let sql = 'SELECT * FROM data';

    db.all(sql, [], (err, data) => {
      if (err) {
        console.error(err);
      }
      res.render('index', { rows: data })
    })
  });

  // db.all(sql, values, (err, data) => {
  //   if (err) {
  //       console.error(err);
  //   }
  //   const pages = Math.ceil(data[0].total / limit)
  //   sql = 'SELECT * FROM data'
  //   if (wheres.length > 0) {
  //       sql += ` WHERE ${wheres.join(' AND ')}`
  //   }
  //   sql += ' LIMIT ? OFFSET ?';
  //   console.log(sql)
  //   db.all(sql, [...values, limit, offset], (err, data) => {
  //       if (err) {
  //           console.error(err);
  //       }
  //       res.render('list', { rows: data, pages, page, filter })
  //   })
  // })

  router.get('/add', (req, res) => {
    res.render('add')
  })

  router.post('/add', (req, res) => {
    add(req.body.name, parseInt(req.body.height), parseFloat(req.body.weight), req.body.birthdate, req.body.married, (err) => {
      if (err) {
        console.error(err);
      }
    })
    res.redirect('/');
  })

  router.get('/edit/:id', (req, res) => {
    select(parseInt(req.params.id), (err, data) => {
      if (err) {
        console.error(err);
      }
      console.log(data[0])
      res.render('edit', { item: data[0] })
    })
  })

  router.post('/edit/:id', (req, res) => {
    update(parseInt(req.params.id), req.body.name, parseInt(req.body.height), parseFloat(req.body.weight), req.body.birthdate, req.body.married, (err) => {
      if (err) {
        console.error(err)
      }
      res.redirect('/');
    })
  })

  router.get('/delete/:id', (req, res) => {
    const index = parseInt(req.params.id)
    remove(index, (err) => {
        if (err) {
            console.error(err);
        }
    })
    res.redirect('/');
  })



  return router;
}