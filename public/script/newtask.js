const form = document.getElementById("form");
const div = document.getElementById("divback");
const userDataString = sessionStorage.getItem("userData");
<<<<<<< HEAD
const userData = userDataString ? JSON.parse(userDataString) : null;
const users = userData ? userData.name : null;
=======
const userData = userDataString ? JSON.parse(userDataString): null
const users = userData ? userData.name : null
>>>>>>> 28e5cce492d21075ed9186f3759732baf9a9b8bc
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
<<<<<<< HEAD
=======
  localStorage.getItem("datatask");
  localStorage.setItem("datatask", JSON.stringify(datatask));
>>>>>>> 28e5cce492d21075ed9186f3759732baf9a9b8bc
  console.log("Do localStorage:", JSON.parse(localStorage.getItem("datatask")));
  try {
    const response = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datatask),
    });
<<<<<<< HEAD
    console.log(response);
    document.getElementById("alert").innerHTML = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>sucess</strong> in add task
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
=======

document.getElementById("alert").innerHTML = `
  <div class="alert alert-warning alert-dismissible fade show" role="alert">
    <strong>sucess</strong> in add task
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;

>>>>>>> 28e5cce492d21075ed9186f3759732baf9a9b8bc
  } catch (err) {
    console.log(err, "erro");
    document.getElementById("alert").innerHTML = `
  <div class="alert alert-warning alert-dismissible fade show" role="alert">
    <strong>failure</strong> in add task
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
<<<<<<< HEAD
=======

>>>>>>> 28e5cce492d21075ed9186f3759732baf9a9b8bc
  }
});
function back() {
  div.innerHTML = `
<<<<<<< HEAD
          <button class="btn btn-outline-primary" type="button">
=======
          <button class="btn btn-primary" type="button">
>>>>>>> 28e5cce492d21075ed9186f3759732baf9a9b8bc
            <a href="/template/index.html">voltar</a>
          </button>`;
}
back();
