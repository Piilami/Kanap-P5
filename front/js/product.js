// récupération de l'ID du produit depuis l'URL
let params = new URL(document.location).searchParams;
let id = params.get("id");
console.log(id);
fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((res) => {
    console.log(res);
    showProduct(res);
    addToCart();
  })

  .catch((error) => {
    document.querySelector(".item").innerHTML =
      "<article><h3>Erreur</h3><p>Veuillez verifier que le serveur est bien lancé et sur le port 3000</p></article>";
    console.log(
      "erreur veuillez verifier que le Serveur est bien lancé et sur le port 3000 " +
        error
    );
  });
// fonction d'affichage de tous les éléments du produit sur la page
function showProduct(product) {
  //déclaration des divers éléments de l'objet produit pour pouvoir les réutiliser dans les fonctions

  const { imageUrl, altTxt, colors, description, price, name } = product;

  productName = name;
  productPrice = price;
  productDescription = altTxt;
  productImage = imageUrl;
  productTxt = altTxt;
  addImage(imageUrl, altTxt);
  addTxt(name, description, price);
  addColor(colors);
}
// fonction pour l'affichage de l'image et pour le changement de la balise alt
function addImage(imageUrl, altTxt) {
  let image = document.createElement("img");
  image.src = imageUrl;
  image.alt = altTxt;
  document.querySelector(".item__img").appendChild(image);
}
// fonction qui ajoute les divers textes du produits selectionné
function addTxt(name, description, price) {
  let desc = document.querySelector("#description");
  desc.textContent = description;
  let title = document.querySelector("#title");
  title.textContent = name;
  let productPrice = document.querySelector("#price");
  productPrice.textContent = price;
}
// ajout des options de changement de couleurs
function addColor(colors) {
  let productColor = document.querySelector("#colors");
  colors.forEach((color) => {
    let choiceColor = document.createElement("option");
    choiceColor.value = color;
    choiceColor.textContent = color;
    productColor.appendChild(choiceColor);
  });
}
// Fin affichage du produit sur la page produit
// ---------------------------------------------------------------
// Début addCart
// fonction d'appel de la fonction d'envoi vers le localstorage
function addToCart() {
  const btnAdd = document.querySelector("#addToCart");
  btnAdd.addEventListener("click", (e) => {
    let productColor = document.querySelector("#colors").value;
    let productQuantity = document.querySelector("#quantity").value;

    // verification si les conditions sont bien respectée alert temporaire
    // si les conditions sont respectée création du produit
    if (productColor == "" || productQuantity == 0) {
      alert("veuillez choisir une couleur ou une quantité");
    } else if (productQuantity < 0 || productQuantity > 100) {
      alert("veuillez choisir une quantité valide");
    } else {
      addCart(productColor, productQuantity);
      visualEffect();
    }
  });
}
//fonction retour visuel pour l'utilisateur lors du clic sur le bouton d'ajout au panier
function visualEffect() {
  const alertBtn = document.createElement("p");
  const selectorBtn = document.querySelector(".item__content__addButton");
  selectorBtn.appendChild(alertBtn);
  alertBtn.innerText = "produit ajouté à votre panier avec succès";
  selectorBtn.style.display = "flex";
  selectorBtn.style.alignItems = "center";
  selectorBtn.style.flexDirection = "column";
  alertBtn.classList.add("addedToCart");
  alertBtn.style.color = "yellowgreen";
  setTimeout("document.querySelector('.addedToCart').remove()", 450);
}
// fonction récupération du contenu du local storage
function retreiveLocalStorage() {
  // On lit le Local Storage et on retourne un tableau Javascript correspondant au panier
  const str = localStorage.getItem("cart");
  let cart = [];
  if (str) {
    cart = JSON.parse(str);
  }
  return cart;
}
// fonction d'envoi du produit vers le local storage
function addCart(productColor, productQuantity) {
  const product = {
    id,
    color: productColor,
    quantity: Number(productQuantity),
  };

  //1 - Lire les informations du Local Storage
  let cart = retreiveLocalStorage();

  //2 - On va chercher le produit à ajouter dans le panier
  let cartProduct = cart.find(
    (p) => p.id === product.id && p.color === product.color
  );

  //3 - Si on trouve le produit, on modifie ses quantités. Sinon, on l'ajoute au panier
  if (cartProduct) {
    cartProduct.quantity += product.quantity;
  } else {
    cart.push(product);
  }

  //4 - On enregistre les modifications dans le local Storage
  localStorage.setItem("cart", JSON.stringify(cart));
}
