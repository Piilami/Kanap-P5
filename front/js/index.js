//récupération des articles depuis l'api

    fetch('http://localhost:3000/api/products')
    .then((res) => res.json())
    // pour voir ce que l'API renvoie
    .then((data) => {
        return addProducts(data)
    })
    // affichage en cas d'erreur ou de serveur non lancé
  .catch((error) => {
    document.querySelector('#items').innerHTML = '<article><h3>Erreur</h3><p>Veuillez verifier que le serveur est bien lancé et sur le port 3000</p></article>';
    console.log('erreur veuillez verifier que le Serveur est bien lancé et sur le port 3000 '+ error);
  })
// envoyer les resultats de l'api dans les cartes

function addProducts(data){
  const allProducts = data
  console.log(data)
  // boucle foreach pour faire 
  data.forEach(product => {  
  // creation des liens
  const productsLink = document.createElement('a')
  document.querySelector('#items').appendChild(productsLink)
  productsLink.href = `./product.html?id=${product._id}`
  productsLink.classList.add(`classLink${product._id}`)

  const addArticle = document.createElement('article')
  document.querySelector(`.classLink${product._id}`).appendChild(addArticle)
  addArticle.classList.add(`article${product._id}`)

  const addImage = document.createElement('img')
  document.querySelector(`.article${product._id}`).appendChild(addImage)
  addImage.src = product.imageUrl
  addImage.alt = product.altTxt

  const addTitle = document.createElement('h3')
  document.querySelector(`.article${product._id}`).appendChild(addTitle)
  addTitle.innerText = product.name

  const addDescription = document.createElement('p')
  document.querySelector(`.article${product._id}`).appendChild(addDescription)
  addDescription.innerText = product.description
  
  const addPrice = document.createElement('p')
  document.querySelector(`.article${product._id}`).appendChild(addPrice)
  addPrice.innerText = product.price + ' €'
 });
} 