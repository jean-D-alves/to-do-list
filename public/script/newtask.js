const form = document.getElementById("form");
const div = document.getElementById("divback");
const userDataString = sessionStorage.getItem("userData");
const userData = userDataString ? JSON.parse(userDataString) : null;
const users = userData ? userData.name : null;
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
  console.log("Do localStorage:", JSON.parse(localStorage.getItem("datatask")));
  try {
    const response = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datatask),
    });
    console.log(response);
    document.getElementById("alert").innerHTML = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>sucess</strong> in add task
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  } catch (err) {
    console.log(err, "erro");
    document.getElementById("alert").innerHTML = `
  <div class="alert alert-warning alert-dismissible fade show" role="alert">
    <strong>failure</strong> in add task
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
  }
});
function back() {
  div.innerHTML = `
          <button class="btn btn-outline-primary" type="button">
            <a href="/template/index.html">voltar</a>
          </button>`;
}
back();
