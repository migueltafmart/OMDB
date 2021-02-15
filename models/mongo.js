const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://migueltafmart:Hola1234@cluster0.mxfmv.mongodb.net/<dbname>?retryWrites=true&w=majority";
const ObjectId = require("mongodb").ObjectID;

async function connection(){
  let client;
  try{
      client = await MongoClient(url,{ useUnifiedTopology: true, useNewUrlParser: true });
  
      await client
      .connect()
  }catch(e){
      console.log(e);
  }finally{
      return client; // Objeto de conexion a la BBDD
  }
}
/**
*This function recieves the data from a movie via a POST method fetch and uploads it to the mongo database
*
*@param {Object}  req.body data of the movie being created (Sent from the front)
*@property {string} Title The title of the new movie
*@property {string} Year The year the movie was premiered
*@property {string} Runtime The length of the movie
*@property {string} Genre Genre of the movie, could me more than one, separated by commas
*@property {string} Director The director of the movie
*@property {string} Actors The cast of the movie
*@property {string} Plot The plot of the movie
*@property {string} Poster The url to the poster of the movie
*@property {string} imdbRating The rating given in IMDB
*@throws {object} A JSON with a message property if the parameter is misssing any fields
*@throws {null} If the connection with the database fails
*
*@return {Object} All the data of the movie
*/
exports.createMovie = async ({ Title, Year, Runtime, Genre, Director, Actors, Plot, Poster, imdbRating,}) => {
  const client = await connection();
  let result;
  if (
    Title && Year &&
    Runtime && Genre &&
    Director && Actors &&
    Plot && Poster && imdbRating) {

    try {
      result = await client.db("omdb").collection("movies").insertOne({
        Title: Title,
        Year: Year,
        Runtime: Runtime,
        Genre: Genre,
        Director: Director,
        Actors: Actors,
        Plot: Plot,
        Poster: Poster,
        imdbRating: imdbRating,
      });
    } catch (err) {
      result = null;
    } finally {
      return result;
    }
  } else {
    return { message: "Missing fields in the form" };
  }
};
exports.readAllMovies = async (title) => {
  let condition = `${/^$/}`;
  if (title) {
    condition = { Title: new RegExp("^" + title, "gi") };
  }
  let client = await connection();
  const result = await client
    .db("omdb")
    .collection("movies")
    .find(condition)
    .toArray();
  return result;
};

exports.getMovieById = async (id) => {
  let movieID;
  let client;
  let result;
  try {
    client = await connection();
    movieID = new ObjectId(id);
    result =
      (await client
        .db("omdb")
        .collection("movies")
        .findOne({ _id: movieID })) || {};
  } catch (err) {
    result = null;
  } finally {
    return result;
  }
};

exports.updateFilmDetails = async (
  id,
  { Title, Year, Runtime, Genre, Director, Actors, Plot, Poster, imdbRating }
) => {
  let result;
  let movieID;
  if (
    Title &&
    Year &&
    Runtime &&
    Genre &&
    Director &&
    Actors &&
    Plot &&
    Poster &&
    imdbRating
  ) {
    let client = await connection();
  try {
    movieID = new ObjectId(id);
    result = await client
      .db("omdb")
      .collection("movies")
      .updateOne(
        { _id: movieID },
        {
          $set: {
            Title: Title,
            Year: Year,
            Runtime: Runtime,
            Genre: Genre,
            Director: Director,
            Actors: Actors,
            Plot: Plot,
            Poster: Poster,
            imdbRating: imdbRating,
          }}) || {};
  }catch (err) {
    //! El ID que has pasado da problemas
    result = null;
  } finally {
    return result;
  }
  } else if (/^[0-9a-fA-F]{24}$/.test(id)){
    //! El formulario no esta completo pero ID OK
    return {message:"Fill out all the fields, please"};

  } else {
    //! No cariño, ninguna de las anteriores
    return null;
  }
  

};

exports.deleteFilm = async (id) => {
  let client = await connection();
  let movieID;
  let result;
  try {
    movieID = new ObjectId(id);
    result = await client
      .db("omdb")
      .collection("movies")
      .deleteOne({ _id: movieID });
  } catch (err) {
    result = null;
  } finally {
    return result;
  }
};
