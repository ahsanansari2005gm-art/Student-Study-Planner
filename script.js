const courseForm = document.getElementById("courseForm");
const assignmentForm = document.getElementById("assignmentForm");
const courseList = document.getElementById("courseList");
const assignmentList = document.getElementById("assignmentList");
const assignmentCourse = document.getElementById("assignmentCourse");

let courses = JSON.parse(localStorage.getItem("studyPlannerCourses")) || [];
let assignments = JSON.parse(localStorage.getItem("studyPlannerAssignments")) || [];

function saveData() {
  localStorage.setItem("studyPlannerCourses", JSON.stringify(courses));
  localStorage.setItem("studyPlannerAssignments", JSON.stringify(assignments));
}

function renderCourses() {
  courseList.innerHTML = "";
  assignmentCourse.innerHTML = '<option value="">Select course</option>';

  courses.forEach(course => {
    const option = document.createElement("option");
    option.value = course.id;
    option.textContent = `${course.code} - ${course.name}`;
    assignmentCourse.appendChild(option);

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div class="item-info">
        <h3>${course.code}</h3>
        <p>${course.name}</p>
      </div>
      <div class="actions">
        <button class="edit" onclick="editCourse(${course.id})">Edit</button>
        <button class="delete" onclick="deleteCourse(${course.id})">Delete</button>
      </div>
    `;
    courseList.appendChild(div);
  });

  if (!courses.length) courseList.innerHTML = '<p class="empty">No courses added yet.</p>';
}

function renderAssignments() {
  assignmentList.innerHTML = "";

  assignments.forEach(a => {
    const course = courses.find(c => c.id === a.courseId);
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div class="item-info">
        <h3>${a.title}</h3>
        <p>Course: ${course ? `${course.code} - ${course.name}` : "Deleted course"}</p>
        <p>Due: ${a.dueDate}</p>
        <p>Priority: ${a.priority} | Status: ${a.status}</p>
      </div>
      <div class="actions">
        <button class="edit" onclick="editAssignment(${a.id})">Edit</button>
        <button class="delete" onclick="deleteAssignment(${a.id})">Delete</button>
      </div>
    `;
    assignmentList.appendChild(div);
  });

  if (!assignments.length) assignmentList.innerHTML = '<p class="empty">No assignments added yet.</p>';
}

courseForm.addEventListener("submit", e => {
  e.preventDefault();
  courses.push({
    id: Date.now(),
    name: document.getElementById("courseName").value.trim(),
    code: document.getElementById("courseCode").value.trim()
  });
  courseForm.reset();
  saveData();
  renderCourses();
});

assignmentForm.addEventListener("submit", e => {
  e.preventDefault();
  assignments.push({
    id: Date.now(),
    title: document.getElementById("assignmentTitle").value.trim(),
    courseId: Number(assignmentCourse.value),
    dueDate: document.getElementById("assignmentDue").value,
    priority: document.getElementById("assignmentPriority").value,
    status: document.getElementById("assignmentStatus").value
  });
  assignmentForm.reset();
  saveData();
  renderAssignments();
});

function editCourse(id) {
  const course = courses.find(c => c.id === id);
  const name = prompt("Edit course name:", course.name);
  if (name === null) return;
  const code = prompt("Edit course code:", course.code);
  if (code === null) return;
  course.name = name.trim() || course.name;
  course.code = code.trim() || course.code;
  saveData();
  renderCourses();
  renderAssignments();
}

function deleteCourse(id) {
  if (!confirm("Delete this course?")) return;
  courses = courses.filter(c => c.id !== id);
  assignments = assignments.filter(a => a.courseId !== id);
  saveData();
  renderCourses();
  renderAssignments();
}

function editAssignment(id) {
  const a = assignments.find(x => x.id === id);
  const title = prompt("Edit assignment title:", a.title);
  if (title === null) return;
  const dueDate = prompt("Edit due date (YYYY-MM-DD):", a.dueDate);
  if (dueDate === null) return;
  const priority = prompt("Priority: Low, Medium, or High", a.priority);
  if (priority === null) return;
  const status = prompt("Status: Not Started, In Progress, or Completed", a.status);
  if (status === null) return;

  a.title = title.trim() || a.title;
  a.dueDate = dueDate.trim() || a.dueDate;
  if (["Low","Medium","High"].includes(priority)) a.priority = priority;
  if (["Not Started","In Progress","Completed"].includes(status)) a.status = status;
  saveData();
  renderAssignments();
}

function deleteAssignment(id) {
  if (!confirm("Delete this assignment?")) return;
  assignments = assignments.filter(a => a.id !== id);
  saveData();
  renderAssignments();
}

renderCourses();
renderAssignments();
