// 1. DOM references
const menuButton = document.querySelector(".menu-button");
const mainNavigation = document.getElementById("main-navigation");
const navigationLinks = mainNavigation.querySelectorAll("a");
const contactForm = document.getElementById("contact-form");



// error elements 
   const nameError = document.getElementById("name-error");
   const emailError = document.getElementById("email-error");
   const subjectError = document.getElementById("subject-error");
   const messageError = document.getElementById("message-error");
   const phoneError = document.getElementById("phone-error");


   const messageCounter = document.getElementById("message-counter");
   const formStatus = document.getElementById("form-status");
// 2. Constants and state

const NAME_MIN_LENGTH=2; 
const NAME_MAX_LENGTH=60;
const PHONE_MIN_DIGITS=10; 
const PHONE_MAX_DIGITS=13; // if added 970 or 972, +3 digits

const SUBJECT_MIN_LENGTH=3; 
const SUBJECT_MAX_LENGTH=100;
const MESSAGE_MIN_LENGTH=10; 
const MESSAGE_MAX_LENGTH=500;

// 3. Shared helper functions

// trim the value
function getTrimmedValue(valueNT/*value not trimmed*/){
return valueNT.value.trim();
}

// display error + update field accessibility state
function showFieldError(input,errorElement,message){
    if(!input ||  !errorElement) /*check if elements exists : for safety */
        return;
    input.setAttribute("aria-invalid", "true");
    input.classList.add("is-invalid");
    errorElement.textContent = message;
}


// clear error + restore the valid accessibility state
function clearFieldError(input, errorElement) {
    if ( !input ||  !errorElement) return;
    input.setAttribute("aria-invalid", "false");
    input.classList.remove("is-invalid");
    errorElement.textContent = "";
}

// 4. Mobile navigation

//close the menu with Escape and return focus to the menu button
document.addEventListener("keydown", function (event) {
    const isMenuOpen =
        mainNavigation.classList.contains("is-open");

    if (event.key === "Escape" && isMenuOpen) {
        //close the menu
    mainNavigation.classList.remove("is-open");

        //update the button state
          menuButton.setAttribute("aria-expanded", "false");
           menuButton.setAttribute( "aria-label","Open navigation menu");

        //return focus to the menu button
        menuButton.focus();
    }
});


// open and close the navigation
menuButton.addEventListener("click", function () {
    const isOpen = mainNavigation.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", isOpen);
    if (isOpen) {
        menuButton.setAttribute("aria-label", "Close navigation menu");
    } else {
        menuButton.setAttribute("aria-label", "Open navigation menu");
    }
});

// close the mobile menu after clicking any navigation link
navigationLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        mainNavigation.classList.remove("is-open");
     menuButton.setAttribute("aria-expanded", "false");
       menuButton.setAttribute("aria-label", "Open navigation menu");
    });
});



// 5. Contact form validation

// runs when the user submit the form 
contactForm.addEventListener("submit", function (event) {


    // بمنع التصرف الافتراضي للمتصفح , عشان الحق اعمل فاليديشن قبل يعمل ريفريش للصفحة او ارسال للرسالة 
    event.preventDefault();
    // get the inputs + remove extra spaces
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // to track if all fields are valid
    let isValid = true;
    
    // Check name field 
    if (name === "")/* is empty? */ {
        document.getElementById("name-error").textContent =
            "Please enter your name.";
        isValid = false;
    }

    // Check  email field 
    if (email === "") /* is empty? */ {
        document.getElementById("email-error").textContent =
            "Please enter your email.";
        isValid = false;
    } else if (!email.includes("@") || !email.includes(".")) /* correct formate*/{
        document.getElementById("email-error").textContent =
            "please enter a valid email.";
        isValid = false;
    }

    // Checksubject field 
    if (subject === "") /*is empty?*/ {
        document.getElementById("subject-error").textContent =
            "Please enter a subject.";
        isValid = false;
    }

    // check message field
    if (message === "") /* is empty? */{
        document.getElementById("message-error").textContent =
            "please enter your message.";
        isValid = false;
    }

    // show  success message when all inputs are valid
    if (isValid) {
        alert("form completed successfully.");
        // clear to make sure user understand it was done successfully 
        contactForm.reset();
    }
});   


// 6. Message character counter

// 7. Back-to-top button

// 8. Active navigation links

// 9. Statistics counters

// 10. Initialization