const mongo = require("../models/mongo");
const ObjectId = require("mongodb").ObjectID;

describe("13 - Creates a Movie on the database", () => {
  test("With a fully completed form", async () => {
    let res = await mongo.createMovie({
      Title: "La Pantoja ataca de nuevo",
      Year: 1965,
      Runtime: "96min",
      Genre: "Thiller",
      Director: "Almodovar",
      Actors: "Macarena García",
      Plot:
        "Tras su paso por la cárcel, la pantoja ya no puede más, y no va a aguantarlo, Julián, corre",
      Poster:
        "https://images-na.ssl-images-amazon.com/images/I/91ami3oq1NL._SL1500_.jpg",
      imdbRating: "5/5",
    });
    expect(res).toEqual(
      expect.objectContaining({ insertedId: expect.any(ObjectId) })
    );
    await mongo.deleteFilm(res.insertedId);
  });
  test("If you're missing a field in the form", async () => {
    let res = await mongo.createMovie({
      Title: "La Pantoja ataca de nuevo",
      Year: 2012,
      //Runtime: "96min",
      Genre: "Thiller",
      Director: "Almodovar",
      Actors: "Macarena García",
      Plot:
        "Tras su paso por la cárcel, la pantoja ya no puede más, y no va a aguantarlo, Julián, corre",
      Poster:
        "https://images-na.ssl-images-amazon.com/images/I/91ami3oq1NL._SL1500_.jpg",
      imdbRating: "5/5",
    });
    expect(res).toEqual(
      expect.objectContaining({
        message: expect.stringMatching("Missing fields in the form"),
      })
    );
    await mongo.deleteFilm(res.insertedId);
  });
});

describe("58 - Gets the data of all movies in the database ", () => {
  test("With a title parameter", async () => {
    let res = await mongo.readAllMovies("Ahora sí");
    expect(res).toEqual(
      expect.arrayContaining([expect.objectContaining({ Title: "Ahora sí" })])
    );
  });
  test("Without a title parameter", async () => {
    let res = await mongo.readAllMovies("Ahora");
    expect(res).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ Title: expect.any(String) }),
      ])
    );
  });
  test("With a title that is not on the database", async () => {
    let res = await mongo.readAllMovies("Aloha");
    expect(res).toStrictEqual([]);
  });
});

describe("72 - Gets movie data by entering its ID", () => {
  test("If the ID is correct and exists on the database", async () => {
    let res = await mongo.getMovieById("601bbcf8866b1707b8c32db6");
    expect(res).toEqual(expect.objectContaining({ Title: expect.any(String) }));
  });
  test("If the ID doesn't exist on the database", async () => {
    let res = await mongo.getMovieById("601c0e85b9e95a1b169eb362");
    expect(res).toStrictEqual({});
  });
  test("If the user doesn't pass a parameter", async () => {
    let res = await mongo.getMovieById();
    expect(res).toStrictEqual({});
  });
  test("If the ID doesn't match the RegExp", async () => {
    let res = await mongo.getMovieById("601c0e89eb362");
    expect(res).toBeNull();
  });
});

