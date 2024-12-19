import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getDatabase, set, ref, remove, update, child, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCAw54gL8LIHBc6o6vhSjC15Jx1vB3YvOM",
  authDomain: "examonline1-ff7fb.firebaseapp.com",
  databaseURL: "https://examonline1-ff7fb-default-rtdb.firebaseio.com",
  projectId: "examonline1-ff7fb",
  storageBucket: "examonline1-ff7fb.firebasestorage.app",
  messagingSenderId: "207958975330",
  appId: "1:207958975330:web:f5416907ee9bb1389a023b",
  measurementId: "G-8LFBVXEMP6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();

// Helper function to get local storage values
const getLocalStorage = (key) => localStorage.getItem(key);

// Helper function to set local storage values
const setLocalStorage = (key, value) => localStorage.setItem(key, value);

// Helper function to clear local storage
const clearLocalStorage = (key) => localStorage.removeItem(key);







// Function to handle UI updates
const handleUIUpdate = () => {
  if (getLocalStorage("hasAccount") === 'true' && getLocalStorage("ADMIN") !== "true" && getLocalStorage('user_NP') !== null) {
    const [userName, phoneNumber] = getLocalStorage('user_NP').split('/');
    set(ref(db, `UI/${phoneNumber}`), {
      userName,
      phoneNumber,
      order: ""
    }).then(() => {
      setLocalStorage("hasAccount", 'false');
    });
  }
};

// Set Interval for UI handling
setInterval(handleUIUpdate, 100);

// Handle UI data when fetched
let UI = [{
  order: "",
  phoneNumber: "",
  userName: ""
}];



onValue(ref(db, "UI"), (snapshot) => {
  UI = [];
  snapshot.forEach((userDetail) => {
    UI.push(userDetail.val());
  });
});





/*
// Update UI based on current state
let hasAccount = 'false';

const updateUI = () => {
  if (UI.length !== 0) {
    const [userName, phoneNumber] = getLocalStorage('user_NP') ? getLocalStorage('user_NP').split('/') : [];

    if (userName && getLocalStorage("ADMIN") !== "true" && phoneNumber !== null) {
      for (let i = 0; i < UI.length; i++) {

        if (UI[i].phoneNumber === phoneNumber) {
          hasAccount = 'true';
          setLocalStorage("hasAccount", 'false');
        }

        if (UI[i].phoneNumber === phoneNumber && UI[i].order !== getLocalStorage('orderSet')) {
          const orderSet = getLocalStorage('orderSet') || "";
    
          if (orderSet || localStorage.getItem('alreadyUpload') === 'true') {
            update(ref(db, `UI/${phoneNumber}`), {
              userName,
              phoneNumber,
              order: orderSet
            });

            

          }else{
            
            localStorage.setItem("alreadyUpload", 'true');

            
            // Function to handle saving data to localStorage safely
            function saveToLocalStorage(key, value) {
              try {
                  // Sanitize key and value to prevent malicious input (e.g., script injections)
                  const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, '_'); // Only allow alphanumeric characters and underscores
                  const sanitizedValue = value ? value.trim() : '';

                  // Check if sanitized key or value is empty
                  if (sanitizedKey && sanitizedValue) {
                      localStorage.setItem(sanitizedKey, sanitizedValue);
                  } else {
                      console.warn(`Attempted to store empty or invalid data with key: ${sanitizedKey}`);
                  }
              } catch (error) {
                  console.error('Error saving to localStorage:', error);
              }
            }

            // Function to process UI and save data
            function processUI(UI) {
              if (!Array.isArray(UI)) {
                  console.error('Invalid UI data: Expected an array.');
                  return;
              }

              // Loop through each UI element
              UI.forEach((item, index) => {
                  if (!item || !item.order) {
                      console.warn(`Skipping UI item at index ${index} due to missing 'order' property.`);
                      return;
                  }

                  // Split the 'order' string safely (ensure it is not null or undefined)
                  const orderParts = item.order.split(',');
                  
                  if (orderParts.length === 0) {
                      console.warn(`Skipping UI item at index ${index} because the 'order' is empty.`);
                      return;
                  }

                  // Loop through each part of the order
                  orderParts.forEach((part) => {
                      if (!part.includes('/')) {
                          console.warn(`Skipping invalid part '${part}' in order at index ${index}. Expected '/' separator.`);
                          return;
                      }

                      // Extract the first part before the '/' as partId
                      const [partId] = part.split('/');
                      if (partId) {
                          const key = `CI${partId}`;
                          saveToLocalStorage(key, part); // Save part to localStorage
                      } else {
                          console.warn(`Skipping invalid part '${part}' with no valid partId at index ${index}.`);
                      }
                  });
              });
            }



            processUI(UI);

            

          }
        }
      }
        
      if (hasAccount === 'false') {
        setLocalStorage("hasAccount", 'true');
      }
      
    }
  }
};



setInterval(updateUI, 100);

*/










