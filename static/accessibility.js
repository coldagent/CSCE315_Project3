// When accesibility button is clicked

function change() {
    var theme = document.getElementsByTagName('link')[0];
    if (theme.getAttribute('href') == 'style.css') {
        theme.setAttribute('href', 'style2.css');
    } else {
        theme.setAttribute('href', 'style.css');
    }
    localStorage.setItem("theme", theme.getAttribute('href'));
}
function setDefaultTheme(){
    var defaultTheme = localStorage.getItem("theme");
    if(!defaultTheme){
        localStorage.setItem("theme", "style.css");
    }
}
function chooseTheme(){
    setDefaultTheme();
    document.getElementsByTagName('link')[0].setAttribute('href', localStorage.getItem("theme"));
}