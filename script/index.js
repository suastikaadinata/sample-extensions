let web = [];
let activatedTabData = []
let isActivated = false;
let selectedWeb = null;

async function getData() {
    const url = "https://sample-extensions-service.vercel.app/partner";
    try {
      const response = await fetch(url);
      response.json().then((data) => {
        console.log("partner", data.partner)
        web = data.partner
      })
    } catch (error) {
      console.error(error.message);
    }
}

getData()

const setActivation = (status, data) => {
    isActivated = status
    if(status){
        chrome.action.setIcon({ path: "../on.png" });
        selectedWeb = data
    }else{
        chrome.action.setIcon({ path: "../off.png" });
    }
}
 
chrome.tabs.onActivated.addListener(function(tab) {
    const isFind = activatedTabData.find((data) => data.tabId === tab.tabId)
    if(isFind) {
        console.log("actived tab", tab)
        setActivation(true, isFind)
    }else{
        setActivation(false, null)
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log("update tab", tab)
    if(web.length > 0){
        web.forEach((w) => {
            if(tab.url.startsWith(w.url)) {
                console.log("web page is opened");
                if(activatedTabData.length > 0){
                    const isFind = activatedTabData.find((data) => data.tabId === tabId)
                    if(!isFind){
                        console.log("web add push isfind 1")
                        activatedTabData.push({ tabId: tab.id, web: w })
                        setActivation(true, w)
                    }
                }else{
                    console.log("web add push isfind 2")
                    activatedTabData.push({ tabId: tab.id, web: w })
                    setActivation(true, w)
                }
            }
        })
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.message === 'getActivated') {
        sendResponse({ status: isActivated, data: selectedWeb })
    }
    return true
})