// Function to safely save data to localStorage
function saveToLocalStorage(key, value) {
  try {
      const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, '_'); // Only alphanumeric and underscores allowed
      const sanitizedValue = value ? value.trim() : '';
      if (sanitizedKey && sanitizedValue) {
          localStorage.setItem(sanitizedKey, sanitizedValue);
      } else {
          console.warn(`Invalid data: ${sanitizedKey}`);
      }
  } catch (error) {
      console.error('Error saving to localStorage:', error);
  }
}

// Function to process UI data and save order items to localStorage
function processUI(UI) {
  if (!Array.isArray(UI)) {
      console.error('Invalid UI data: Expected an array.');
      return;
  }

  // Loop through each UI element
  UI.forEach((item, index) => {
      if (!item?.order) {
          console.warn(`Skipping UI item at index ${index} due to missing 'order' property.`);
          return;
      }

      // Process each order part in 'order'
      item.order.split(',').forEach((part) => {
          if (part.includes('/')) {
              const [partId] = part.split('/');
              if (partId) {
                  saveToLocalStorage(`CI${partId}`, part); // Save part to localStorage
              } else {
                  console.warn(`Invalid part: ${part} at index ${index}`);
              }
          } else {
              console.warn(`Skipping invalid part: ${part} at index ${index}. Expected '/' separator.`);
          }
      });
  });
}

// Main function to update the UI based on the current state
const updateUI = () => {
  if (UI.length === 0) return;

  const userNP = getLocalStorage('user_NP');
  if (!userNP) return;

  const [userName, phoneNumber] = userNP.split('/');
  if (!userName || !phoneNumber || getLocalStorage('ADMIN') === 'true') return;

  let hasAccount = 'false'; // Default to 'false'

  UI.forEach((item) => {
      if (item.phoneNumber === phoneNumber) {
          hasAccount = 'true';

          if (item.order !== getLocalStorage('orderSet')) {
              const orderSet = getLocalStorage('orderSet') || '';
              if (orderSet || localStorage.getItem('alreadyUpload') === 'true') {
                  // Update order in the database
                  update(ref(db, `UI/${phoneNumber}`), {
                      userName,
                      phoneNumber,
                      order: orderSet
                  });
              } else {
                  localStorage.setItem('alreadyUpload', 'true');
                  processUI(UI); // Process UI to save order details to localStorage
              }
          }
      }
  });

  // Only set 'hasAccount' in localStorage if it's still 'false'
  if (hasAccount === 'false') {
      setLocalStorage('hasAccount', 'true');
  }
};

// Run the updateUI function periodically (every 100ms)
setInterval(updateUI, 100);















































// Fetch product IDs
let productID = [];

const fetchProductID = () => {
  onValue(ref(db, "productID"), (snapshot) => {
    productID = [];
    productID.push(snapshot.val());
  });
};

setInterval(fetchProductID, 100);

// Add product function
document.querySelector('.ADD_PD_MCB').addEventListener("click", () => {
  const productNameInput = document.querySelector('.ADD_PD_MC_PNI');
  const productPriceInput = document.querySelector('.ADD_PD_MC_PPI');
  const productCountInput = document.querySelector('.ADD_PD_MC_PLCI');

  const productName = productNameInput.value;
  const productPrice = productPriceInput.value;
  const productCount = productCountInput.value || 0;

  if (productName.length > 0 && productPrice.length > 0) {
    setLocalStorage("product_N", productName);
    setLocalStorage("product_P", productPrice);
    setLocalStorage("product_LCount", productCount);

    productNameInput.style.outline = "2px solid transparent";
    productPriceInput.style.outline = "2px solid transparent";
    productNameInput.value = "";
    productPriceInput.value = "";
    document.querySelector('.ADD_PD_MC_I').style.backgroundImage = `url('')`;

    // Increment Product ID and add product
    update(ref(db, "productID"), {
      productID: productID[0].productID + 1
    }).then(() => {
      const currentProductID = productID[0].productID;
      set(ref(db, `PI/product_${currentProductID}`), {
        i: getLocalStorage("product_I"),
        n: getLocalStorage("product_N"),
        p: getLocalStorage("product_P"),
        id: currentProductID,
        lc: getLocalStorage("product_LCount")
      }).then(() => {
        clearLocalStorage("product_I");
        clearLocalStorage("product_N");
        clearLocalStorage("product_P");
        clearLocalStorage("product_LCount");
      }).catch((error) => {
        console.error("Error adding product: ", error);
      });
    });
  } else {
    // Handle invalid input by changing outline color
    if (productName.length === 0) {
      productNameInput.style.outline = "2px solid red";
      productPriceInput.style.outline = productPrice.length === 0 ? "2px solid red" : "2px solid green";
    } else {
      productNameInput.style.outline = "2px solid green";
      productPriceInput.style.outline = "2px solid red";
    }
  }
});





















