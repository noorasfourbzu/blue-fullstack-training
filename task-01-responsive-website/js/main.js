// get the contact form from the page
const contactForm = document.getElementById("contact-form");

// runs when the user submit the form 
contactForm.addEventListener("submit", function (event) {
    

    // get the inputs + remove extra spaces
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // to track if all fields are valid
    let isValid = true;
    
    // Chec name field 
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
        // clear to make sure user understode it was don successfully 
        contactForm.reset();
    }
});