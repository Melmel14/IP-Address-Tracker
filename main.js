// Get the HTML elements
const myForm = document.querySelector('form')
const myIpAddr = document.querySelector('.ip-addr h2')
const myLocation = document.querySelector('.location h2')
const myTimezone = document.querySelector('.timezone h2')
const myIsp = document.querySelector('.isp h2')

// Map creation
const myMap = L.map('myMap', {
    zoomControl: false,
})

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: `Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>. Coded by <a href="https://github.com/Melmel14">Melody Hall</a>.`,
}).addTo(myMap)

const myIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [40, 50],
    iconAnchor: [20, 25],
})

let myMarker

const mapDisplay = (lat, lng) => {
    myMap.setView([lat, lng], 16)

    // We first check if there is no marker drawn on the map.
    // If there is, we remove it
    if (myMarker != null) myMarker.remove()

    myMarker = L.marker([lat, lng], { icon: myIcon })

    myMarker.addTo(myMap)
}

// Get the info the page needs
const getData = (inputValue = '', searchType = 'IP') => {
    const url =
        searchType === 'IP' ?
        `https://geo.ipify.org/api/v2/country,city?apiKey=at_ATc855WuAkaidg5PBhbfNNnH62R36&ipAddress=${inputValue}` :
        `https://geo.ipify.org/service/account-balance?apiKey=at_ATc855WuAkaidg5PBhbfNNnH62R36=${inputValue}`

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            myIpAddr.innerText = data.ip
            myLocation.innerText = `${data.location.region}, ${data.location.city}`
            myTimezone.innerText = `UTC ${data.location.timezone}`
            myIsp.innerText = data.isp
            mapDisplay(data.location.lat, data.location.lng)
        })
        .catch((error) => {
            myIpAddr.innerText = '__'
            myLocation.innerText = '__'
            myTimezone.innerText = '__'
            myIsp.innerText = '__'

            const myInput = myForm.searchInput
            myInput.classList.add('error')

            setTimeout(() => myInput.classList.remove('error'), 3000)
            console.error(error)
        })
}

// Search for any IP addresses or domains and see the key information and location
// The regex for a valid IP address is inspired by this post
// https://www.regular-expressions.info/numericranges.html

const regexIp = /^\b([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b(\.\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b){3}$/
const regexDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/

myForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const myInput = myForm.searchInput

    if (myInput.value.match(regexIp)) {
        getData(myInput.value)
    }

    if (myInput.value.match(regexDomain)) {
        getData(myInput.value, (searchType = 'DOMAIN'))
    }

    if (!myInput.value.match(regexDomain) && !myInput.value.match(regexIp)) {
        myInput.classList.add('error')

        setTimeout(() => myInput.classList.remove('error'), 3000)
    }
})

// Load IP Address on the map on the initial page load
getData()