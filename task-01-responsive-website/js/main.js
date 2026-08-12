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

// games section
const gamesContainer = document.querySelector(".games-container");
const categoryButtonContainer = document.querySelector(".category-buttons-container");
const categoryCapsule = []

// API section elements 
const postsContainer = document.querySelector(".latest-posts-container");
const postsStatus = document.querySelector(".posts-status");/* loading,error,empty*/
const API_URL ="https://jsonplaceholder.typicode.com/posts";
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-word");   
const clearSearchButton = document.getElementById("clear-search");
const resultsCount = document.getElementById("results-count");
let postsArray = []; 

const GAMES_CATEGORY_STORAGE_KEY = "asfoura-selected-game-category";


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

// id for each game 
function idGenerator(num){
    const ids = [];
    for(let i=0; i<num ; i++){
        ids.push('G${i+1}${Math.random()}');
    }

    return ids; 
}
const ids = idGenerator(8);

// local javascript data
const games = [
    new Game(
        ids[0],
        "Helix Jump",
        "Arcade",
        "A fast-paced arcade game where players guide a bouncing ball through a twisting tower.",
        2018
    ),

    new Game(
        ids[1],
        "Shadow Legends",
        "RPG",
        "A fantasy role-playing game where players explore a dark world, battle enemies, and develop their characters.",
        2018
    ),

    new Game(
        ids[2],
 "Project Phrombus",
        "Action",
        "An experimental action game focused on exploration, challenges, and mysterious environments.",
        2026
    ),

    new Game(
        ids[3],
        "Hollow Knight",
        "Metroidvania",
        "An atmospheric adventure game where players explore a vast underground kingdom filled with enemies and secrets.",
        2017
    ),

    new Game(
        ids[4],
        "Stardew Valley",
        "Simulation",
        "A relaxing farming and life simulation game where players grow crops, build relationships, and explore the world.",
        2016
    ),

    new Game(
        ids[5],
        "Celeste",
        "Platformer",
        "A challenging platform game about climbing a mysterious mountain while overcoming difficult obstacles.",
        2018
    ),

    new Game(
        ids[6],
        "Mecha Chameleon",
        "Action",
        "A fastpaced action game where players control a mechanical chameleon and overcome challenging obstacles.",
        2026
    ),

    new Game(
        ids[7],
        "The Legend of Zelda: Breath of the Wild",
        "Adventure",
        "An open world adventure game where players explore a vast kingdom, solve puzzles, and fight enemies.",
        2017
    )
];


// make the filter functioning 
const categories =[];
for (let i = 0 ; i < games.length ; i++){
    if(!categories.includes(games[i].category))
    categories.push(games[i].category);
else continue;
}
function renderCategoryButton(){
    categoryButtonContainer.innerHTML = "";
    categoryCapsule.length = 0; // clear the shared array instead of reassigning it

    // "All" option first, so users can clear the filter
    const allCapsule = document.createElement("button");
    allCapsule.classList.add("category-capsule");
    allCapsule.textContent = "All";
    categoryButtonContainer.appendChild(allCapsule);
    categoryCapsule.push(allCapsule);

    for (let i = 0; i < categories.length; i++) {
        const capsuleElement = document.createElement("button");
        capsuleElement.classList.add("category-capsule");
        capsuleElement.textContent = categories[i];
        categoryButtonContainer.appendChild(capsuleElement);
        categoryCapsule.push(capsuleElement);
    }
}


// render projects and show project crads
function renderGames(selected) {
    gamesContainer.innerHTML = "";

    // treat "All" the same as no filter
    const filterdGames = (selected && selected !== "All")
        ? games.filter(g => g.category === selected)
        : games;

    filterdGames.forEach(game => {
        const gameCardElement = document.createElement("article");
        gameCardElement.classList.add("card", "game-card");
        const titleElement = document.createElement("h3");
        titleElement.textContent = game.title;

        const categoryElement = document.createElement("p");
        categoryElement.textContent = game.category;

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = game.description;

        const yearElement = document.createElement("p");
        yearElement.textContent = `Released: ${game.releaseYear}`;

        gameCardElement.appendChild(titleElement);
        gameCardElement.appendChild(categoryElement);
        gameCardElement.appendChild(descriptionElement);
        gameCardElement.appendChild(yearElement);
        gamesContainer.appendChild(gameCardElement);
    });
}

renderCategoryButton();
renderGames();

let selected = localStorage.getItem(GAMES_CATEGORY_STORAGE_KEY) || "All";

