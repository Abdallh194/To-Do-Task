const Input_Feild = document.querySelector(".form-control");
const Add_Btn = document.querySelector(".btn");

const Tasks_Container = document.querySelector(".Tasks");

//select alerts
const Alert_Update = document.querySelector(".alert-success");
const Alert_Delete = document.querySelector(".alert-danger");
const Alert_Complete = document.querySelector(".alert-warning");
const Alert_AddTask = document.querySelector(".alert-dark");

// add display none style to alert
Alert_Update.classList.add("d-none");
Alert_Delete.classList.add("d-none");
Alert_Complete.classList.add("d-none");
Alert_AddTask.classList.add("d-none");

// tasks container
let TasksArray = [];

// Load tasks from localStorage if available
if (localStorage.getItem("task")) {
  TasksArray = JSON.parse(localStorage.getItem("task"));
}

// handle click on buttons
Tasks_Container.addEventListener("click", (e) => {
  if (e.target.classList.contains("dlt")) {
    // remove task from localStorage
    if (confirm("Are you sure you want to delete this task?")) {
      HandleDeleteTask(
        e.target.parentElement.parentElement.getAttribute("task-id")
      );

      // remove alert complete and update alert
      Alert_Complete.classList.add("d-none");
      Alert_Update.classList.add("d-none");
      Alert_AddTask.classList.add("d-none");
      Alert_Delete.classList.remove("d-none");
      Alert_Delete.classList.add("fade-totop");

      // remove task from root
      e.target.parentElement.parentElement.remove();
    }
  }
  // handle click in completed button
  if (e.target.classList.contains("is-completed-btn")) {
    // toggle completed status in localStorage
    HandleTaskStatus(
      e.target.parentElement.parentElement.getAttribute("task-id")
    );
    // toggle completed status in root page
    e.target.parentElement.parentElement.classList.add("completed-Task");
  }
});

//Render Tasks To View All Tasks
RerenderTasks = (arr) => {
  Tasks_Container.innerHTML = "";
  arr = arr.forEach((data_task) => {
    // generate task div
    const taskDiv = document.createElement("div");
    taskDiv.className =
      "task d-flex justify-content-between align-items-center";
    if (data_task.is_completed) {
      taskDiv.className =
        "task d-flex justify-content-between align-items-center completed-Task";
    }
    //task title
    const task_input = document.createElement("input");
    task_input.classList.add("text");
    task_input.type = "text";
    task_input.value = data_task.task;
    task_input.setAttribute("readonly", "readonly");

    // add title
    taskDiv.setAttribute("task-id", data_task.id);
    taskDiv.appendChild(task_input);

    // generate btn to delete task
    const dltBtn = document.createElement("span");
    dltBtn.className = "dlt";
    dltBtn.appendChild(document.createTextNode("Delete"));

    // generate btn to update task
    const Update_Task_Btn = document.createElement("span");
    Update_Task_Btn.classList = "Update_Task_Btn";
    Update_Task_Btn.appendChild(document.createTextNode("Edit"));

    // generate btn to complete task
    const is_completed_task = document.createElement("span");
    is_completed_task.classList = "is-completed-btn";
    is_completed_task.appendChild(document.createTextNode("Completed"));

    // task options container ( update button  + delete button + complete button )
    const option_container = document.createElement("div");
    option_container.classList = "option_container";

    // add buttons in options container
    option_container.appendChild(Update_Task_Btn);
    option_container.appendChild(is_completed_task);
    option_container.appendChild(dltBtn);
    taskDiv.appendChild(option_container);

    // Add Task to tasks
    Tasks_Container.appendChild(taskDiv);

    // update task
    Update_Task_Btn.addEventListener("click", () => {
      if (Update_Task_Btn.innerText == "Edit") {
        task_input.removeAttribute("readonly");
        task_input.focus();
        Update_Task_Btn.innerText = "Save";
        task_input.style.textDecoration = "none";
      } else {
        task_input.setAttribute("readonly", "readonly");
        Update_Task_Btn.innerText = "Edit";

        //remove update and complete alert
        Alert_Complete.classList.add("d-none");
        Alert_Delete.classList.add("d-none");
        Alert_AddTask.classList.add("d-none");
        Alert_Update.classList.remove("d-none");
        Alert_Update.classList.add("fade-totop");
      }
    });

    // Show a line in the sentence to complete the task.
    is_completed_task.addEventListener("click", () => {
      task_input.style.textDecoration = "line-through";
      task_input.setAttribute("readonly", "readonly");

      Alert_Update.classList.add("d-none");
      Alert_Delete.classList.add("d-none");
      Alert_AddTask.classList.add("d-none");
      Alert_Complete.classList.remove("d-none");
      Alert_Complete.classList.add("fade-totop");
    });
  });
};

//get tasks list from local storage
function GetTasksFromLocalStorage() {
  let Tasks_Data = window.localStorage.getItem("task");
  if (Tasks_Data) {
    try {
      let tasks = JSON.parse(Tasks_Data);
      RerenderTasks(tasks);
    } catch (error) {
      console.error("Error parsing local storage:", error);
      // Handle the error, perhaps by initializing TasksArray as empty
    }
  }
}

// run fun GetTasksFromLocalStorage to get task from local storage;
GetTasksFromLocalStorage();

//Handle Add new Task
AddNewTask = (task) => {
  const task_data = {
    id: Date.now(),
    task,
    is_completed: false,
  };
  TasksArray.push(task_data);
  RerenderTasks(TasksArray);
  //remove update , complete alert and  delete alert to add task alert
  Alert_Update.classList.add("d-none");
  Alert_Delete.classList.add("d-none");
  Alert_Complete.classList.add("d-none");
  Alert_AddTask.classList.remove("d-none");
  Alert_AddTask.classList.add("fade-totop");

  //Add Task to local storage
  AddTaskToLocalStorage(TasksArray);
};

////Handle click add button
Add_Btn.onclick = (e) => {
  // prevent app reload
  e.preventDefault();

  // check input value is not empty
  if (Input_Feild.value !== "") {
    AddNewTask(Input_Feild.value);
    //clear input to add new task
    Input_Feild.value = "";
  }
};

// Add tasks to local storage
function AddTaskToLocalStorage(arr) {
  window.localStorage.setItem("task", JSON.stringify(arr));
}

//  Function to handle delete task functionality - this function has been updated
function HandleDeleteTask(Task_Id) {
  // Remove task from TasksArray using filter
  TasksArray = TasksArray.filter((task) => task.id != Task_Id);
  // Update local storage
  AddTaskToLocalStorage(TasksArray);
}

//update task completed status on local storage
function HandleTaskStatus(Task_Id) {
  for (let i = 0; i < TasksArray.length; i++) {
    if (TasksArray[i].id == Task_Id) {
      TasksArray[i].is_completed == true
        ? (TasksArray[i].is_completed = true)
        : (TasksArray[i].is_completed = true);
    }
  }
  AddTaskToLocalStorage(TasksArray);
}
