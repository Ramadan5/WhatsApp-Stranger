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
    navigator.serviceWorker.register ('service-worker.js');
}