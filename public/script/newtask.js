const form = document.getElementById("form");
const div = document.getElementById("divback");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  const now = new Date();
  const date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

  const datatask = {
    title,
    description,
    date,
    done: 0,
  };

  try {
    const response = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(datatask),
    });

    if (response.ok) {
      document.getElementById("alert").innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Sucesso!</strong> Tarefa adicionada.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    } else {
      throw new Error("Erro ao criar task");
    }
  } catch (err) {
    console.log(err, "erro");
    document.getElementById("alert").innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Falha!</strong> Não foi possível adicionar a tarefa.
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
