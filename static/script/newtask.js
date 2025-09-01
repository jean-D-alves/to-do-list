// pegar inputs
// salvar input com localstore

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const user = "jean";
  const day = new Date().getDay();
  const month = new Date().getHours();
  +1;
  const year = new Date().getFullYear();

  const datatask = {
    title: `${title}`,
    description: `${description}`,
    user: `${user}`,
    date: `${day}/${month}/${year}`,
  };
  localStorage.setItem("datatask", JSON.stringify(datatask));
  alert("funcionou");
  console.log("Do localStorage:", JSON.parse(localStorage.getItem("datatask")));
});
