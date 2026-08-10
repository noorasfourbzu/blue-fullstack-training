// 1. Shared DOM references and helper functions

// mobile navigation 
const menuButton = document.querySelector(".menu-button");
const mainNavigation = document.getElementById("main-navigation");
const navigationLinks = mainNavigation.querySelectorAll("a");

// contact form 
const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");

// error elements
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const phoneError = document.getElementById("phone-error");
const subjectError = document.getElementById("subject-error");
const messageError = document.getElementById("message-error");

// other form elements
const messageCounter = document.getElementById("message-counter");
const formStatus = document.getElementById("form-status");

// back to to behavour elements 
const backToTopButton = document.getElementById("back-to-top");
const SCROLL_SHOW_RATIO = 1; // show after scrolling past this many full screen-heights

// validation rules 
 const NAME_MIN_LENGTH = 2;
 const NAME_MAX_LENGTH = 60;
 
const PHONE_MIN_DIGITS = 8;
const PHONE_MAX_DIGITS = 15; // in case of the country phone intro 
// phone numbers are allowed to contain digits, spaces, +, -, ( and )
 const PHONE_ALLOWED_CHARACTERS = /^[0-9+\-\s()]*$/;

const SUBJECT_MIN_LENGTH = 3;
const SUBJECT_MAX_LENGTH = 100;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 500;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// trim inputs 
function getTrimmedValue(input) {
    return input.value.trim();
}

// show an error message on a field + update its accessibility state
function showFieldError(input, errorElement, message) {
    if (!input || !errorElement) return; // safety check
    input.setAttribute("aria-invalid", "true");
    input.classList.add("is-invalid");
    errorElement.textContent = message;
}

// clear an error message on a field + restore its accessibility state
function clearFieldError(input, errorElement) {
    if (!input || !errorElement) return; // safety check
    input.setAttribute("aria-invalid", "false");
    input.classList.remove("is-invalid");
    errorElement.textContent = "";
}


// phone validation without forming characters
// counts only the digits inside a phone number string
function countDigits(value) {
    return value.replace(/\D/g, "").length;
}

function limitPhoneDigitsWhileTyping() {
    if (!phoneInput) return;

    if (countDigits(phoneInput.value) > PHONE_MAX_DIGITS)
        phoneInput.value = phoneInput.value.slice(0, -1);
    
}

//lazy loading for any img 
document.querySelectorAll("img").forEach((img) => {
    img.loading = "lazy";
});


// 2. Contact-form validation

// full name validation 
function validateName() {
    if (!nameInput || !nameError) return false;

    const name = getTrimmedValue(nameInput);

    if (name === "") {
        showFieldError(nameInput, nameError, "please enter your full name");
        return false;
    }
    if (name.length < NAME_MIN_LENGTH) {
        showFieldError(nameInput, nameError, `full name must contain at least ${NAME_MIN_LENGTH} characters`);
        return false;
    }
    if (name.length > NAME_MAX_LENGTH) {
        showFieldError(nameInput, nameError, `full name must not exceed ${NAME_MAX_LENGTH} characters`);
        return false;
    }

    clearFieldError(nameInput, nameError);
    return true;
}

//  email validation 
function validateEmail() {
    if (!emailInput || !emailError) return false;
    const email = getTrimmedValue(emailInput);

    if (email === "") {
        showFieldError(emailInput, emailError, "please enter your email address");
        return false;
    }
    if (!EMAIL_PATTERN.test(email)) {
        showFieldError(emailInput, emailError, "please enter a valid email address like: name@example.com.");
        return false; }

    clearFieldError(emailInput, emailError);
    return true;
}


// phone validation 

function validatePhone() {
    if (!phoneInput || !phoneError) return false;

    const phone = getTrimmedValue(phoneInput);


    // phone is optional so an empty value is valid
    if (phone === "") {
        clearFieldError(phoneInput, phoneError);
        return true;}


    if (!PHONE_ALLOWED_CHARACTERS.test(phone)) {

        showFieldError(phoneInput, phoneError, "phone number can only contain digits, spaces, +, -,) and( ) ");

        return false; }
const digitCount = countDigits(phone);

 if (digitCount < PHONE_MIN_DIGITS || digitCount > PHONE_MAX_DIGITS) {

    showFieldError(phoneInput, phoneError, `phone number must contain between ${PHONE_MIN_DIGITS} and ${PHONE_MAX_DIGITS} digits`);
        return false;
    }
    clearFieldError(phoneInput, phoneError);
    return true;

}



