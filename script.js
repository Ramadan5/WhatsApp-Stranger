const input = document.querySelector ("input");

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