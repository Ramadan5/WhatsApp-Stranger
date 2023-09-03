const input = document.querySelector ("input");
const phoneBtn = document.getElementById ("phone");

const props = ["tel"];

const opts = {multiple: true};

const supported = ("contacts" in navigator && "ContactsManager" in window);

async function getNumber () {
    if (supported) {
        const contacts = await navigator.contacts.select (props, opts);
    }
}

phoneBtn.addEventListener ("click", () => {
    getNumber ()
    input.value = contacts; 
});



input.addEventListener ("input", (e) => {
    e.preventDefault();

    if (input.value[0] != 0) {
        input.value = "0" + input.value;
    }

    if (input.value == 0) {
        input.value = "";
    }

    document.querySelector ("a").setAttribute ("href", "https://wa.me/+2" + input.value.replace (/ /g, ""));
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register ('./service-worker.js', {scope: './'});
}