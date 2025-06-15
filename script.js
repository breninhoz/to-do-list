const input = document.getElementById("taskInput");
const btn = document.getElementById("addBtn");
const list = document.getElementById("taskList");

function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (saved) {
        const tasks = JSON.parse(saved);
        tasks.forEach((task) => {
            addTask(task.text, task.done);
        })
    }
}

loadTasks();

btn.addEventListener("click", function () {
    const taskText = input.value.trim();
    if (taskText !== "") {
        addTask(taskText);
        input.value = "";
        input.focus();
    }
});

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("taskList li span").forEach((span) => {
        tasks.push({
            text: span.textContent,
            done: span.parentElement.classList.contains("done"),
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(text, done = false) {
    const li = document.createElement("li");
    li.classList.add("task");
    if (done) li.classList.add("done");

    const span = document.createElement("span");
    span.textContent = text;

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "🗑️";

    // Marcar como feito
    span.addEventListener("click", () => {
        li.classList.toggle("done");
        saveTasks();
    });

    // Remover tarefa
    removeBtn.addEventListener("click", () => {
        li.remove();
        saveTasks();
    });

    // Editar tarefa (duplo clique no texto OU botão ✏️)
    function startEdit() {
        const input = document.createElement("input");
        input.type = "text";
        input.value = span.textContent;
        li.replaceChild(input, span);
        input.focus();

        // Salvar quandoi pressionar Enter ou perder o foco
        input.addEventListener("blur", finishEdit);
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") finishEdit();
        });
        
        function finishEdit() {
            const newText = input.value.trim();
            if (newText !== "") {
                span.textContent = newText;
                li.replaceChild(span, input);
                saveTasks();
            } else {
                li.remove(); // Remove se apagar tudo
                saveTasks();
            }
        }
    }

    span.addEventListener("dblclick", startEdit);
    editBtn.addEventListener("click", startEdit);

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(removeBtn);
    list.appendChild(li);
    
    saveTasks();
}