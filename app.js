const form = document.querySelector(".top-banner form")
const input = document.querySelector(".top-banner input")
const msgSpan = document.querySelector(".top-banner .msg")
const coinList = document.querySelector(".ajax-section .container .coins")

localStorage.setItem("apiKey", EncryptStringAES("coinrankingd91e95aa91c498e24dffce67bdecdb859d1398f396b7ef31"))

form.addEventListener("submit", (e) => {
    e.preventDefault()
    getCoinDataFormApi()
    e.target.reset() // input a girilen bilgi submit olunca temizlenmesi için
})

const getCoinDataFormApi = async () => {
    //alert("Get Coin Data!!");
    const apiKey = DecryptStringAES(localStorage.getItem("apiKey"))
    //console.log(apiKey);
    //!!!template literal!!!
    const url = `https://api.coinranking.com/v2/coins?search=${input.value}&limit=1`
    const options = {
        headers: {
            'x-access-token': apiKey,
        },
    }
    try {
    //fetch ve axios
    // const res = await fetch(url, options)
    //     .then((res) => res.json())
    //     .then((result) => console.log(result.data.coins[0]))
        const res = await axios(url, options)
        //obj destr.
        const { name, change, iconUrl, symbol, price } = res.data.data.coins[0]
        // console.log(res.data.data.coins[0])
        //console.log(iconUrl)

        //coin control!
        const coinNameSpans = coinList.querySelectorAll("h2 span")
        //filter vs. map(array)
        if (coinNameSpans.length > 0) {
            const filteredArray = [...coinNameSpans].filter(span => span.innerText == name)
            console.log(filteredArray)
            if (filteredArray.length > 0) {
                msgSpan.innerText = `You already know the data for ${name}, Please search for another coin 😉`
                setTimeout(() => {
                    msgSpan.innerText = ""
                }, 3000)
                return
            }
        }
        const createdLi = document.createElement("li")
        createdLi.classList.add("coin")
        createdLi.innerHTML =
        `
            <h2 class="coin-name" data-name=${name}>
                <span>${name}</span>
                <sup>${symbol}</sup>
            </h2>
            <div class="coin-temp">$${Number(price).toFixed(5)}</div>
            <figure>
                <img class="coin-icon" src=${iconUrl}>                
                <figcaption style='color:${change < 0 ? "red" : "green"}'>
                    <span><i class="fa-solid fa-chart-line"></i></span>
                    <span>${change}%</span>
                </figcaption>
            </figure>
            <span class="remove-icon">
                <i class="fas fa-window-close" style="color:red"></i>
            </span>
        `
        //append vs.. prepend -> inneHTML'de yeni gelen elementin en solda yeni olarak listelenmesi için kullanılır.
        //coinList.append(createdLi)
        coinList.prepend(createdLi)
        // append vs.. appendChild -> append'de innerHtml ve obj direkt verilebilir, appendChild da ise obj. verilebilir.

        // remove function:
        createdLi.querySelector(".remove-icon").addEventListener("click", () => {
            createdLi.remove()
        })

    } catch (error) {
        //error logging
        //postErrorLog("crypto.js", "getCoinDataFromApi", new Date(), error...);
        msgSpan.innerText = `Coin not found!`;
        setTimeout(() => {
            msgSpan.innerText = "";
        }, 3000);
    }






}