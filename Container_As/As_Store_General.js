// Utility function to set element height dynamically
function setElementHeight(selector, offset = 0) {
    const element = document.querySelector(selector);
    if (element) {
        element.style.height = `${screen.height - offset}px`;
    }
}

// Utility function to show or hide elements
function toggleElementDisplay(selector, displayValue) {
    const element = document.querySelector(selector);
    if (element) {
        element.style.display = displayValue;
    }
}

// Utility function to set z-index based on condition
function setZIndexBasedOnCondition(condition, element1, element2) {
    const elem1 = document.querySelector(element1);
    const elem2 = document.querySelector(element2);
    if (elem1 && elem2) {
        if (condition) {
            elem1.style.zIndex = 1;
            elem2.style.zIndex = 0;
        } else {
            elem1.style.zIndex = 0;
            elem2.style.zIndex = 1;
        }
    }
}

// Set initial heights for various elements
setInterval(()=>{
    setElementHeight('.MCD', 142);
    setElementHeight('.DIC_D_C', 142);
    setElementHeight('.A_MCD_MAIN', 60 + 142);
    setElementHeight('.A_MCD_MAIN_SBD', 100 + 142);
    setElementHeight('.SUB_PD_M', 105 + 142);
    setElementHeight('.ADD_PD_M', 105 + 142);
},100)

// SUB_PD_M scroll handling
setInterval(() => {
    const isScrolled = document.querySelector('.H').scrollTop !== 0;
    const ctStatus = localStorage.getItem('CT') === 'true';
    
    // Adjust visibility and height based on scroll and 'CT' status
    if (isScrolled || ctStatus) {
        toggleElementDisplay('.MCD_TC_Phone', 'none');
        toggleElementDisplay('.MCD_TC_CNL', 'none');
        setElementHeight('.MCD_B', 50 + 142);
        setElementHeight('.H', 50 + 142);
        setElementHeight('.C', 50 + 142);
    } else {
        toggleElementDisplay('.MCD_TC_Phone', 'flex');
        toggleElementDisplay('.MCD_TC_CNL', 'flex');
        setElementHeight('.MCD_B', 137 + 142);
        setElementHeight('.H', 137 + 142);
        setElementHeight('.C', 137 + 142);
    }

    // Toggle z-index based on CT status
    setZIndexBasedOnCondition(ctStatus, '.C', '.H');

    // Show admin section based on localStorage
    if (localStorage.getItem("ADMIN") === "true") {
        document.querySelector('.A_MCD').style.display = "block";
        localStorage.setItem("userOrder", " ");
    } else {
        document.querySelector('.A_MCD').style.display = "none";
    }
}, 100);

// Toggle between A and M sections
document.querySelectorAll('.MA_B').forEach((e) => {
    e.addEventListener('click', () => {
        const dataDashedId = e.dataset.id;
        const isA = dataDashedId === 'A';
        const isM = dataDashedId === 'M';

        document.querySelector('.A').style.display = isA ? 'flex' : 'none';
        document.querySelector('.M').style.display = isM ? 'flex' : 'none';
    });
});

// Handle CALA page visibility based on user information
setInterval(() => {
    const userNP = localStorage.getItem("user_NP");
    const calaPage = document.querySelector('.CALA_page_B');
    const caButton = document.querySelector('.CA');

    if (userNP === null) {
        calaPage.style.display = 'block';
    } else {
        calaPage.style.display = 'none';
        caButton.innerText = userNP.split('/')[0];
    }
}, 100);

// Validate and save user data for CALA page
document.querySelector('.CALA_page_Button').addEventListener('click', () => {
    const ipcValue = document.querySelector('.IPC').value;
    const ipValue = document.querySelector('.IP').value;
    
    if (ipValue !== "" && ipcValue.length === 10 || ipcValue.length === 11) {
        const phoneNumber = ipcValue.length === 11 ? `+234${ipcValue.slice(1)}` : `+234${ipcValue}`;
        

        if (ipValue.toLowerCase() === "as abdullahi" && ipcValue === "1234567890") {
            localStorage.setItem("ADMIN", 'true');
            
            localStorage.setItem("Contact_WA","")
            localStorage.setItem("userName","")
            localStorage.setItem("userOrder","")
            localStorage.setItem("userPhoneNumber","")
            localStorage.setItem("orderSet","")

            document.querySelector('.IPC').value = "";
            document.querySelector('.IP').value = "";

        } else {
            localStorage.setItem("ADMIN", 'false');
            localStorage.setItem("user_NP", `${ipValue}/${phoneNumber}`);

            document.querySelector('.IPC').value = "";
            document.querySelector('.IP').value = "";
        }
    } else {
        // Invalid input handling
        document.querySelector('.IP').style.outline = ipValue !== "" ? "2px solid green" : "2px solid red";
        document.querySelector('.IPC').style.outline = ipcValue.length === 10 || ipcValue.length === 11 ? "2px solid green" : "2px solid red";
    }
});






















