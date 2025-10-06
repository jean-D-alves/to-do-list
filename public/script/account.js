window.addEventListener("DOMContentLoaded", async () => {
  await addUserData();
  await dashboard();
});

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
  console.log("deu bom");
  if (data) {
    div.innerHTML = `
    <p>name: ${data.name}</br>email: ${data.email}</p>`;
  }
}

async function dashboard() {
  const response = await fetch("http://localhost:5000/dashboard", {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  console.log(data);

  const done = data.totalDonetrue?.total;
  const notDone = data.totalDonefalse?.total;

  const ctx = document.getElementById("statusChart").getContext("2d");

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["concluidas", "não concluidas"],
      datasets: [
        {
          data: [done, notDone],
          backgroundColor: ["#36A2EB", "#d3254bff"],
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        title: { display: true, text: "Status das Tasks" },
      },
    },
  });
}
