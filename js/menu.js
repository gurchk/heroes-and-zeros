window.onload = function () {

    document.getElementById("openMenu").addEventListener("click", function(){
        this.style.zIndex = "-1";
        this.style.display = "none";
        document.getElementById("closeMenu").style.zIndex = "1";
        document.getElementById("closeMenu").style.display = "inline";
        document.getElementById("menu").style.transform = "translateX(0)";
    });
    
    document.getElementById("closeMenu").addEventListener("click", function(){
        this.style.zIndex = "-1";
        this.style.display = "none";
        document.getElementById("openMenu").style.zIndex = "1";
        document.getElementById("openMenu").style.display = "inline";
        document.getElementById("menu").style.transform = "translateX(100%)";
    });
    
    
}