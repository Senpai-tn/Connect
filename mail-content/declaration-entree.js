const declaration_entree = (user) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
  <h1>Declaration Entré pour le salarié ${user.firstName} ${user.lastName}</h1>
  </body>
</html>`
}
module.exports = declaration_entree