// subject validation 
function validateSubject() {
    if (!subjectInput   || !subjectError) return false;

    const subject = getTrimmedValue(subjectInput);

    if (subject === "") {
        showFieldError(subjectInput, subjectError, "please enter the subject");
        return false;
    }
    if (subject.length < SUBJECT_MIN_LENGTH) {
        showFieldError(subjectInput, subjectError, `subject must contain at least ${SUBJECT_MIN_LENGTH} characters`);
        return false;
    }
    if (subject.length > SUBJECT_MAX_LENGTH) {
        showFieldError(subjectInput, subjectError, `subject must not exceed ${SUBJECT_MAX_LENGTH} characters`);
        return false;
    }

    clearFieldError(subjectInput, subjectError);
    return true;
}

//  message validation 
function validateMessage() {
    if (!messageInput || !messageError) return false;

    const message = getTrimmedValue(messageInput);

    if (message === "") {
        showFieldError(messageInput, messageError, "please enter your message");
        return false;
    }
    if (message.length < MESSAGE_MIN_LENGTH) {
        showFieldError(messageInput, messageError, `message must contain at least ${MESSAGE_MIN_LENGTH} characters`);
        return false; }
    if (message.length > MESSAGE_MAX_LENGTH) {
        showFieldError(messageInput, messageError, `message must not exceed ${MESSAGE_MAX_LENGTH} characters`);
        return false; }

 clearFieldError(messageInput, messageError);
return true;
}

// updating the counter 
function updateMessageCounter() {
    if (!messageInput || !messageCounter) return;

    // count char  * the text here is not trimmed even spaces are counted 
    const currentLength = messageInput.value.length;
    messageCounter.textContent = `${currentLength} / ${MESSAGE_MAX_LENGTH} characters used`;

    // give warning when the user is over the limit
    if (currentLength > MESSAGE_MAX_LENGTH) {
        messageCounter.classList.add("counter-warning");
    } else {
        messageCounter.classList.remove("counter-warning");
    }
}

// validation for are values when clicking submit 
function validateAllFields() {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
   const isSubjectValid = validateSubject();
   const isMessageValid = validateMessage();
    const isValid = isNameValid && isEmailValid && isPhoneValid && isSubjectValid && isMessageValid;

    // figure out which field should get focus one plain check at a time
    let firstInvalidField = null;
    if (!isNameValid) {firstInvalidField = nameInput;}
     else if (!isEmailValid) {firstInvalidField = emailInput;} 
    else if (!isPhoneValid) {firstInvalidField = phoneInput;} 
    else if (!isSubjectValid) {firstInvalidField = subjectInput;}
        else if (!isMessageValid) {firstInvalidField = messageInput;}
    return { isValid: isValid, firstInvalidField: firstInvalidField };
}

// clears every error message and accessibility state on the form
function clearAllFieldErrors() {
    clearFieldError(nameInput, nameError);
    clearFieldError(emailInput, emailError);
    clearFieldError(phoneInput, phoneError);
    clearFieldError(subjectInput, subjectError);
    clearFieldError(messageInput, messageError);
}

// re check a field while the user is fixing an existing error
// so the error disappears as soon as the value becomes valid
// this does not  show new errors before the user has interacted with the field
function revalidateWhileTyping(input, validateFn) {
    if (!input) return;
    input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") {
            validateFn();
        }
    });
}


// 3. Back-to-top behavior

 
// checks the user OS or browser setting for reduced motion
function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
 
// show the button once the user has scrolled down far enough, hide it near the top
// the threshold is based on the device own screen height(to continue with the  responsive design )
function toggleBackToTopVisibility() {
    if (!backToTopButton) return;
 
    const showThreshold = window.innerHeight * SCROLL_SHOW_RATIO;
 
    if (window.scrollY > showThreshold) {
        backToTopButton.classList.add("is-visible");
    } else {
        backToTopButton.classList.remove("is-visible");
    }
}
 
