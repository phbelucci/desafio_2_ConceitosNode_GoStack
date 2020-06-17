const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require('uuidv4')

// const { uuid } = require("uuidv4");

const app = express();

function validarId(request, response, next){
    const {id} = request.params

    if(!isUuid(id)){
      console.log("Id invalido")
      return response.status(400).json({error : "ID is invalid."})
    }

    next()
}

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs, likes} = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes : 0
  }
  repositories.push(repository)

  response.status(200).json(repository)

});

app.put("/repositories/:id",validarId, (request, response) => {
  // TODO
  const {id} = request.params
  const {likes, title, url, techs} = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(likes){
    return response.status(400).json(repositories[repositoryIndex])
  }
  const repositoryUpdated = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }


  repositories[repositoryIndex] = repositoryUpdated

  response.json(repositoryUpdated) 

});


app.delete("/repositories/:id", validarId, (request, response) => {
  const {id} = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  repositories.splice(repositoryIndex,1)

  return response.status(204).send("")

});

app.post("/repositories/:id/like", validarId, (request, response) => {
    const {id} = request.params

    const repositoryIndex = repositories.findIndex(repository => repository.id === id)
    
    const actualLikes = repositories[repositoryIndex].likes + 1

    repositories[repositoryIndex].likes = actualLikes
  
    return response.status(200).json(repositories[repositoryIndex])
  
});

module.exports = app;