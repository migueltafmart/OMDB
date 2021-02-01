const auth = require("./auth");
db = require("../models/mngdb");

//GET Petitions
exports.getDashBoard = (req, res) => {
  if (req.role === "user") {
    res.status(200).render("dashboard", { menu: true, admin: false});
  } else {
    res.status(403).redirect('/movies');
  }
};

//? mngdb.js READ
//! MongoDB
exports.getMovieDetails = async (req, res) => {
  let lectura = await db.readFilmDetails(req.params.Title);
  res.status(200).json({ status: "Film details achieved!", data: { lectura } });
  if (req.role === 'user') {
    console.log(req.params.id);
    let result = await db.readFilmDetails(req.params.id);
    res
      .status(200)
      .json({
        status: "Film achieved!",
        data: result, // JSON.stringify(result)
        id: result.id,
      });
  } else {
    res.status(403).redirect('/movies');
  }
};
exports.getMovies = async (req, res) => {
  if (req.role == "admin") {
    res.status(200).render("movies", {
      title: 'Admin',
      menu: true,
      admin: true
    }); //! render('movies', JSON de usuario)
  } else if (req.role == "user") {
    res.status(200).render('movies', {
      title: 'User',
      menu: true,
      admin: false
    }); //! render('movies', JSON de admin)
  }; //? ¿? - ('movies') o ('search')  - ¿Un pug para la lista de pelis del usuario y otro pug para todas las peliculas contenidas en la app?
};
exports.getMyMovies = async (req, res) => {
  if (req.role == "admin") {
    res.status(200).render("movies", {
      title: 'Admin',
      menu: true,
      admin: true
    }); //! render('movies', JSON de usuario)
  } else if (req.role == "user") {
    res.status(200).render('movies', {
      title: 'User',
      menu: true,
      admin: false
    }); //! render('movies', JSON de admin)
  };
  //? ¿? - ('movies') o ('search') - ¿Un pug para la lista de pelis del usuario y otro pug para todas las peliculas contenidas en la app?
};
exports.getLogIn = (req, res) => {
  if (req.cookies.aCookie || req.cookies.gCookie) {
    res.status(403).redirect('/');
  } else {
    res.status(200).render('login', {menu: false});
  }

}
exports.getLogOut = (req, res) => {
  if (req.cookies.aCookie) {
    res.status(200)
      .clearCookie('aCookie')
      .render('index', {menu: false})

  } else if (req.cookies.gCookie) {
    res.status(200)
      .clearCookie('gCookie')
      .render('index', {menu: false})
  } else {
    res.status(403)
      .redirect('/login')
  }

}
//POST petitions:

// 1. exports.postLogIn
//? Validación de credenciales con algún tipo de redirecccion a auth.js - ¿?
// abrir sesión y redirección a /dashboard si es Usuario, o /movies si es Administrador:

// IDEA: quiero que al rellenar el formulario de la vista de login, si los datos introducidos coinciden con datos de user, la app se direccione a la vista de dashboard.pug y en caso de que esos datos coincidan con datos de admin, la app se direccione a la vista de movies.pug

// if logged render('dashboard') - if !== logged render('login')

exports.postLogIn = (req, res) => auth.signIn(req, res);

exports.claims = (req, res, next) => auth.checkToken(req, res, next);

// 2. exports.postLogOut
// Cierre de sesión y redirección a /

//? IDEA: quiero que cuando se realize este post la app se direccione a la vista de index.pug en su formato de /logout

/* exports.postLogOut = (req, res) => {
    res.status(200).render('index');
} */

// 3. exports.postNewMovie

//? IDEA: quiero que cuando se realize este post la app se direccione a la vista de movieAdmin.pug en su formato de /createMovie

//? mngdb.js CREATE
//! MongoDB
exports.postNewMovie = async (req, res) => {
  console.log(req.body);
  let result = await db.createAdminMovie(req.body);
  res
    .status(200)
    .redirect("/movies");;
};

//PUT petitions
// IDEA: quiero que cuando se realize este put la app se direccione a la vista de movieAdmin.pug en su formato de /editMovie

//! MongoDB
//* mngdb.js UPDATE
exports.putMovieDetails = async (req, res) => {
  console.log(req.body.id);
  let modification = await db.updateFilmDetails(req.body.id);
  res
    .status(200)
    .json({ status: "Film value/values updated", data: { modification } });
};

//! MongoDB
//* mngdb.js DELETE VALUE/VALUES FROM DOCUMENT
exports.deleteMovieDetails = async (req, res) => {
  console.log(req.body.id);
  let valueElimination = await db.deleteFilmDetails(req.body.id);
  res
    .status(200)
    .json({ status: "Film value/values deleted", data: { valueElimination } });
};
