const datatask = localStorage.getItem("datatask");
const params = new URLSearchParams(window.location.search);
const users = params.get("user");
async function getTacks() {
  try {
    const DoneTrue = await fetch(
      `http://localhost:3001/tacks?user=${users}&done=true`
    );
    const Donefalse = await fetch(
      `http://localhost:3001/tacks?user=${users}&done=false`
    );
    const dataDoneTrue = await DoneTrue.json();
    const dataDonefalse = await Donefalse.json();
    const table = document.getElementById("tabletask");
    function RenderRow(t, isdone) {
      return ` 
      <tr class="${isdone ? "donetrue" : ""}">
             <td>${t.title}</td>
             <td>${t.description}</td>
             <td>${t.user}</td>
             <td>${t.date}</td>
             <td>
               <button class="${
                 isdone ? "donetruebtn" : ""
               }"onclick="taskdone('${t.id}',${t.done})" id="${t.id}">
                 <img
                   class="icon"
                   src="/css/assest/verificar.svg"
                   alt=""
                 /></button
               ><button class="${
                 isdone ? "donetruebtn" : ""
               }" onclick="editask('${t.id}')">
                 <img
                   class="icon"
                   src="/css/assest/lapis.svg"
                   alt=""
                 /></button
               ><button class="${
                 isdone ? "donetruebtn" : ""
               }" onclick="deletetask('${t.id}')">
                <img class="icon" src="/css/assest/lixo.svg" alt="" />
               </button>
             </td>
           </tr>
      `;
    }
    const htmlTrue = dataDoneTrue.map((t) => RenderRow(t, true)).join("");
    const htmlfalse = dataDonefalse.map((t) => RenderRow(t, false)).join("");

    table.innerHTML = htmlfalse + htmlTrue;
  } catch (err) {
    console.log(err, "erro");
  }
}
async function deletetask(id) {
  try {
    const response = await fetch(`http://localhost:3001/tacks/${id}`, {
      method: "DELETE",
    });
    getTacks();
  } catch (err) {
    console.log(err, "erro");
  }
}
async function editask(id) {
  const res = await fetch(`http://localhost:3001/tacks/${id}`);
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
    try {
      const editresponse = await fetch(`http://localhost:3001/tacks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });
      document.getElementById("ModalContainer").innerHTML = "";
      await getTacks();
    } catch (err) {
      console.log(err, "erro");
    }
  };
}
async function taskdone(id, done) {
  if (done === false) {
    try {
      const responsedone = await fetch(`http://localhost:3001/tacks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ done: true }),
      });
      getTacks();
    } catch (err) {
      console.log(err, "erro");
    }
  } else {
    try {
      const responsedone = await fetch(`http://localhost:3001/tacks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ done: false }),
      });
      getTacks();
    } catch (err) {
      console.log(err, "erro");
    }
  }
}
function addBtnGrups() {
  const div = document.getElementById("btnGroupheader");
  div.innerHTML = `
        <div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-primary dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            user
          </button>
          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" href="index.html?user=jean">jean</a>
            </li>
            <li>
              <a class="dropdown-item" href="index.html?user=antonio"
                >antonio</a
              >
            </li>
          </ul>
        </div>
        <button class="btn btn-primary">
          <a class="dropdown-item" href="newtask.html?user=${users}">new task</a>
        </button>`;
}
addBtnGrups();
getTacks();
