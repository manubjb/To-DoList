const backend = "http://backend:5000";

function getTasks() {
  fetch(`${backend}/tasks`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("taskList");
      list.innerHTML = "";
      data.tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerText = task.title;
        list.appendChild(li);
      });
    });
}

function addTask() {
  const input = document.getElementById("taskInput");
  const title = input.value;
  fetch(`${backend}/tasks?title=${encodeURIComponent(title)}`, { method: "POST" })
    .then(() => {
      input.value = "";
      getTasks();
    });
}

function getVisits() {
  fetch(`${backend}/visits`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("visitas").innerText = data.visits;
    });
}

getTasks();
getVisits();
