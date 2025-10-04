const datatask = localStorage.getItem("datatask");
const userDataString = sessionStorage.getItem("userData");
const userData = userDataString ? JSON.parse(userDataString) : null;

async function getUser() {
  if (!userData) {
    window.location.href = "http://localhost:3000/template/loginPage.html";
  }
}

async function getTasks() {
  getUser();
  try {
    const DoneTrue = await fetch(`http://localhost:5000/tasks?done=1`, {
      credentials: "include",
    });
    const Donefalse = await fetch(`http://localhost:5000/tasks?done=0`, {
      credentials: "include",
    });

    const dataDoneTrue = await DoneTrue.json();
    const dataDonefalse = await Donefalse.json();
    const table = document.getElementById("tabletask");

    function RenderRow(t, isdone) {
      return ` 
      <tr class="${isdone ? "donetrue" : ""}">
             <td>${t.title}</td>
             <td>${t.description}</td>
             <td>${t.date}</td>
             <td>
               <button class="${
                 isdone ? "donetruebtn" : ""
               }" onclick="taskdone('${t.id}',${t.done})">
                 <img class="icon" src="/css/assest/verificar.svg" alt=""/>
               </button>
               <button class="${
                 isdone ? "donetruebtn" : ""
               }" onclick="editask('${t.id}')">
                 <img class="icon" src="/css/assest/lapis.svg" alt=""/>
               </button>
               <button class="${
                 isdone ? "donetruebtn" : ""
               }" onclick="deletetask('${t.id}')">
                 <img class="icon" src="/css/assest/lixo.svg" alt=""/>
               </button>
             </td>
           </tr>
      `;
    }

    const htmlTrue = dataDoneTrue.map((t) => RenderRow(t, 1)).join("");
    const htmlfalse = dataDonefalse.map((t) => RenderRow(t, 0)).join("");

    table.innerHTML = htmlfalse + htmlTrue;
  } catch (err) {
    console.log(err, "erro");
    window.location.href = "http://localhost:3000/template/loginPage.html";
  }
}

async function deletetask(id) {
  try {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    getTasks();
  } catch (err) {
    console.log(err, "erro");
  }
}

async function editask(id) {
  const res = await fetch(`http://localhost:5000/tasks/${id}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Não foi possível buscar a task");
  const task = await res.json();

  document.getElementById("ModalContainer").innerHTML = `
      <div id="modal-overlay" style="position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:9999;">
        <div style="background:#fff; padding:16px; border-radius:8px; width:90%; max-width:400px;">
          <form id="form">
            <h3>Editar tarefa</h3>
            <div class="mb-3">
              <label for="titleInput" class="form-label">Título</label>
              <input type="text" id="titleInput" class="form-control" value="${
                task.title || ""
              }">
            </div>
            <div class="mb-3">
              <label for="descInput" class="form-label">Descrição</label>
              <input type="text" id="descInput" class="form-control" value="${
                task.description || ""
              }">
            </div>
            <div style="display:flex; gap:8px; justify-content:flex-end;">
              <button type="button" id="cancelBtn" class="btn btn-secondary">Cancelar</button>
              <button type="submit" class="btn btn-primary">Salvar</button>
            </div>
          </form>
        </div>
      </div>`;

  document.getElementById("cancelBtn").onclick = () => {
    document.getElementById("ModalContainer").innerHTML = "";
  };

  const form = document.getElementById("form");
  form.onsubmit = async (e) => {
    e.preventDefault();
    const title = document.getElementById("titleInput").value.trim();
    const description = document.getElementById("descInput").value.trim();

    const body = {};
    if (title) body.title = title;
    if (description) body.description = description;

    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      document.getElementById("ModalContainer").innerHTML = "";
      getTasks();
    } catch (err) {
      console.log(err, "erro");
    }
  };
}

async function taskdone(id, done) {
  try {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ done: done ? 0 : 1 }),
    });
    getTasks();
  } catch (err) {
    console.log(err, "erro");
  }
}

function addBtnGrups() {
  const div = document.getElementById("btnGroupheader");
  div.innerHTML = `
        <button class="btn btn-primary">
          <a class="dropdown-item" href="newtask.html">new task</a>
        </button>
        <button class="btn btn-primary">
          <a class="dropdown-item" href="account.html">user data</a>
        </button>`;
}
addBtnGrups();
getTasks();
