
let activedWeb = null;

chrome.runtime.sendMessage({ message: 'getActivated' }, function(response) {
    console.log("is actived", response)
    if(response.status){
        activedWeb = response.data
        document.getElementById("content").style.display = 'block'
        document.getElementById("btn-popup").innerText = `Open ${response.data.name}`
        new QRCode(document.getElementById("qrcode"), response.data.url);  
    }else{
        document.getElementById("content").style.display = 'none'
    }
})

document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('btn-popup');
    btn.addEventListener('click', function() {
        console.log("open url", activedWeb)
        window.open(activedWeb.url, activedWeb.name, "width=500,height=500");
    });
});