let data = [];
// récupération de la liste des produits depuis l'API
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((d) => {
    data = d;
    showProductsInCart(data);
  })
  // affichage en cas d'erreur ou de serveur non lancé
  .catch((error) => {
    document.querySelector("#cart__items").innerHTML =
      "<article><h2>Erreur</h2><p>Veuillez verifier que le serveur est bien lancé sur le port 3000</p></article>";
    console.log(error);
  });

// fonction d'affichage du contenu du local storage
function showProductsInCart(data) {
  //Vérifier que ce n'est pas null
  const str = localStorage.getItem("cart");
  let cart = [];
  if (str) {
    cart = JSON.parse(str);
  }

  //2 si le local storage est vide afficher un message panier vide
  if (cart === null || cart.length === 0) {
    document.querySelector("#cart__items").innerHTML =
      "<h2>Votre panier est actuellement vide</h2>";
  } else {
    CompareProducts(data);
    displayProduct(data);
    totalPrice();
    changeQuantity();
    deleteProduct();
    checkForm();
  }
}
// fonction pour ajouter les informations qui ne sont pas contenu dans le local storage
function CompareProducts(data) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart.forEach((product) => {
    for (let i = 0; i < data.length; i++) {
      if (product.id === data[i]._id) {
        product.name = data[i].name;
        product.price = data[i].price;
        product.image = data[i].imageUrl;
        product.alt = data[i].altTxt;
      }
    }
  });
  return cart;
}

//3 si le panier est remplis les afficher
// fonction d'affichage des produits dans le panier
function displayProduct(cart) {
  //  récupérer les éléments  depuis le local storage
  cart = CompareProducts(cart);

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
// fonction de calcul du total du prix et de la quantité de produits
function totalPrice() {
  // utilisation de reduce pour calculer le prix total le total est l'accumulateur et sa première valeur est 0 on lui ajoute les prix * quantité
  cart = CompareProducts(data);

  let total = cart.reduce(
    (total, product) => {
      total.price += product.price * product.quantity;
      total.quantity += product.quantity;
      return total;
    },
    {
      price: 0,
      quantity: 0,
    }
  );
  document.querySelector("#totalQuantity").textContent = total.quantity;
  document.querySelector("#totalPrice").textContent = total.price;
}

// fonction de changement de quantité pour un produit
function changeQuantity() {
  const cardItems = document.querySelectorAll(".cart__item");
  // récupère l'évenement d'un changement
  cardItems.forEach((item) => {
    item.addEventListener("change", (event) => {
      let cart = JSON.parse(localStorage.getItem("cart"));
      // récupération des éléments de distinction du produit ici son ID et sa couleur
      let product = cart.find(
        (product) =>
          product.id === item.dataset.id && product.color === item.dataset.color
      );
      // changement de la quantité du produit en fonction du changement sur le produit
      product.quantity = Number(event.target.value);
      // envoi du changement dans le LocalStorage

      localStorage.setItem("cart", JSON.stringify(cart));
      // appel de la fonction d'affichage du prix et de la quantité d'article

      totalPrice(cart);
    });
  });
}

// fonction de suppression de produits

function deleteProduct() {
  const deleteItem = document.querySelectorAll(".deleteItem");
  deleteItem.forEach((items) => {
    //récupération de l'évenement ici le click sur supprimer
    items.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart"));
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
      showProductsInCart(data);
      totalPrice(cart);
    });
  });
}

// --------------------------- FORMULAIRE ---------------------------------------

// fonction contenant les regExp pour verifier si les champs sont correctements remplis avant envoi du formulaire
function checkForm() {
  let NamesRegExp = new RegExp(
    /^[a-zA-Záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ]+([-' ]?[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœA-Z]){1,30}$/,
    "i"
  );
  let emailRegExp = new RegExp(
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    "i"
  );
  let addressRegExp = new RegExp(
    /^([a-zA-Z0-9]+([- ]?[a-zA-Záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ]))*$/,
    "i"
  );
  let firstName = document.querySelector("#firstName");
  let lastName = document.querySelector("#lastName");
  let city = document.querySelector("#city");
  let form = document.querySelector(".cart__order__form");
  let address = document.querySelector("#address");
  let email = document.querySelector("#email");
  // si tous les éléments du formulaires sont conformes envoi vers l'API
  form.addEventListener("focusout", (e) => {
    if (NamesRegExp.test(firstName.value) === false) {
      document.querySelector("#firstNameErrorMsg").innerText =
        "Veuillez entrer un Prénom valide";
    } else {
      document.querySelector("#firstNameErrorMsg").innerText = "";
    }
    if (NamesRegExp.test(lastName.value) === false) {
      document.querySelector("#lastNameErrorMsg").innerText =
        "Veuillez entrer un Nom valide";
    } else {
      document.querySelector("#lastNameErrorMsg").innerText = "";
    }
    if (NamesRegExp.test(city.value) === false) {
      document.querySelector("#cityErrorMsg").innerText =
        "Veuillez entrer une ville valide";
    } else {
      document.querySelector("#cityErrorMsg").innerText = "";
    }
    if (addressRegExp.test(address.value) === false) {
      document.querySelector("#addressErrorMsg").innerText =
        "Veuillez entrer une adresse valide";
    } else {
      document.querySelector("#addressErrorMsg").innerText = "";
    }
    if (emailRegExp.test(email.value) === false) {
      document.querySelector("#emailErrorMsg").innerText =
        "Veuillez entrer un mail valide";
    } else {
      document.querySelector("#emailErrorMsg").innerText = "";
    }
  });
  console.log(cart);
  form.addEventListener("submit", (e) => {
    if (
      (NamesRegExp.test(firstName.value) &&
        NamesRegExp.test(lastName.value) &&
        NamesRegExp.test(city.value) &&
        addressRegExp.test(address.value) &&
        emailRegExp.test(email.value)) === true
    ) {
      e.preventDefault();
      sendForm();
    } else {
      e.preventDefault();
    }
  });
}
// fonction d'envoi du formulaire et réception de l'orderID pour redirection
function sendForm() {
  let form = document.querySelector(".cart__order__form");
  let cart = JSON.parse(localStorage.getItem("cart"));
  let cartId = [];
  if (cart.length > 0) {
    for (let indice of cart) {
      cartId.push(indice.id);
    }
  }
  let body = {
    contact: {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      address: form.address.value,
      city: form.city.value,
      email: form.email.value,
    },
    products: cartId,
  };
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      window.location.href = `confirmation.html?commande=${data.orderId}`;
    })
    .catch((err) => {
      alert("Une erreur est survenue");
      console.log(err);
    });
}