(function() {
    // Utility function to safely access localStorage
    const safeLocalStorage = {
        get: (key) => {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.warn(`Error accessing localStorage for key: ${key}`);
                return null;
            }
        },
        set: (key, value) => {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                console.warn(`Error setting localStorage for key: ${key}`);
            }
        },
        remove: (key) => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn(`Error removing localStorage for key: ${key}`);
            }
        }
    };

    // Function to toggle zIndex of elements
    function toggleZIndex(showElement, hideElement) {
        showElement.style.zIndex = 1;
        hideElement.style.zIndex = 0;
    }

    // Handle navigation between home and cart sections
    document.querySelector('.home').addEventListener('click', () => {
        toggleZIndex(document.querySelector('.H'), document.querySelector('.C'));
        safeLocalStorage.set('CT', 'false');
        document.querySelector('.A').style.display = 'none';

        document.querySelector('.footer').style.display = "none";
    });

    document.querySelector('.cart').addEventListener('click', () => {
        toggleZIndex(document.querySelector('.C'), document.querySelector('.H'));
        safeLocalStorage.set('CT', 'true');
        document.querySelector('.A').style.display = 'none';
    });

    // A_MCD_MAIN_STD_I click event handler with delegation
    document.addEventListener('click', (event) => {
        if (event.target.matches('.A_MCD_MAIN_STD_I')) {
            toggleZIndex(document.querySelector('.A_MCD_MAIN_F'), document.querySelector('.A_MCD_MAIN_S'));
        }
    });

    

    // Clear session/localStorage and reset UI on logout
    document.querySelector('.A_MCD_L').addEventListener('click', () => {
        ['ADMIN', 'user_NP', 'Contact_WA', 'userName', 'userOrder', 'userPhoneNumber', 'orderSet', 'product_I', 'product_LCount', 'product_N', 'product_P'].forEach(key => safeLocalStorage.remove(key));
        
        document.querySelector('.CA').innerText = "Create new account";
        toggleZIndex(document.querySelector('.H'), document.querySelector('.C'));
        safeLocalStorage.set('CT', 'false');
        
    });

    // Handle showing and hiding of Add/Remove Product sections
    document.querySelector('.A_MCD_S').addEventListener('click', () => {
        document.querySelector('.ADD_PD').style.display = "none";
        document.querySelector('.SUB_PD').style.display = "block";
    });

    document.querySelector('.A_MCD_A').addEventListener('click', () => {
        document.querySelector('.ADD_PD').style.display = "block";
        document.querySelector('.SUB_PD').style.display = "none";
    });

    // Handle closing of SUB_PD and ADD_PD sections
    document.querySelector('.SUB_PD_H').addEventListener('click', () => {
        document.querySelector('.SUB_PD').style.display = "none";
    });

    document.querySelector('.ADD_PD_H').addEventListener('click', () => {
        document.querySelector('.ADD_PD').style.display = "none";
    });

    // Handle DIC_BACK click event with delegation
    document.addEventListener('click', (event) => {
        if (event.target.matches('.DIC_BACK')) {
            document.querySelector('.DIC_D_C').style.display = "none";
        }
    });
})();


















  setInterval(()=>{

    var div = document.querySelector('.C');  // Replace with your div's ID
    div.addEventListener('scroll', function() {
        if (div.scrollTop + div.clientHeight === div.scrollHeight) {
            document.querySelector('.footer').style.display = "block";
        }else{
            document.querySelector('.footer').style.display = "none";
        }
    });
    
  },3000)


























