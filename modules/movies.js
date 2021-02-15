const auth = require("./auth");
(mongo = require("../models/mongo")), (sql = require("../models/sql"));
const fetch = require("node-fetch");

//GET Petitions
exports.getDashBoard = async (req, res) => {
  if (req.role === "user") {
    res.status(200).render("dashboard", {
      title: "Dashboard",
      menu: true,
      admin: false,
    });
  } else {
    res.status(403).redirect("/movies");
  }
};

//? mngmongo.js READ
//! MongoDB
exports.getMovieDetails = async (req, res) => {
  if (req.role === "user") {
    if (req.params.title && req.params.title.startsWith('tt')){
      fetch(`http://www.omdbapi.com/?i=${req.params.title}&apiKey=${process.env.APIKEY}`)
      .then(res => res.json())
      .then( data =>  {
        res.status(200).render( 'movie',{
          menu: true,
          admin: false,
          status: "Film achieved!",
          data: data, // JSON.stringify(resulƒt)
      });
      });
    } else if (req.params.title){
        res.status(200).render( 'movie',{
          menu: true,
          admin: false,
          status: "Film achieved!",
          data: await mongo.getMovieById(req.params.title), // JSON.stringify(resulƒt)
      });
    }else{
      res.status(403).redirect("/search")
    }
    
  } else {
    res.status(403).redirect("/search");
  }
};
exports.getMovies = async (req, res) => {
  if (req.role == "admin") {
    res.status(200).render("movies", {
      title: "Admin | My Movies",
      menu: true,
      admin: true,
      data: await mongo.readAllMovies(),
    });
  } else if (req.role == "user") {
    if (req.query.s) {
      await fetch(`http://www.omdbapi.com/?s=${req.query.s}&apiKey=${process.env.APIKEY}`)
        .then((res) => res.json())
        .then(async (data) => {
          if (data.Search) {
            res.status(200).render("movies", {
              title: "Find",
              menu: true,
              admin: false,
              search: true,
              data: data,
            });
          } else {
            mongo.readAllMovies(req.query.s).then((data) => {
              if (data.length > 0) {
                res.status(200).render("movies", {
                  title: "My movies",
                  menu: true,
                  admin: false,
                  search: true,
                  data: data,
                });
              } else {
                res.status(200).render("movies", {
                  title: "My Movies",
                  menu: true,
                  admin: false,
                  search: true,
                  data: "We didn't find any movies :C",
                });
              }
            }).catch( err => console.error(err));
          }
        })
        .catch((err) => console.error(err));
    } else {
      res.status(200).render("movies", {
        title: "Find",
        menu: true,
        admin: false,
        search: true,
      });
    }
  }
};
exports.getMyMovies = async (req, res) => {
  if (req.role == "admin") {
    let data = await mongo.readAllMovies();
    res.status(200).render("movies", {
      title: "Admin | My Movies",
      menu: true,
      admin: true,
      data: data,
    }); 
  } else if (req.role == "user") {
    let urls = await sql.favorites(req.email);
    //*Iterar el Array
    let content = await urls.map(async (url) => {
      if (url.startsWith("http://www.omdbapi.com")) {
        return await fetch(`${url}&apiKey=${process.env.APIKEY}`)
          .then((resp) => resp.json())
          .then((data) => data);
      } else {
        return await mongo.getMovieById(url);
      }
    });
    let datos = await Promise.all(content).catch((err) => console.error(err));
    res.status(200).render("movies", { menu: true, admin: false, data: datos });
  }
};

exports.getLogIn = (req, res) => {
  if (req.cookies.aCookie || req.cookies.gCookie) {
    res.status(403).redirect("/");
  } else {
    res.status(200).render("login", {
      menu: false,
    });
  }
};
exports.getLogOut = (req, res) => {
  if (req.cookies.aCookie) {
    res.status(200).clearCookie("aCookie").render("index", {
      menu: false,
    });
  } else if (req.cookies.gCookie) {
    res.status(200).clearCookie("gCookie").render("index", {
      menu: false,
    });
  } else {
    res.status(403).redirect("/login");
  }
};

exports.postFavorite = async (req, res) => {
  if (req.role == "user") {
    
    sql.postFavorite(req.email)

  }
};
exports.deleteFavorite = async (req, res) => {
  if (req.role == "user") {
    
    sql.deleteFavorite(req.email)

  }
};

exports.postLogIn = (req, res) => auth.signIn(req, res);

exports.claims = (req, res, next) => auth.checkToken(req, res, next);

exports.getCreateMovie = async (req, res) => {
  if (req.role === "admin") {
    res.status(200).render("movieAdmin", { menu: true, admin: true, method: "POST", action: "Crea", src:"movieAdmin" });
  } else {
    res.status(403).redirect("/");
  }
};
exports.getSettings = async (req, res) => {
  if (req.role === "admin") {
      let content = await mongo.getMovieById(req.params.id);

    res.status(200).render("movieAdmin", { menu: true, admin: true, method: "PUT", action:"Edita", src:"editMovie", "content": content });
  } else {
    res.status(403).redirect("/");
  }
};

exports.postNewMovie = async (req, res) => {
  result = await mongo.createMovie(req.body);
  res.status(200).render("movies");
};

exports.putMovieDetails = async (req, res) => {
  let modification = await mongo.updateFilmDetails(req.params.id, req.body);
  res
    .status(200)
    .json({ status: "Film value/values updated", data: { modification } });
};

exports.deleteMovie = async (req, res) => {
  let valueElimination = await mongo.deleteFilm(req.params.id)
  res
    .status(200)
    .json({ status: "Film value/values deleted", data: { valueElimination } });
};
