const socket = io("http://localhost:3000");

const messages = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("name");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on("chat message", function (msg) {
  const item = document.createElement("li");
  let logo = document.createElement("img");
  logo.src = "./img/access_informatica_srl_logo.jpeg";
  logo.width = 50;
  logo.height = 50;
  item.appendChild(logo);
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
