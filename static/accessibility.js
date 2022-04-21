// When accesibility button is clicked

function change() {
    var theme = document.getElementById("theme");
    if (theme.getAttribute('href') == "../static/style.css") {
        theme.setAttribute('href', "../static/style2.css");
    } else {
        theme.setAttribute('href', "../static/style.css");
    }
    localStorage.setItem("theme", theme.getAttribute('href'));
}
function setDefaultTheme(){
    var defaultTheme = localStorage.getItem("theme");
    if(!defaultTheme){
        localStorage.setItem("theme", "../static/style.css");
    }
    
}
function chooseTheme(){
    setDefaultTheme();
    document.getElementById("theme").setAttribute('href', localStorage.getItem("theme"));
}