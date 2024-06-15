// import data from "./countries.json" assert {type: 'json'};

const selectedCountry = document.getElementById ("selectedCountry");
const countryPrefix = document.getElementById ("countryPrefix");
const input = document.getElementById ("number");
const chatBtn = document.getElementById ("chat");

const countries = [];
const countryDialCodes = [];

fetch ("./countries.json").then ((res) => res.json()).then ((data) => {
    for (let i = 0; i < data.length; i++) {
        countries[i] = data[i].name;
        let country = document.createElement ("option");
        country.innerText = countries[i];
        if (country.innerText == "Egypt") {
            country.setAttribute ("selected", "");
        }
        selectedCountry.append (country);
    }
    
    selectedCountry.addEventListener ("change", () => {
        for (let i = 0; i < data.length; i++) {
            countries[i] = data[i].name;
            countryDialCodes[i] = data[i].dial_code;
    
            if (selectedCountry.options[selectedCountry.selectedIndex].text == countries[i]) {
                countryPrefix.value = countryDialCodes[i];
            }
        }
        chatBtn.setAttribute ("href", "https://wa.me/" + countryPrefix.value + input.value.replace (/ /g, ""));
    });
})

// for (let i = 0; i < data.length; i++) {
//     countries[i] = data[i].name;
//     let country = document.createElement ("option");
//     country.innerText = countries[i];
//     if (country.innerText == "Egypt") {
//         country.setAttribute ("selected", "");
//     }
//     selectedCountry.append (country);
// }

// selectedCountry.addEventListener ("change", () => {
//     for (let i = 0; i < data.length; i++) {
//         countries[i] = data[i].name;
//         countryDialCodes[i] = data[i].dial_code;

//         if (selectedCountry.options[selectedCountry.selectedIndex].text == countries[i]) {
//             countryPrefix.value = countryDialCodes[i];
//         }
//     }
//     chatBtn.setAttribute ("href", "https://wa.me/" + countryPrefix.value + input.value.replace (/ /g, ""));
// });

input.addEventListener ("input", (e) => {
    e.preventDefault();

    if (input.value[0] == 0) {
        input.value = input.value - input.value[0];
    }

    chatBtn.setAttribute ("href", "https://wa.me/" + countryPrefix.value + input.value.replace (/ /g, ""));
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register ('./service-worker.js', {scope: './'});
}



// const contactsBtn = document.getElementById ("contacts");

// const retreivableData = ['name', 'email', 'tel', 'address', 'icon'];
// const multipleSelection = {multiple: true};

// const supported = ("contacts" in navigator && "ContactsManager" in window);

// async function getContacts() {
//     if (supported) {
//         const contacts = await navigator.contacts.select (retreivableData, multipleSelection);
//     }
// };

// contactsBtn.addEventListener ("click", getContacts);