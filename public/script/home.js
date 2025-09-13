const datatask = localStorage.getItem("datatask");
async function getTacks() {
  try {
    const DoneTrue = await fetch("http://localhost:3001/tacks/?done=true");
    const Donefalse = await fetch("http://localhost:3001/tacks/?done=false");
    const dataDoneTrue = await DoneTrue.json();
    const dataDonefalse = await Donefalse.json();
    const table = document.getElementById("tabletask");
    const htmlTrue = dataDoneTrue
      .map(
        (t) => `
          <tr class="donetrue">
            <td>${t.title}</td>
            <td>${t.description}</td>
            <td>${t.user}</td>
            <td>${t.date}</td>
            <td>
              <button class="donetruebtn"onclick="taskdone('${t.id}',${t.done})" id="${t.id}">
                <img
                  class="icon"
                  src="/css/assest/verificar.svg"
                  alt=""
                /></button
              ><button class="donetruebtn" onclick="editask('${t.id}')">
                <img
                  class="icon"
                  src="/css/assest/lapis.svg"
                  alt=""
                /></button
              ><button class="donetruebtn" onclick="deletetask('${t.id}')">
                <img class="icon" src="/css/assest/lixo.svg" alt="" />
              </button>
            </td>
          </tr>`
      )
      .join("");
    const htmlfalse = dataDonefalse
      .map(
        (t) => `
            <tr class="">
            <td>${t.title}</td>
            <td>${t.description}</td>
            <td>${t.user}</td>
            <td>${t.date}</td>
            <td>
              <button onclick="taskdone('${t.id}',${t.done})" id="${t.id}">
                <img
                  class="icon"
                  src="/css/assest/verificar.svg"
                  alt=""
                /></button
              ><button onclick="editask('${t.id}')">
                <img
                  class="icon"
                  src="/css/assest/lapis.svg"
                  alt=""
                /></button
              ><button onclick="deletetask('${t.id}')">
                <img class="icon" src="/css/assest/lixo.svg" alt="" />
              </button>
            </td>
          </tr>`
      )
      .join("");
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
  const newtitle = prompt("Enter new title");
  const newdescription = prompt("Enter new description");

  if (!newtitle && !newdescription) return;

  body = {};
  if (newtitle) body.title = newtitle;
  if (newdescription) body.description = newdescription;

  try {
    const editresponse = await fetch(`http://localhost:3001/tacks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.log(err, "erro");
  }
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
    } catch (err) {
      console.log(err, "erro");
    }
  }
}
getTacks();