// Define a constant for storing PI data.
const PI = [];

// Function to handle value changes securely and efficiently.
const handlePIData = (snapshot) => {
    try {
        // Clear the array only if you want to refresh the entire data.
        // If you need to update only modified records, you can merge the data instead.
        const updatedPI = [];

        snapshot.forEach((userDetail) => {
            // Ensure each userDetail has a valid value
            const userData = userDetail.val();
            if (userData && userData.i !== undefined) {
                updatedPI.push(userData);
            }
        });

        // Updating the global PI array with the new values securely.
        // If you need to use a state management solution (e.g., Redux, Context API), do that here.
        PI.length = 0; // Clear the array before pushing updated data.
        updatedPI.forEach(item => PI.push(item));

        // Optionally, log to check the data
        //console.log('Updated PI:', PI);

    } catch (error) {
        console.error("Error fetching PI data:", error);
    }
};

// Securely handle data from Firebase database
onValue(ref(db, "PI"), (snapshot) => {
    handlePIData(snapshot);
}, (error) => {
    console.error("Error with onValue listener:", error);
});

























/**/


// Use constants for fixed values
const LIKE_ICON_UNLIKE = "none";
const LIKE_ICON_LIKE = "block";
const PRODUCT_PREFIX = 'PI/product_';

// Caching the DOM elements for better performance
const HElement = document.querySelector('.H');
const SUB_PD_MElement = document.querySelector('.SUB_PD_M');
const AElement = document.querySelector('.A');
const DIC_D = document.querySelector('.DIC_D');


// Initializing sessionStorage and localStorage values
sessionStorage.setItem("C_I", PI.length);
sessionStorage.setItem("U_I", PI.length);
sessionStorage.setItem("CI", PI.length);

let PTC_H = '';
let Delete_p = '';

// Function to format large numbers (like likes or price)
const formatNumber = (number) => {
    if (number >= 1_000_000_000) return (number / 1_000_000_000).toFixed(2) + 'B';
    if (number >= 1_000_000) return (number / 1_000_000).toFixed(2) + 'M';
    if (number >= 1_000) return (number / 1_000).toFixed(2) + 'K';
    return number.toString();
};

