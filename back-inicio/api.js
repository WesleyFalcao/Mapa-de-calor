/**@description necessário para criar um servidor acessável */
const http = require("http")

/**@description ler arquivo */
const fs = require("fs")

/**@description auxilia nos diretórios dos arquivos */
const path = require("path")


/**@description une os diretórios pois tem servidores que usam / e outros \ */
const DATA_DIR = path.join(__dirname, "data")


/**@description puxa as informações da pasta data */
function api_get(req, res){
      fs.readdir(DATA_DIR, (err, files) => {
            if (err) throw err;
            const filesNo = files.map(f => f.replace(".json", ""))
            res.write(JSON.stringify(filesNo))
            res.end()
      })
}

/**@description pega uma único elemento json e abre, primeiro pego o nome do arquivo da url, o diretório e abro ele */ 
function api_id_get(req, res){
      const fileName = req.url.split("/")[2]
      const file = path.join(DATA_DIR, fileName) + ".json"
      fs.readFile(file, (err, json) => {
            if (err) throw err;
            else if (json) res.write(json.toString())
            res.end();
      })
}

function api_id_post(req, res){
      const fileName = req.url.split("?name=")[1]
      const file = path.join(DATA_DIR, fileName) + ".json"
      /**@description vai armazenar os dados que vão ser escritos aqui no servidor */
      let data = []
      req.on("data", chunk => data.push(chunk))
      req.on("end", () => {
            const body = Buffer.concat(data).toString()
            fs.writeFile(file, body, err =>{
                  if (err) throw err;
                  res.write("post")
                  res.end()
            })
      })    
}

function handleServer(req, res){
      res.writeHeader(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json",
      })
      
      if (req.url === "/api/"){
            api_get(req, res)
            
      } else if (req.url.indexOf("/api/") > -1 && req.method === "GET"){
            api_id_get(req, res)
      }
      else if(req.url.indexOf("/api/") > -1 && req.method === "POST"){
            api_id_post(req, res)
      } 
      else{
            res.end("Sem rota")
      }
}

/**@description cria um servidor http */
http.createServer(handleServer).listen(3001)
