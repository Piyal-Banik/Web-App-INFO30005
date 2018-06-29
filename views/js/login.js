function login(){
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
    let title = document.getElementById("title").textContent;
    if(title === "VISIT US") {
        document.getElementById("title").textContent = "JOIN US";
    }
    else {
        document.getElementById("title").textContent = "VISIT US";
    }
};

// function logIn() {
//     window.history.pushState("", "", "/main/");
//     window.location.reload();
// }