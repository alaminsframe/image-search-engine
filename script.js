let input = document.querySelector('#search-input')
let btn = document.querySelector('#input-btn')
let images = document.querySelector('.images');
let more_btn = document.querySelector('.more-btn button');
let page = 0;

async function getResponse() {
    let pageNumber = page ? page : Math.floor(Math.random() * 10) + 1;
    let queryTerm = input.value ? input.value : 'random';
    let url = `/.netlify/functions/getImages?page=${pageNumber}&query=${queryTerm}`;
    console.log('Fetching from: ',url);

    let results = await fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json(); // parses JSON response
    })
    .then(data => {
        //console.log(data); // do something with the data
        return data
    }).then( data =>{
        return data.results
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
    // console.log(results);
    // console.log(url);
    
    if (page == 1) {
        images.innerHTML = '';
    }
    
    results.map( (result)=>{
        let li = document.createElement('li');
        li.classList.add('image');
        let html = `<img src="${result.urls.regular}" alt="${result.alt_description}">
                    <div class="details">
                        <div class="user">
                            <span>
                                <img src="assets/camera.svg" alt="">
                            </span>
                            <span>${result.user.username}</span>
                        </div>
                        <div class="download-btn">
                            <div class="show-btn">
                                <span>
                                    <img src="assets/down-btn.svg" alt="">
                                </span>
                                <span>Download</span>
                            </div>
                            <div class="download-options">
                                <div class="default-option">
                                    <button onclick = downloadIMG('${result.urls.raw}') id="original"> Original</button>
                                    <button onclick = downloadIMG('${result.urls.full}') id="full"> Fulll</button>
                                    <button onclick = downloadIMG('${result.urls.regular}') id="medium"> Medium</button>
                                </div>
                                <div>
                                    <p>Custom:</p>
                                    <div class="custom-option">
                                        <input type="number" class="custom-width" placeholder="Width" />
                                        <input type="number" class="custom-height" placeholder="Height" />
                                        <button onclick = downloadCustomImage(this,'${result.urls.full}') id="custom" >
                                            <img src="assets/down-btn.svg" alt="">
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
        li.innerHTML = html;
        document.querySelector('.images').appendChild(li);
    } )
    if (results.length == 0) {
        more_btn.innerHTML= "Nothing found"
    }else{
        more_btn.innerHTML= "View More"
    }
    
}

function downloadIMG(imgUrl) {
    // console.log(imgUrl);
    fetch(imgUrl)
        .then(res => res.blob())
        .then((file) => {
            //console.log(file);
            let link = document.createElement('a');
            link.href = URL.createObjectURL(file);
            link.download = 'image_' + new Date().getTime(); // assign a name for the downloaded file
            document.body.appendChild(link); // for Firefox compatibility
            link.click();
            document.body.removeChild(link); // clean up
            URL.revokeObjectURL(link.href); // release memory
        })
        .catch(() => alert("Download Failed"));
}

function downloadCustomImage(button, Url) {
    //console.log('custom clicked');
    const container = button.closest('.custom-option')
    
    let width = container.querySelector('.custom-width').value;
    let height = container.querySelector('.custom-height').value;
    let resizedUrl;

    // console.log('width',width);
    // console.log('height',height);
    if ((width && (width < 100 || width > 6000)) || (height && (height < 100 || height > 6000))) {
        alert("Width and height must be between 100 and 6000 pixels.");
        return;
    }


    if(width && height){
        resizedUrl = `${Url}&w=${width}&h=${height}&fit=crop`;
    }else if(width){
        resizedUrl = `${Url}&w=${width}`;
    }else if(height){
        resizedUrl = `${Url}&w=${height}`;
    }
    
    if (resizedUrl) {
        downloadIMG(resizedUrl)
    }
}

getResponse();
input.addEventListener('keyup',(e)=>{
    if (e.key == 'Enter') {
        page = 1;
        getResponse(); 
    }
})
btn.addEventListener('click',()=>{
    page = 1;
    getResponse();
})
more_btn.addEventListener('click', ()=>{
    ++page;
    getResponse();
})