fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((data) => {
    showProductsInCart(data);
  })
  // affichage en cas d'erreur ou de serveur non lancé
  .catch((error) => {
    document.querySelector("#cart__items").innerHTML =
      "<article><h2>Erreur</h2><p>Veuillez verifier que le serveur est bien lancé et sur le port 3000</p></article>";
    console.log(error);
  });

/* ---------------------------------------------------------------------------------------------------------------------
penser a utiliser les résultats de l'api et non du local storage pour afficher les prix et utiliser plus les resultats de l'api sur le panier 
Récupérer et stocker sur le local storage les quantités pour la navigation sur plusieurs onglets
revoir les Noms des fonctions 
revoir certaines fonctions 
faire le formulaire
------------------------------------------------------------------------------------------------------------------------*/

//1 récupérer le local storage
function showProductsInCart(data) {
  //Vérifier que ce n'est pas null
  const str = localStorage.getItem("cart");
  let cart = [];
  if (str) {
    cart = JSON.parse(str);
  }
  console.log(cart);
  //2 si le local storage est vide afficher un message panier vide
  if (cart === null || cart.length === 0) {
    document.querySelector("#cart__items").innerHTML =
      "<h2>Votre panier est actuellement vide</h2>";
  } else {
    showProductCard(cart);
    totalPrice(cart);
    changeQuantity(cart);
    deleteProduct(cart);
  }
}
//3 si le panier est remplis les afficher
function showProductCard(cart) {
  let card = document.querySelector("#cart__items");
  let elements = "";
  cart.forEach((product) => {
    elements += `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src="${product.image}" alt="${product.alt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>Nom du produit : ${product.name}</h2>
                    <p>couleur : ${product.color}</p>
                    <p>prix : ${product.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem" data-id="${product.id}" data-color="${product.color}">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
  });
  card.innerHTML = elements;
  totalPrice(cart);
}

function totalPrice(cart) {
  // utilisation de reduce pour calculer le prix total le total est l'accumulateur et sa première valeur est 0 on lui ajoute les prix * quantité
  let totalPrice = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
  // utilisation de reduce pour calculer le total des produits dans le panier le total est l'accumulateur et on lui ajoute la quantité de produit
  let totalItems = cart.reduce((total, product) => total + product.quantity, 0);
  document.querySelector("#totalQuantity").textContent = totalItems;
  document.querySelector("#totalPrice").textContent = totalPrice;
}

/*
//faire le total des produits et du prix
function totalPrice(cart) {
  //Essayer de recoder la fonction avec .reduce
  /*let totals = cart.reduce((total, product) => {
  //Faire les calculs
}, {
  quantity: 0,
  price: 0
})*/

// changer la quantité
function changeQuantity(cart) {
  const cardItems = document.querySelectorAll(".cart__item");
  // récupère l'évenement d'un changement
  cardItems.forEach((items) => {
    items.addEventListener("change", (event) => {
      // récupération des éléments de distinction du produit ici son ID et sa couleur
      let product = cart.find(
        (product) =>
          product.id === items.dataset.id &&
          product.color === items.dataset.color
      );
      console.log(product);
      // changement de la quantité du produit en fonction du changement sur le produit
      product.quantity = Number(event.target.value);
      // envoi du changement dans le LocalStorage
      localStorage.setItem("cart", JSON.stringify(cart));
      // appel de la fonction d'affichage du prix et de la quantité d'article
      totalPrice(cart);
    });
  });
}

// fonction de suppression

function deleteProduct(cart) {
  const deleteItem = document.querySelectorAll(".deleteItem");
  console.log(deleteItem);
  deleteItem.forEach((items) => {
    //récupération de l'évenement ici le click sur supprimer
    items.addEventListener("click", () => {
      //recherche de l'index de l'objet que l'on veut supprimer du tableau avec la methode splice
      let product = cart.findIndex(
        (product) =>
          product.id === items.dataset.id &&
          product.color === items.dataset.color
      );
      //on supprime du tableau l'élément en le retirant
      cart.splice(product, 1);
      //on renvoie dans le local storage
      localStorage.setItem("cart", JSON.stringify(cart));
      //on charge la fonction Showproductpour réafficher les éléments dans le panier
      showProductsInCart();
      //on reload la page pour pouvoir supprimer plusieurs éléments à la suite
    });
  });
}
