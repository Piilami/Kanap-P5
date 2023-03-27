// fonction d'affichage de l'orderID sur la page et de suppression du contenu du localStorage
function displayOrderId() {
  let orderId = new URLSearchParams(document.location.search).get("commande");
  console.log(orderId);
  let display = document.querySelector("#orderId");
  display.textContent = orderId;
  localStorage.clear();
}
displayOrderId();
