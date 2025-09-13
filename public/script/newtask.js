// pegar inputs
// salvar input com localstore

const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const user = "jean";
  const day = new Date().getDay();
  const month = new Date().getHours();
  const year = new Date().getFullYear();

  const datatask = {
    title: `${title}`,
    description: `${description}`,
    user: `${user}`,
    date: `${day}/${month}/${year}`,
    done: false
  };
  localStorage.getItem("datatask")
  localStorage.setItem("datatask", JSON.stringify(datatask));
  console.log("Do localStorage:", JSON.parse(localStorage.getItem("datatask")));
  try {
    const response = await fetch("http://localhost:3001/tacks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datatask),
    });
    alert("item salvo");
  } catch (err) {
    console.log(err, "erro");
  }
});