// function to apply the selected filter and update button active state
function applyCategoryFilter(category) {
 selected = category;
localStorage.setItem(GAMES_CATEGORY_STORAGE_KEY, category);
renderGames(selected);
    categoryCapsule.forEach(button => {
        const isActive = button.textContent === category;
      button.classList.toggle("is-active", isActive);
    });
}

// set initial active state based on saved selection
categoryCapsule.forEach(button => {
    if (button.textContent === selected) 
           button.classList.add("is-active");
    
         button.addEventListener("click", function () {
             applyCategoryFilter(button.textContent);
    });
});

// on first load render the saved category
renderGames(selected);

// ======REST API ========

async function fetchPosts() {
    showLoadingState();

    try {
     const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch posts");
        const posts = await response.json();
        await new Promise(resolve => setTimeout(resolve, 2000)); // simulate delay

        if (posts.length === 0) {
            showEmptyState();
            return;  }
        postsArray = posts.slice();   // store full list
        renderPosts(postsArray);       // display all posts

    //searchInput.addEventListener("input", handleSearchInput); 
    clearSearchButton.addEventListener("click", clearSearch);
    searchButton.addEventListener("click", handleSearchInput);

    } catch (error) {
    console.error("Fetch posts error:", error);
showErrorState();
    }

}
// Loading state – only the loading message is visible
function showLoadingState() {
    postsContainer.innerHTML = "";
    postsStatus.textContent = "Loading...";
    postsStatus.className = "posts-status"; // reset any error/success classes
    resultsCount.textContent = "";
}

// Error state – shows error message and a retry button
function showErrorState() {
    postsContainer.innerHTML = "";
    postsStatus.textContent = "Error fetching posts. Please try again later.";
    postsStatus.className = "posts-status posts-status--error";
    resultsCount.textContent = "";




    const retryButton = document.createElement("button");
     retryButton.textContent = "Retry";
     retryButton.type = "button";
     retryButton.addEventListener("click", fetchPosts);
     postsContainer.appendChild(retryButton);
}

// Empty state (when API returns no posts at all)
function showEmptyState() {
    postsContainer.innerHTML = "";
    postsStatus.textContent = "No posts available at the moment, come back later.";
    postsStatus.className = "posts-status";
     resultsCount.textContent = "";
}

// Render posts into the container
function renderPosts(posts) {
postsContainer.innerHTML = "";
      postsStatus.textContent = "";          // clear any status message
     postsStatus.className = "posts-status";
     resultsCount.textContent = `${posts.length} result${posts.length === 1 ? "" : "s"} found`;

    posts.forEach(post => {const card = createPostCards(post);
    postsContainer.appendChild(card);
    });
}


function createPostCards(post){
const card = document.createElement("article");
card.classList.add("card");
const title = document.createElement("h3");
const body = document.createElement("p");
title.textContent = post.title;
body.textContent = post.body;
card.append(title,body);
return card;
}



fetchPosts();
//searchInput.addEventListener("input", handleSearchInput); this is live search so it will be ON on every input change
//clearSearchButton.addEventListener("click", clearSearch);


//========= search posts ===============

function searchPosts(query) {

    const filteredPosts = postsArray.filter(post => {
    return post.title.toLowerCase().includes(query);
});
    renderPosts(filteredPosts);


}


// Filter posts based on title or body (case‑insensitive)
function filterPosts(query) {
    const lowerQuery = query.toLowerCase();
    return postsArray.filter(post => {
        return post.title.toLowerCase().includes(lowerQuery) ||
               post.body.toLowerCase().includes(lowerQuery);
    });
}

// Live search handler
function handleSearchInput() {
    const query = searchInput.value.trim();
    const filtered = filterPosts(query);

    if (filtered.length === 0) {
        // No matching results state
        postsContainer.innerHTML = "";
        postsStatus.textContent = "No matching results";
        postsStatus.className = "posts-status posts-status--empty";
        resultsCount.textContent = "0 results found";
        return;
    }

    renderPosts(filtered);
}

// Clear search: restore full list and empty the input
function clearSearch() {
    searchInput.value = "";
    renderPosts(postsArray);   // postsArray is the full list
    searchInput.focus();
}

 
// run all feature initializers once the DOM references above are ready
function initApp() {
    initMobileNavigation();
    initContactForm();
    initBackToTop();
    initActiveNavigation();
    initStatisticsCounters();
}

initApp();