// Function to format price
const formatPrices = (price) => {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Function to handle product like status
const handleLikeStatus = (product) => {
    let likeIcon_unlike = LIKE_ICON_UNLIKE;
    let likeIcon_like = LIKE_ICON_LIKE;
    let likeCount = formatNumber(product.lc);

    if (localStorage.getItem(`likeIcon${product.id}`) === 'like') {
        likeIcon_unlike = LIKE_ICON_UNLIKE;
        likeIcon_like = LIKE_ICON_LIKE;
    } else if (localStorage.getItem(`likeIcon${product.id}`) === 'unlike') {
        likeIcon_unlike = LIKE_ICON_LIKE;
        likeIcon_like = LIKE_ICON_UNLIKE;
    }

    return { likeIcon_unlike, likeIcon_like, likeCount };
};






// Function to update product view
const updateProductView = (product, likeIcon_unlike, likeIcon_like, likeCount, price) => {
    PTC_H += `
        <div class="HPCD">
            <div class="HPCD_T">
                <p class="HPCD_T_N">new</p>
                <div class="HPCD_T_CI">
                    <span class="HPCD_T_C HPCD_T_C${product.id}" data-like-count="${product.lc}">${likeCount}</span>
                    <p class="HPCD_T_IB HPCD_T_IB${product.id}" style="display: ${likeIcon_unlike};" data-i="${product.i}" data-n="${product.n}" data-p="${product.p}" data-id="${product.id}" data-lc="${product.lc}"></p>
                    <p class="HPCD_T_IC HPCD_T_IC${product.id}" style="display: ${likeIcon_like};" data-i="${product.i}" data-n="${product.n}" data-p="${product.p}" data-id="${product.id}" data-lc="${product.lc}"></p>
                </div>
            </div>
            <div class="HPCD_I" style="background-image: url('${product.i}');" data-i="${product.i}" data-n="${product.n}" data-p="${product.p}" data-id="${product.id}" data-lc="${product.lc}">
                <img src="${product.i}" class="Img_FC">
            </div>
            <div class="HPCD_N">${product.n}</div>
            <p class="HPCD_P">&#8358 ${price}</p>
            <div class="HPCD_AC" data-id="${product.id}" data-price="${product.p}">
                <p class="HPCD_AC_I"></p> Add to cart
            </div>
            <div class="HPCD_IS">
                <p class="HPCD_IS_I"></p> In stock
            </div>
        </div>
    `;
    
    Delete_p += `
        <div class="SUB_PD_MPC" style="background-image: url('${product.i}');">
            <p class="SUB_PD_MPC_D" data-id="${product.id}"></p>
            <img src="${product.i}" class="Img_FC HPCD_I" data-i="${product.i}" data-n="${product.n}" data-p="${product.p}" data-id="${product.id}" data-lc="${product.lc}">
        </div>
    `;

};

// Event listener for "Add to Cart"
const handleAddToCart = (e) => {
    let dataDashed_Id = e.dataset.id;
    let dataDashed_Price = e.dataset.price;

    if (localStorage.getItem("user_NP") !== null) {
        let cartItem = localStorage.getItem(`CI${dataDashed_Id}`);
        if (!cartItem) {
            localStorage.setItem(`CI${dataDashed_Id}`, `${dataDashed_Id}/1`);
        } else {
            let [id, quantity] = cartItem.split('/');
            localStorage.setItem(`CI${dataDashed_Id}`, `${id}/${parseInt(quantity) + 1}`);
        }
        localStorage.setItem("CCA_represh", 'true');
    } else {
        AElement.style.display = "block";
    }
};

// Event listener for "Remove from Cart"
const handleRemoveFromCart = (e) => {
    let dataDashed_Id = e.dataset.id;

    // Call Firebase API to remove product
    remove(ref(getDatabase(), `${PRODUCT_PREFIX}${dataDashed_Id}`))
        .then(() => {
            localStorage.setItem("CCA_represh", 'true');
            localStorage.setItem("reset_PI", 'true');
        });

    if (PI.length === 0) {
        HElement.innerHTML = '';
        SUB_PD_MElement.innerHTML = '';
    }
};






// Main loop to refresh the product view and cart
let deffrentArrangement = true;
setInterval(() => {
    if (PI.length !== 0 && PI[0].id !== 0) {
        // Check if we need to reset the session data
        if (sessionStorage.getItem("C_I") !== PI.length || localStorage.getItem("reset_PI") === 'true') {
            sessionStorage.setItem("C_I", PI.length);
            sessionStorage.setItem("U_I", PI.length);
            PTC_H = '';
            Delete_p = '';
            
            localStorage.removeItem("reset_PI");
            HElement.innerHTML = '';
            SUB_PD_MElement.innerHTML = '';
        }


        // Function to shuffle an array using the Fisher-Yates algorithm
      function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
          [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
        }
      }

      if(deffrentArrangement === true){
        shuffleArray(PI);
        deffrentArrangement = false;
      }
      

      
      
      // Iterate over all products
      PI.forEach((product, index) => {
          if (true) {//index !== 0
              let { likeIcon_unlike, likeIcon_like, likeCount } = handleLikeStatus(product);
              let price = formatPrices(product.p);
              updateProductView(product, likeIcon_unlike, likeIcon_like, likeCount, price);
          }
      });

      // Update the DOM
      HElement.innerHTML = PTC_H;
      SUB_PD_MElement.innerHTML = Delete_p;
      



        
        // Event listeners for "Add to Cart"
        document.querySelectorAll('.HPCD_AC').forEach((e) => {
            e.addEventListener('click', () => handleAddToCart(e));
        });

        // Event listeners for "Remove from Cart"
        document.querySelectorAll('.SUB_PD_MPC_D').forEach((e) => {
            e.addEventListener('click', () => handleRemoveFromCart(e));
        });

        // Event listeners for Like/Unlike functionality
        document.querySelectorAll('.HPCD_T_IB').forEach((e) => {
            e.addEventListener('click', () => {
                let dataDashed_Id = e.dataset.id;
                let dataDashed_lc=e.dataset.lc;
                document.querySelector(`.HPCD_T_IC${dataDashed_Id}`).style.display = "block";
                document.querySelector(`.HPCD_T_IB${dataDashed_Id}`).style.display = "none";
                localStorage.setItem(`likeIcon${dataDashed_Id}`, 'like');
                // Update the like count
                update(ref(getDatabase(), `${PRODUCT_PREFIX}${dataDashed_Id}`), {
                    lc: Number(dataDashed_lc) + 1
                });
            });
        });

        document.querySelectorAll('.HPCD_T_IC').forEach((e) => {
            e.addEventListener('click', () => {
                let dataDashed_Id = e.dataset.id;
                let dataDashed_lc=e.dataset.lc;
                document.querySelector(`.HPCD_T_IC${dataDashed_Id}`).style.display = "none";
                document.querySelector(`.HPCD_T_IB${dataDashed_Id}`).style.display = "block";
                localStorage.setItem(`likeIcon${dataDashed_Id}`, 'unlike');
                // Update the like count
                update(ref(getDatabase(), `${PRODUCT_PREFIX}${dataDashed_Id}`), {
                    lc: Number(dataDashed_lc) - 1
                });
            });
        });


        
        document.querySelectorAll('.HPCD_I').forEach((e) => {
            e.addEventListener('click', () => {
                let dataDashed_Id = e.dataset.id;
                let dataDashed_lc=e.dataset.lc;
                let dataDashed_i=e.dataset.i;
                let dataDashed_n=e.dataset.n;
                let dataDashed_p=e.dataset.p;
                let dataDashed_Q=e.dataset.q;
                    

                document.querySelector(".DIC_D").innerHTML=`
                <div class="DIC_I">
                    <p class="DIC_BACK"></p>
                    <img src="${dataDashed_i}" class="Img_FC">
                </div>
                <P class="DIC_N">${dataDashed_n}</P>
                <P class="DIC_P"> &#8358 ${dataDashed_p}</P>
                <div class="HPCD_IS">
                    <p class="HPCD_IS_I"></p> In stock
                </div>
                `;
                document.querySelector(".DIC_D_C").style.display="block";
            });
        });


    }



    var div = document.querySelector('.H');  // Replace with your div's ID
    div.addEventListener('scroll', function() {
        if (div.scrollTop + div.clientHeight === div.scrollHeight) {
        
            
            document.querySelector('.BecauseOFLodding_I').style.display = "block";

            setTimeout(()=>{
              deffrentArrangement = true;
              document.querySelector('.H').scrollTop = 1;
            },3000)

        }else{
            document.querySelector('.BecauseOFLodding_I').style.display = "none";
        }
    });


}, 100);






















