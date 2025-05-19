// Armazenamento local das tarefas
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Elementos do DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    updateTaskCount();
});

// Adicionar nova tarefa
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') return;
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date()
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateTaskCount();
    
    taskInput.value = '';
    taskInput.focus();
    
    // Animação de feedback
    addTaskBtn.classList.add('success-animation');
    setTimeout(() => {
        addTaskBtn.classList.remove('success-animation');
    }, 500);
}

// Renderizar tarefas com base no filtro atual
function renderTasks() {
    taskList.innerHTML = '';
    
    const filteredTasks = filterTasks(tasks, currentFilter);
    
    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-tasks';
        emptyMessage.textContent = 'Nenhuma tarefa encontrada';
        taskList.appendChild(emptyMessage);
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.setAttribute('data-id', task.id);
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskStatus(task.id));
        
        const taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-delete';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteBtn);
        
        taskList.appendChild(taskItem);
    });
}

// Filtrar tarefas com base no filtro selecionado
function filterTasks(tasks, filter) {
    switch (filter) {
        case 'active':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return [...tasks];
    }
}

// Alternar status da tarefa (concluída/pendente)
function toggleTaskStatus(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    saveTasks();
    renderTasks();
    updateTaskCount();
}

// Excluir tarefa
function deleteTask(id) {
    const taskElement = document.querySelector(`.task-item[data-id="${id}"]`);
    
    // Animação de remoção
    taskElement.style.opacity = '0';
    taskElement.style.transform = 'translateX(30px)';
    
    setTimeout(() => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }, 300);
}

// Limpar tarefas concluídas
clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
    updateTaskCount();
});

// Atualizar contagem de tarefas pendentes
function updateTaskCount() {
    const remainingTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = remainingTasks;
}

// Salvar tarefas no localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Configurar filtros
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        currentFilter = filter;
        
        // Atualizar classe ativa
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        renderTasks();
    });
});