// scroll the page back to the top  smoothly unless the user prefers reduced motion
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? "auto" : "smooth"
    });
}
 


// 4. Active navigation state

 
// every section inside <main> that has an id becomes something we track
const observedSections = document.querySelectorAll("main section[id]");
 
// remembers how visible each section currently is (0 = not visible, 1 = fully visible)
const visibilityRatios = new Map();
 
// marks the nav link matching this as current and clears the rest
function setActiveNavLink(sectionId) {
    navigationLinks.forEach(function (link) {
        const isCurrentSection = link.getAttribute("href") === `#${sectionId}`;
 
        link.classList.toggle("is-active-link", isCurrentSection);
 
        if (isCurrentSection) link.setAttribute("aria-current", "true");
         else  link.removeAttribute("aria-current");
        
    });
}
 
//out of everything currently on screen find whichever section takes up
// the most of the viewport right now and mark that one as active
function updateActiveSectionFromRatios() {
    let mostVisibleSectionId = null;
    let highestRatio = 0;
 
    visibilityRatios.forEach(function (ratio, sectionId) {
        if (ratio > highestRatio) {
            highestRatio = ratio;
            mostVisibleSectionId = sectionId;
        }
    });
 
    if (mostVisibleSectionId) setActiveNavLink(mostVisibleSectionId);
    
}
 


// 5. Statistics counters

const statisticNumbers = document.querySelectorAll(".statistic-card h3");
const statisticsSection = document.getElementById("statistics");
const COUNT_DURATION = 1500; // how long the count-up takes, in milliseconds

// pulls the number and any suffix (like "+") out of a stat's original text,
// e.g. "12+" becomes { targetNumber: 12, suffix: "+" }
function parseStatisticValue(text) {
    const match = text.trim().match(/^(\d+)(.*)$/);
    if (!match) return null;

    return {
        targetNumber: parseInt(match[1], 10),
        suffix: match[2]
    };
}

// remembers each counter's target value and suffix, and sets its
// starting display to 0 (unless the user prefers reduced motion,
// in which case we just leave the real number showing)
const parsedStatistics = [];

statisticNumbers.forEach(function (numberElement) {
    const parsed = parseStatisticValue(numberElement.textContent);
    if (!parsed) return;

    parsedStatistics.push({
        element: numberElement,
        targetNumber: parsed.targetNumber,
        suffix: parsed.suffix
    });

    if (!prefersReducedMotion()) {
        numberElement.textContent = `0${parsed.suffix}`;
    }
});