/**/

// Function to format prices with commas
const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};



// Helper function to update local storage with new quantities
const updateLocalStorage = (id, quantity) => {
    const currentData = localStorage.getItem(`CI${id}`);
    const [productId, currentQuantity] = currentData ? currentData.split('/') : [id, 0];
    const newQuantity = quantity ? quantity : parseInt(currentQuantity) + 1;
    localStorage.setItem(`CI${id}`, `${productId}/${newQuantity}`);
    return newQuantity;
};

// Helper function to create item element for cart
const createCartItem = (item, quantity) => {
    const price = formatPrice(item.p);
    const totalPrice = formatPrice(item.p * quantity);
    return `
        <div class="CPCD_B">
            <div class="CPCD_B_L">
                <div class="CPCD_B_LI HPCD_I" style="background-image: url('${item.i}')"  data-i="${item.i}" data-n="${item.n}" data-p="${item.p}" data-id="${item.id}" data-lc="${item.lc}">
                    <img src="${item.i}" class="Img_FC">
                </div>
            </div>
            <div class="CPCD_B_R">
                <p class="CPCD_B_RN">${item.n}</p>
                <p class="CPCD_B_RP"> &#8358 ${price}</p>
                <div class="CPCD_B_RQ">
                    <p class="CPCD_B_R_A" data-id="${item.id}" data-price="${item.p}">+</p>
                    <p class="CPCD_B_R_Q CPCD_B_R_Q${item.id}">${quantity}</p>
                    <p class="CPCD_B_R_S" data-id="${item.id}" data-price="${item.p}">-</p>
                </div>
                <p class="CPCD_B_RT CPCD_B_RT${item.id}"> &#8358 ${totalPrice}</p>
            </div>
        </div>
    `;
};

