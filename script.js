// 🔥 YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC9V1K0m6zpNmrI4VRHIDYnH3ewL7etbu",
  authDomain: "okiedokiepoke-d84fc.firebaseapp.com",
  projectId: "okiedokiepoke-d84fc"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

// 👉 PUT YOUR UID HERE (we'll get it next step)
const ADMIN_UID = "x1uYPtpwoAWitQuyNG4LVBOdi1F2";

// LOGIN
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

// SHOW BUTTON ONLY FOR YOU
auth.onAuthStateChanged(user => {
  if (user && user.uid === ADMIN_UID) {
    document.getElementById("addBtn").style.display = "inline-block";
  }
});

// LIVE PRODUCTS (everyone sees updates)
db.collection("products").onSnapshot(snapshot => {
  const shop = document.querySelector('.shop');
  shop.innerHTML = "";

  snapshot.forEach(doc => {
    const product = doc.data();
    const id = "paypal-" + doc.id;

    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      <img src="${product.image}">
      <h2>${product.name}</h2>
      <p>$${product.price}</p>
      <div id="${id}"></div>
    `;

    shop.appendChild(div);

    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: product.price }
          }]
        });
      }
    }).render(`#${id}`);
  });
});

// ADD PRODUCT (ONLY YOU)
function addProduct() {
  const user = auth.currentUser;

  if (!user || user.uid !== ADMIN_UID) {
    alert("Not allowed");
    return;
  }

  const name = prompt("Product name:");
  const price = prompt("Price:");
  const image = prompt("Image URL:");

  if (!name || !price) return;

  db.collection("products").add({
    name,
    price,
    image
  });
}
