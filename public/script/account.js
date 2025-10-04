async function getUserData() {
  try {
    const response = await fetch("http://localhost:5000/userData", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function addUserData() {
  const data = await getUserData();
  const div = document.getElementById("data");
  console.log("deu bom")
  if (data) {
    div.innerHTML = `
    <p>name: ${data.name}</br>email: ${data.email}</p>`
  }
}
addUserData();