// Function to update cart display
const updateCartDisplay = (cartContent , quantity) => {

  if(cartContent === '<div class="CPCD_T">Shopping Cart</div>'){
    document.querySelector('.C').innerHTML = cartContent + '<div class="Empty_C"></div>';
  }else{
    document.querySelector('.C').innerHTML = cartContent;
  }

  document.querySelector('.CC').innerText = quantity;
};

// Event listeners for quantity updates
const addQuantityEventListeners = () => {
    document.querySelectorAll('.CPCD_B_R_A').forEach(item => {
        item.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const price = e.target.dataset.price;
            const quantity = updateLocalStorage(id);
            const totalPrice = formatPrice(price * quantity);
            document.querySelector(`.CPCD_B_R_Q${id}`).innerText = quantity;
            document.querySelector(`.CPCD_B_RT${id}`).innerHTML = `&#8358 ${totalPrice}`;
            //updateCartDisplay(document.querySelector('.C').innerHTML);
        });
    });

    document.querySelectorAll('.CPCD_B_R_S').forEach(item => {
        item.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const price = e.target.dataset.price;
            let quantity = parseInt(document.querySelector(`.CPCD_B_R_Q${id}`).innerText);

            if (quantity > 1) {
                quantity--;
                updateLocalStorage(id, quantity);
            } else {
                localStorage.removeItem(`CI${id}`);
            }
            const totalPrice = formatPrice(price * quantity);
            document.querySelector(`.CPCD_B_R_Q${id}`).innerText = quantity;
            document.querySelector(`.CPCD_B_RT${id}`).innerHTML = `&#8358 ${totalPrice}`;
            //updateCartDisplay(document.querySelector('.C').innerHTML);
        });
    });
};

// Main function to handle the cart and local storage logic
const updateShoppingCart = () => {
    let cartContent = '<div class="CPCD_T">Shopping Cart</div>';
    let cartIds = [];
    let cartTotal = 0;
    let orderSet = "";

    

    // Initialize cart display
    if (PI.length > 0 && PI[0].id !== 0) {
        const cartIndex = sessionStorage.getItem("CI") || 0;
        if (localStorage.getItem("CCA_represh") === 'true') {
            localStorage.removeItem("CCA_represh");
            cartContent = '<div class="CPCD_T">Shopping Cart</div>';
            document.querySelector('.C').innerHTML = cartContent;
            document.querySelector('.CC').innerText = 0;
        }

        for (let i = 0; i < PI.length; i++) {
            const currentItem = PI[i];
            if (!cartIds.includes(currentItem.id) && localStorage.getItem(`CI${currentItem.id}`)) {
                cartIds.push(currentItem.id);
                const quantity = parseInt(localStorage.getItem(`CI${currentItem.id}`).split('/')[1]);
                cartContent += createCartItem(currentItem, quantity);
                cartTotal += quantity;

                if(i === 0){
                    orderSet += localStorage.getItem(`CI${currentItem.id}`);
                }else{
                    orderSet += "," + localStorage.getItem(`CI${currentItem.id}`);
                }
                
            }
        }

        if(orderSet !== getLocalStorage('orderSet')){
            localStorage.setItem('orderSet',orderSet)
        }
        

        updateCartDisplay(cartContent, cartTotal);
        addQuantityEventListeners();
    }
};

// Running the interval to check and update cart regularly
setInterval(() => {
    updateShoppingCart();
}, 100);



/**/
































