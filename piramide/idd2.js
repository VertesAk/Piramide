const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

const servidor=http.createServer((pedido ,respuesta) => {
  const objetourl = url.parse(pedido.url);
let camino='public'+objetourl.pathname;
if (camino=='public/')
  camino='public/index.html';
encaminar(pedido,respuesta,camino);
});

servidor.listen(8888);

function encaminar (pedido,respuesta,camino) {
  console.log(camino);
  switch (camino) {
    case 'public/piramide':{
      recuperar(pedido,respuesta);
      break;
    }	
    default:{  
      fs.stat(camino, error => {
        if(!error){
        fs.readFile(camino,(error, contenido) => {
          if(error){
            respuesta.writeHead(500, {'Content-Type': 'text/plain'});
            respuesta.write('Error interno');
            respuesta.end();					
          }
          else{
            const vec = camino.split('.');
            const extension=vec[vec.length-1];
            const mimearchivo=mime[extension];
            respuesta.writeHead(200, {'Content-Type': mimearchivo});
            respuesta.write(contenido);
            respuesta.end();
          }
        });
      }
      else{
        respuesta.writeHead(404, {'Content-Type': 'text/html'});
        respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
        respuesta.end();
        }
      });	
    }
  }	
}
function EscribirPiramide(n) {
  var dibujo="";
  for(var i=1;i<=n;i++){
    dibujo+="<br>";
       for(var z=1;z<=2*i-1;z++){
        
         if (z%2==0) {
          dibujo+="°"; 
         } else {
          dibujo+="*"; 
         }
    
       }
       dibujo+="<br>";
       }
    return dibujo;
}
function recuperar(pedido,respuesta) {
  let info = '';
  pedido.on('data', datosparciales => {
    info += datosparciales;
  });
  pedido.on('end', () => {
    const formulario = querystring.parse(info);
    var n= parseInt(formulario['num']);
    respuesta.writeHead(200, {'Content-Type': 'text/html'});
    const pagina=
      `<!doctype html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>piramide</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">
            </head>
            <body>
              <div class="text-center" style="padding-top:5%">
                <h1><b><i>Formulario Piramide</i></b></h1>
              </div>
              <pre class="text-center" style="margin-top:30px">`
                +EscribirPiramide(n)+`
              </pre>
            </body>
          </html>`;          
    respuesta.end(pagina);
  });	
}

console.log('Servidor web iniciado');