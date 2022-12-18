import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';


(async () => {
  // Init the Express application
  const app = express();
  // Set the network port
  const port = process.env.PORT || 8082;
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

    // filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/9/94/Morena_pimienta_%28Gymnothorax_griseus%29%2C_parque_nacional_Ras_Muhammad%2C_Egipto%2C_2022-03-27%2C_DD_185.jpg
  // http://project-dev.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://assetsnffrgf-a.akamaihd.net/assets/m/502000286/univ/art/502000286_univ_lsr_lg.jpg
  // http://localhost:8082/filteredimage?image_url=
  // http://project-dev.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.jpg
  // http://project-dev.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://inaturalist-open-data.s3.amazonaws.com/photos/72249626/medium.jpeg

  function isImage(url : string) {
    return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

  app.get("/filteredimage/", async (req, res)=>{
   let { image_url } = req.query;
  // check if image url is correctly formatted
      if(isImage(image_url)) {
        try {
          const filteredPath = await filterImageFromURL(image_url);
          // check if filterImageFromURL was successful
          if(!filteredPath) {
            return res.status(400).send("File not found")
          } else {
            res.status(200).sendFile(filteredPath, ()=>{
              // delete local file after sendFile
              deleteLocalFiles([filteredPath]);
           });
          }
         } catch
           {
              res.status(500).send(`There was an internal error processing ${image_url}`);
           }
        
      } else {
       res.status(400).send(`"${image_url}" is not a valid image url. Please check the url`);
      }
    }
   

  );
  
  //! END @TODO1
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();