function getNewTitles(){
    // let links = document.getElementsByTagName("ARTICLE")[0];
    let links = document.querySelectorAll('article h3');

    let titlesText = []
    links.forEach(link => {
        titleText = link.textContent;
        titlesText.push(titleText);
    })

    // assemble an object with titles as keys?

    return links;
}

function getOldTitles(){
    let links = document.querySelectorAll('a.title');
    return links;
}

function addStyling(dataObj){

    predictionStyle ="";
    if (details.prediction){
        predictionStyle += "<div style='color:orange';>Controversial topic.</div>"
    }

    // document.getElementsByClassName('jobsearch-JobInfoHeader-title')[0].innerHTML += predictionDetails;
}


function fetchResource(input, init) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({input, init}, messageResponse => {
            const [response, error] = messageResponse;
            if (response === null) {
                reject(error);
            } else {
                const body = response.body ? new Blob([response.body]) : undefined;
                resolve(new Response(body, {
                    status: response.status,
                    statusText: response.statusText,
                }));
            }
        });
    });
}

if (location.href.includes("old.reddit.com/r/news/")){
    let data = getOldTitles();  // list of links

    let titlesText = []
    data.forEach(link => {
        titleText = link.textContent;
        titlesText.push(titleText);
    })

    fetchResource('http://127.0.0.1:8000/bulk-predict',{
        method: 'post',
        body: JSON.stringify(titlesText),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then((res) => res.json())
    .then(function(res){
        console.log(res)
        // for each object
        data.forEach(titleObj=>{
            if (res[titleObj.textContent]=="True"){
                titleObj.classList.add('divisive');
            }
        })
    })
    
}

if (location.href.includes("reddit.com/r/news/") && !location.href.includes("old")){
    // TODO: direct user to old.reddit.com/r/news
    // let data = getTitles();  // list of links


}