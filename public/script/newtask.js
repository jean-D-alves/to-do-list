const form = document.getElementById("form");
const div = document.getElementById("divback");
const params = new URLSearchParams(window.location.search);
const users = params.get("user");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const user = `${users}`;
  const day = new Date().getDay();
  const month = new Date().getHours();
  const year = new Date().getFullYear();
  const datatask = {
    title: `${title}`,
    description: `${description}`,
    user: `${user}`,
    date: `${day}/${month}/${year}`,
    done: 0,
  };
  localStorage.getItem("datatask");
  localStorage.setItem("datatask", JSON.stringify(datatask));
  console.log("Do localStorage:", JSON.parse(localStorage.getItem("datatask")));
  try {
    const response = await fetch("http://localhost:5000/tasks", {
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
function back() {
  div.innerHTML = `
          <button class="btn btn-primary" type="button">
            <a href="/index.html?user=${users}">voltar</a>
          </button>`;
}
back();