// animates one number counting up from 0 to its target value
function animateStatisticNumber(element, targetNumber, suffix) {
    const startTime = performance.now();

    function updateFrame(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / COUNT_DURATION, 1); // 0 to 1

        const currentValue = Math.round(progress * targetNumber);
        element.textContent = `${currentValue}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(updateFrame);
        }
    }

    requestAnimationFrame(updateFrame);
}

// runs every counter's animation once (or shows the final numbers
// immediately if the user prefers reduced motion)
function runStatisticsAnimation() {
    parsedStatistics.forEach(function (stat) {
        if (prefersReducedMotion()) {
            stat.element.textContent = `${stat.targetNumber}${stat.suffix}`;
        } else {
            animateStatisticNumber(stat.element, stat.targetNumber, stat.suffix);
        }
    });
}



// 6. Initialization

// sets up the contact form's listeners: blur validation, live
// re validation while correcting, the live character counter,
// and the submit handler; also paints the counter's starting text
function initContactForm() {
    // validate a field after it loses focus (blur)
    if (nameInput) nameInput.addEventListener("blur", validateName);
    if (emailInput) emailInput.addEventListener("blur", validateEmail);
    if (phoneInput) phoneInput.addEventListener("blur", validatePhone);
    if (subjectInput) subjectInput.addEventListener("blur", validateSubject);
    if (messageInput) messageInput.addEventListener("blur", validateMessage);

    revalidateWhileTyping(nameInput, validateName);
    revalidateWhileTyping(emailInput, validateEmail);
    revalidateWhileTyping(phoneInput, validatePhone);
    revalidateWhileTyping(subjectInput, validateSubject);
    revalidateWhileTyping(messageInput, validateMessage);

    // keep the character counter live as the user types the message
    if (messageInput) {
        messageInput.addEventListener("input", updateMessageCounter);
    }

    // handle the form submission
    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            // stop the browser from refreshing the page or sending the form anywhere
            event.preventDefault();

            const result = validateAllFields();

            if (!result.isValid) {
                // send the keyboard focus to the first field that needs fixing
                if (result.firstInvalidField) {
                    result.firstInvalidField.focus();
                }
                formStatus.textContent = "please fix the highlighted fields and try again.";
                formStatus.classList.remove("form-status--success");
                formStatus.classList.add("form-status--error");
                return;
            }

            // everything is valid, show a success message
            formStatus.textContent =
                "Thank you! Your message was sent successfuly";
            formStatus.classList.remove("form-status--error");
            formStatus.classList.add("form-status--success");

            // reset the form fields and clear every validation state
            contactForm.reset();
            clearAllFieldErrors();
            updateMessageCounter();
        });
    }

    // set the counter starting text when the page first loads
    updateMessageCounter();
}

// sets up the back-to-top button: show/hide on scroll and resize,
// scroll-to-top on click, and the correct starting visibility state
function initBackToTop() {
    if (backToTopButton) {
        window.addEventListener("scroll", toggleBackToTopVisibility);
        window.addEventListener("resize", toggleBackToTopVisibility);
        backToTopButton.addEventListener("click", scrollToTop);

        // in case the page loads already scrolled down from a refresh for example,
        // set the correct starting state right away instead of waiting for a scroll
        toggleBackToTopVisibility();
    }
}

// sets up the IntersectionObserver that tracks each section's
// visibility and keeps the matching nav link marked as active
function initActiveNavigation() {
    if (observedSections.length > 0) {
        const sectionObserver = new IntersectionObserver(
            function (entries) {
                // update our record of every section that changed visibility this round
                entries.forEach(function (entry) {
                    visibilityRatios.set(entry.target.id, entry.intersectionRatio);});
                // then re check which one is currently the most visible
                updateActiveSectionFromRatios();},
            {
            root: null, //use the visible browser window as the boundary
            threshold: [0, 0.25, 0.5, 0.75, 1] //check visibility at these five points as the user scrolls
            }
        );

        observedSections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }
}

// sets up the IntersectionObserver that triggers the statistics
// count-up animation once, the first time the section is seen
function initStatisticsCounters() {
    if (statisticsSection && parsedStatistics.length > 0) {
        const statisticsObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
            if (entry.isIntersecting) { runStatisticsAnimation();
                        // stop watching after the first run, so it never repeats
                     statisticsObserver.unobserve(entry.target);}});},
            { threshold: 0.3 } // start once about a third of the section is visible
        );

        statisticsObserver.observe(statisticsSection);
    }
}

//-----------------------------------------
// mobile / tablet navbar control 
// sets up the Task 03 mobile navigation: Escape-to-close,
// the menu button toggle, and closing the menu on link click
function initMobileNavigation() {
    // close the menu with Escape and return focus to the menu button
    document.addEventListener("keydown", function (event) {
        const isMenuOpen = mainNavigation.classList.contains("is-open");

        if (event.key === "Escape" && isMenuOpen) {
            mainNavigation.classList.remove("is-open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
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
}


//============== working on task 6==============================
const Games =[
    new Game("Helix jump","Hyper","quick fun with simple rules"),
    new Game("Shadow Legends","RPG","open world exploration"),
    new Game("Project Phrombus","hyper","Fast Visauls")
];


const gamesContainer = document.querySelector("#games-container");
 function renderGames(){
    gamesContainer.innerHTML="";
    Games.forEach(game=>{
const gameElement = document.createElement("p");
   gameElement.textContent = `${game.title} - ${game.category} - ${game.description}`;

        gamesContainer.appendChild(gameElement);
    });
 }
 renderGames();

// run all feature initializers once the DOM references above are ready
function initApp() {
    initMobileNavigation();
    initContactForm();
    initBackToTop();
    initActiveNavigation();
    initStatisticsCounters();
}

initApp();