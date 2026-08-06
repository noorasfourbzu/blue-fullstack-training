
// get the menu button and navigation
const menuButton = document.querySelector(".menu-button");
const mainNavigation = document.getElementById("main-navigation");

// select all links inside the main navigation
const navigationLinks = mainNavigation.querySelectorAll("a");

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


// get the contact form from the page
const contactForm = document.getElementById("contact-form");

// runs when the user submit the form 
contactForm.addEventListener("submit", function (event) {
document.getElementById("name-error").textContent = "";
document.getElementById("email-error").textContent = "";
document.getElementById("subject-error").textContent = "";
document.getElementById("message-error").textContent = "";


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