document.querySelector('.LO_D').addEventListener('click', () => {
    try {
      // Clear user and admin data from localStorage
      removeLocalStorageItems(['ADMIN', 'user_NP','alreadyUpload']);
      
      // Reset account creation button text and hide modal
      document.querySelector('.CA').innerText = "Create new account";
      document.querySelector('.M').style.display = 'none';
  
      // Remove order data and reset UI layers
      removeLocalStorageItems(['orderSet']);
      resetUI();
  
      // Set specific flags to false
      localStorage.setItem('CT', 'false');
      localStorage.setItem('FPC', 'display');
  
      // Clear product-specific data in localStorage
      clearProductData();
  
      // Refresh the app by setting a flag
      localStorage.setItem('CCA_represh', 'true');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  });
  
  // Helper function to remove multiple items from localStorage
  function removeLocalStorageItems(items) {
    items.forEach(item => {
      try {
        localStorage.removeItem(item);
      } catch (error) {
        console.error(`Error removing ${item} from localStorage:`, error);
      }
    });
  }
  
  // Helper function to reset UI state
  function resetUI() {
    const header = document.querySelector('.H');
    const content = document.querySelector('.C');
  
    if (header && content) {
      header.style.zIndex = 1;
      content.style.zIndex = 0;
    }
  }
  
  // Helper function to clear product-related localStorage data
  function clearProductData() {
    try {
      const productCount = productID[0]?.productID || 0; // Ensure productID is valid
      for (let i = 0; i < productCount + 1; i++) {
        //console.log(`Clearing product data for product ID: ${i}`);
        localStorage.removeItem(`CI${i}`);
        localStorage.removeItem(`likeIcon${i}`);
      }
    } catch (error) {
      console.error("Error clearing product data:", error);
    }
  }
  


















































/* ADMIN */
sessionStorage.setItem("ADMIN_C_I", UI.length); // Confirm index
sessionStorage.setItem("ADMIN_U_I", UI.length); // Use index

let ADMIN_PTC_H = '';
let ADMIN_PTC_Order = '';

setInterval(() => {
  const adminStatus = localStorage.getItem("ADMIN") === "true";
  const userNameExists = UI.length !== 0 && UI[0].userName !== "";

  if (adminStatus && userNameExists) {
    // Home - check if there's a change in the index
    const currentAdminIndex = sessionStorage.getItem("ADMIN_C_I");
    if (currentAdminIndex !== UI.length.toString()) {
      sessionStorage.setItem("ADMIN_C_I", UI.length);
      sessionStorage.setItem("ADMIN_U_I", UI.length);
      ADMIN_PTC_H = ''; // Reset PTC_H
    }

    // Update USER UI
    if (sessionStorage.getItem("ADMIN_U_I") !== "0") {
      sessionStorage.setItem("ADMIN_U_I", sessionStorage.getItem("ADMIN_U_I") - 1);

      const userIndex = sessionStorage.getItem("ADMIN_U_I");
      const userData = UI[userIndex];

      // Generate user details HTML
      ADMIN_PTC_H += `
        <div class="A_MCD_MAIN_FC"
          data-user-name="${escapeHtml(userData.userName)}"
          data-user-order="${escapeHtml(userData.order)}"
          data-user-phone-number="${escapeHtml(userData.phoneNumber)}">
          <p class="A_MCD_MAIN_FI"></p>
          <div class="A_MCD_MAIN_FNP">
            <p class="A_MCD_MAIN_FN">${escapeHtml(userData.userName)}</p>
            <p class="A_MCD_MAIN_FP">
              <a href="tel:${escapeHtml(userData.phoneNumber)}" class="A_MCD_MAIN_FP_A">
                ${escapeHtml(userData.phoneNumber)}
              </a>
            </p>
          </div>
        </div>`;

      document.querySelector('.A_MCD_MAIN_F').innerHTML = ADMIN_PTC_H;

      // Event listener delegation for user selection
      document.querySelector('.A_MCD_MAIN_F').addEventListener('click', (event) => {
        const userElement = event.target.closest('.A_MCD_MAIN_FC');
        if (!userElement) return;

        const userName = userElement.dataset.userName;
        const userOrder = userElement.dataset.userOrder;
        const userPhoneNumber = userElement.dataset.userPhoneNumber;

        localStorage.setItem("userName", userName);
        localStorage.setItem("userOrder", userOrder);
        localStorage.setItem("userPhoneNumber", userPhoneNumber);

        document.querySelector('.A_MCD_MAIN_F').style.zIndex = 0;
        document.querySelector('.A_MCD_MAIN_S').style.zIndex = 1;

        localStorage.setItem("Contact_WA", userPhoneNumber);
      });
    }

    // Update order details if phone number has changed
    if (localStorage.getItem("userPhoneNumber") !== sessionStorage.getItem("userPhoneNumber")) {
      sessionStorage.setItem("userPhoneNumber", localStorage.getItem("userPhoneNumber"));

      ADMIN_PTC_Order = ``;//<div class="A_MCD_MAIN_SBD_WB"></div>

      const userOrders = localStorage.getItem("userOrder").split(',');
      userOrders.forEach((order) => {
        const [productId, productQuantity] = order.split('/').map(Number);
        const product = PI.find(item => item.id === productId);

        if (product) {
          const price = formatPrice_A(product.p);
          const totalPrice = formatPrice_A(product.p * productQuantity);

          ADMIN_PTC_Order += `
            <div class="A_MCD_MAIN_SBD_B">
              <div class="A_MCD_MAIN_SBD_B_L">
                <div class="A_MCD_MAIN_SBD_B_LI" style="background-image: url('${escapeHtml(product.i)}');">
                  <img src="${escapeHtml(product.i)}" class="Img_FC HPCD_I" data-i="${escapeHtml(product.i)}" data-n="${escapeHtml(product.n)}" data-p="${escapeHtml(product.p)}">
                </div>
              </div>
              <div class="A_MCD_MAIN_SBD_B_R">
                <p class="A_MCD_MAIN_SBD_B_RN">${escapeHtml(product.n)}</p>
                <p class="A_MCD_MAIN_SBD_B_RP"><b>subtotal:</b> &#8358 ${price}</p>
                <p class="A_MCD_MAIN_SBD_B_RQ"><b>quantity:</b> ${productQuantity}</p>
                <p class="A_MCD_MAIN_SBD_B_RT">Total: &#8358 ${totalPrice}</p>
              </div>
            </div>`;
        }
      });

      document.querySelector('.A_MCD_MAIN_SBD').innerHTML = ADMIN_PTC_Order;
      document.querySelector('.A_MCD_MAIN_STD').innerHTML = `
        <p class="A_MCD_MAIN_STD_I"></p>
        order by 
        <p class="A_MCD_MAIN_STD_UN">${escapeHtml(localStorage.getItem("userName"))}</p>
        <p class="A_MCD_MAIN_SBD_WB"></p>`;

      document.querySelector('.A_MCD_MAIN_SBD_WB').addEventListener('click', () => {
        const phoneNumber = localStorage.getItem("Contact_WA");
        const url = `https://wa.me/${escapeHtml(phoneNumber)}`;
        window.open(url, "_blank").focus();
      });
    }
  }
}, 100);

// Helper function to escape special HTML characters
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (char) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return map[char] || char;
  });
}

