import { serve } from "https://deno.land/std@0.103.0/http/server.ts";

import authController from './services/userService.ts';
import General from "./interfaces/general.ts";



// const get1 = JSON.parse(await Deno.readTextFile("./getData.json"));
// const get2 = JSON.parse(await Deno.readTextFile("./getData2.json"));
// const post1 = JSON.parse(await Deno.readTextFile("./postData.json"));



const s = serve({ 
  port: 8080  });

console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

for await (const req of s) {
  console.log(req.url);
  switch (req.method) {
    case 'GET': {
      switch (req.url) {
        case '/game': {


          let data;
          data = await authController.getGame();
    
          // console.log(JSON.stringify(authController.getGame))

          console.log(data)

          req.respond({
            status: 200,
            body: JSON.stringify(data)
          });
          break;
        }
        // case '/another': {
        //   req.respond({
        //     status: 200,
        //     body: JSON.stringify(get2)
        //   });
        //   break;
        // }
      }

      break;
    }
  }

}
