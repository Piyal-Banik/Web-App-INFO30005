function showImage(imageId) {
    document.getElementById(imageId).style.display = 'block';
}
function hideImage(imageId) {
    document.getElementById(imageId).style.visibility = 'hidden';
}
function feed(){
    play();

}


function feedHamburger(){

    play();
}


function play(){
    var audio = document.getElementById("audio");
    audio.play();
}