// Format price with commas
function formatPrice_A(price) {
  return price.toLocaleString();
}




// Help Center / Contact Us
document.querySelector('.HC_D').addEventListener('click', () => {
  const phoneNumber = "+2349162820838";
  const url = `https://wa.me/${escapeHtml(phoneNumber)}`;
  window.open(url, "_blank").focus();
});






























































document.querySelector('.ADD_PD_MC_IPI').addEventListener('change', (e) => {
    const files = e.target.files;

    // Check if a file was selected
    if (!files || files.length === 0) {
        console.error('No file selected.');
        return;
    }

    const file = files[0];

    // Validate the file type (only images allowed)
    if (!file.type.startsWith('image/')) {
        console.error('The selected file is not an image.');
        return;
    }

    // Create a new FileReader instance
    const picRender = new FileReader();

    picRender.onload = (event) => {
        // Validate the image data (just in case)
        const imageData = event.target.result;
        if (typeof imageData !== 'string' || !imageData.startsWith('data:image/')) {
            console.error('Invalid image data.');
            return;
        }

        // Store the image data securely in localStorage
        try {
            // Check if product_I already exists in localStorage
            if (localStorage.getItem('product_I')) {
                console.log('Product image already set.');
            }

            // Store image in localStorage
            localStorage.setItem('product_I', imageData);

            // Update the background image of the element
            const imageElement = document.querySelector('.ADD_PD_MC_I');
            if (imageElement) {
                imageElement.style.backgroundImage = `url('${imageData}')`;
            } else {
                console.error('Image element not found.');
            }
        } catch (error) {
            console.error('Error setting image to localStorage:', error);
        }
    };

    // Error handling for file reading process
    picRender.onerror = () => {
        console.error('Error reading the file.');
    };

    // Read the file as a Data URL (base64)
    picRender.readAsDataURL(file);
});


















// Handle FPC display timeout FIRST PAGE

  const fpcElement = document.querySelector('.FPC');

  const FPC_LG = document.querySelector('.FPC_LG');
  const FPC_CD = document.querySelector('.FPC_CD');
  const FPC_TX = document.querySelector('.FPC_TX');

  //document.querySelector('.FPC').style.display = 'block';

  setInterval(() => {
    
    if (PI.length > 0 && PI[0].id !== 0) {
      
      if (screen.width > 1024) {

        FPC_LG.style.display = 'none';
        FPC_CD.style.display = 'block';
        FPC_TX.style.display = 'block';
        fpcElement.style.display = 'block';
        
      }else{
  
        FPC_LG.style.display = 'block';
        FPC_CD.style.display = 'none';
        FPC_TX.style.display = 'none';
        fpcElement.style.display = 'none';
  
      }

    }


  }, 100);