describe("91 - Updates a movie on the database", () => {
  test("The ID is correct and is on the database , and the form is filled out", async () =>{
    let movie = await mongo.createMovie({
      Title: "La Pantoja ataca de nuevo",
      Year: 1965,
      Runtime: "96min",
      Genre: "Thiller",
      Director: "Almodovar",
      Actors: "Macarena García",
      Plot:
        "Tras su paso por la cárcel, la pantoja ya no puede más, y no va a aguantarlo, Julián, corre",
      Poster:
        "https://images-na.ssl-images-amazon.com/images/I/91ami3oq1NL._SL1500_.jpg",
      imdbRating: "5/5",
    });
    let res = await mongo.updateFilmDetails(movie.insertedId,{
      Title: "Yo soy esa",
      Year: 1965,
      Runtime: "96min",
      Genre: "Thiller",
      Director: "Almodovar",
      Actors: "Macarena García",
      Plot:
        "Tras su paso por la cárcel, la pantoja ya no puede más, y no va a aguantarlo, Julián, corre",
      Poster:
        "https://images-na.ssl-images-amazon.com/images/I/91ami3oq1NL._SL1500_.jpg",
      imdbRating: "5/5",
    })
    expect(res).toEqual(
      expect.objectContaining({modifiedCount : 1})
    )
    await mongo.deleteFilm(movie.insertedId);
  });
  test("The ID is correct but is not on the database, but the form is filled out", async () => {
    let res = await mongo.updateFilmDetails("60229d5b84e9cf1a0b47ca82",{
      Title: "Yo soy esa",
      Year: 1965,
      Runtime: "96min",
      Genre: "Thiller",
      Director: "Almodovar",
      Actors: "Macarena García",
      Plot:
        "Tras su paso por la cárcel, la pantoja ya no puede más, y no va a aguantarlo, Julián, corre",
      Poster:
        "https://images-na.ssl-images-amazon.com/images/I/91ami3oq1NL._SL1500_.jpg",
      imdbRating: "5/5",
    })
    expect(res).toEqual(
      expect.objectContaining({modifiedCount : 0})
    )
    //? Aqui me tiene que traer un JSON con modifiedCound: 0
  });
  test("The ID is correct, but not on the database, and the form is not filled out", async () => {
    let res = await mongo.updateFilmDetails("60229d5b84e9cf1a0b47ca82",{
      Title: "Yo soy esa",
      Year: 1965,
      //Runtime: "96min",
      Genre: "Thiller",
      Director: "Almodovar",
      Actors: "Macarena García",
      Plot:
        "Tras su paso por la cárcel, la pantoja ya no puede más, y no va a aguantarlo, Julián, corre",
      Poster:
        "https://images-na.ssl-images-amazon.com/images/I/91ami3oq1NL._SL1500_.jpg",
      imdbRating: "5/5",
    })
    expect(res).toEqual(
      expect.objectContaining({message: expect.stringMatching("Fill out all the fields, please")})
    )
  });
  test("The ID es incorrect, form is filled out", async () => {
    //? Aqui me tiene que traer un null 
    let res = await mongo.updateFilmDetails("60229d5bb47ca82",{
      Title: "Yo soy esa",
      Year: 1965,
      Runtime: "96min",
      Genre: "Thiller",
      Director: "Almodovar",
      Actors: "Macarena García",
      Plot:
        "Tras su paso por la cárcel, la pantoja ya no puede más, y no va a aguantarlo, Julián, corre",
      Poster:
        "https://images-na.ssl-images-amazon.com/images/I/91ami3oq1NL._SL1500_.jpg",
      imdbRating: "5/5",
    })
    expect(res).toBeNull();
  });
  test("The ID es incorrect, form is not filled out", async () => {
    //? Aqui me tiene que traer un null
    let res = await mongo.updateFilmDetails("60229d5bb47ca82",{
      Title: "Yo soy esa",
      Year: 1965,
      //Runtime: "96min",
      Genre: "Thiller",
      Director: "Almodovar",
      Actors: "Macarena García",
      Plot:
        "Tras su paso por la cárcel, la pantoja ya no puede más, y no va a aguantarlo, Julián, corre",
      Poster:
        "https://images-na.ssl-images-amazon.com/images/I/91ami3oq1NL._SL1500_.jpg",
      imdbRating: "5/5",
    })
    expect(res).toBeNull();
  });
});

describe("146 - Deletes a movie on the database", () => {
  test("With a correct ID", async () => {
    let movie = await mongo.createMovie({
      Title: "La Pantoja ataca de nuevo",
      Year: 1965,
      Runtime: "96min",
      Genre: "Thiller",
      Director: "Almodovar",
      Actors: "Macarena García",
      Plot:
        "Tras su paso por la cárcel, la pantoja ya no puede más, y no va a aguantarlo, Julián, corre",
      Poster:
        "https://images-na.ssl-images-amazon.com/images/I/91ami3oq1NL._SL1500_.jpg",
      imdbRating: "5/5",
    });
    let res = await mongo.deleteFilm(movie.insertedId);
    expect(res).toEqual(expect.objectContaining({ deletedCount: 1 }));
  });
  test("If the ID doesn't exist on the database", async () => {
    let res = await mongo.deleteFilm("601c0e85b9e95a1b169eb362");
    expect(res).toEqual(expect.objectContaining({ deletedCount: 0 }));
  });
  test("If the ID doesn't match the RegExp", async () => {
    let res = await mongo.deleteFilm("601c0e89eb362");
    expect(res).toBeNull();
  });
});
