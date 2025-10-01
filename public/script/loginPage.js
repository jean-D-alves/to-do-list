const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const user = {
      email: email,
      password: password,
    };
    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
<<<<<<< HEAD
    if (response.ok) {
=======
    if (response) {
>>>>>>> 28e5cce492d21075ed9186f3759732baf9a9b8bc
      const userData = await response.json();
      sessionStorage.setItem("userData", JSON.stringify(userData));
      window.location.href = "http://localhost:3000/template/index.html";
    }
  } catch (erro) {
    console.log("erro", erro);
  }
});
