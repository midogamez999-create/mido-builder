const KEY = "mido-builder-projects";

let projects = JSON.parse(
  localStorage.getItem(KEY) || "[]"
);

const $ = (selector) =>
  document.querySelector(selector);


// -------------------------
// SAVE
// -------------------------

function save() {
  localStorage.setItem(
    KEY,
    JSON.stringify(projects)
  );

  render();
}


// -------------------------
// TOAST
// -------------------------

function toast(message) {
  const element = $("#toast");

  element.textContent = message;
  element.classList.add("show");

  setTimeout(() => {
    element.classList.remove("show");
  }, 1800);
}


// -------------------------
// SECURITY
// -------------------------

function safe(text) {
  return String(text).replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[character])
  );
}


// -------------------------
// RENDER PROJECTS
// -------------------------

function render() {

  $("#projectsCount").textContent =
    projects.length;

  $("#componentsCount").textContent =
    projects.reduce(
      (total, project) =>
        total + (project.components || []).length,
      0
    );


  const list = $("#projectList");


  if (!projects.length) {

    list.innerHTML = `
      <div class="card">
        <h3>No projects yet</h3>

        <p class="muted">
          Create your first project.
        </p>
      </div>
    `;

    return;
  }


  list.innerHTML = projects
    .map(
      (project, index) => `
        <div class="project">

          <div>
            <b>${safe(project.name)}</b>

            <br>

            <small>
              ${(project.components || []).length}
              components
            </small>
          </div>

          <button
            class="ghost"
            data-open="${index}"
          >
            Open
          </button>

        </div>
      `
    )
    .join("");


  document
    .querySelectorAll("[data-open]")
    .forEach(button => {

      button.onclick = () => {

        show("components");

        toast(
          "Project opened"
        );

      };

    });

}


// -------------------------
// CHANGE PAGE
// -------------------------

function show(view) {

  document
    .querySelectorAll(".view")
    .forEach(section => {

      section.classList.add("hidden");

    });


  $("#" + view)
    .classList.remove("hidden");


  document
    .querySelectorAll(".nav")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.view === view
      );

    });


  const titles = {

    home:
      "Build something awesome.",

    projects:
      "Your projects",

    components:
      "Components",

    settings:
      "Settings"

  };


  $("#title").textContent =
    titles[view];

}


// -------------------------
// MODAL
// -------------------------

function modal(open) {

  $("#modal")
    .classList.toggle(
      "hidden",
      !open
    );


  if (open) {

    $("#projectName").focus();

  }

}


// -------------------------
// NAVIGATION
// -------------------------

document
  .querySelectorAll(".nav")
  .forEach(button => {

    button.onclick = () => {

      show(
        button.dataset.view
      );

    };

  });


// -------------------------
// NEW PROJECT BUTTONS
// -------------------------

$("#newProject").onclick =
$("#start").onclick =
$("#addProject").onclick = () => {

  modal(true);

};


// -------------------------
// CLOSE MODAL
// -------------------------

$("#close").onclick = () => {

  modal(false);

};


// -------------------------
// CREATE PROJECT
// -------------------------

$("#create").onclick = () => {

  const name =
    $("#projectName")
      .value
      .trim();


  if (!name) {

    toast(
      "Enter a project name"
    );

    return;

  }


  projects.push({

    name: name,

    components: [],

    created: Date.now()

  });


  save();


  $("#projectName").value = "";


  modal(false);


  show("projects");


  toast(
    "Project created"
  );

};


// -------------------------
// ADD COMPONENT
// -------------------------

document
  .querySelectorAll("[data-component]")
  .forEach(button => {

    button.onclick = () => {

      if (!projects.length) {

        toast(
          "Create a project first"
        );

        return;

      }


      const type =
        button.dataset.component;


      projects[
        projects.length - 1
      ].components.push({

        type: type

      });


      save();


      toast(
        type + " added"
      );

    };

  });


// -------------------------
// PREVIEW
// -------------------------

$("#preview").onclick = () => {

  toast(
    "Preview engine is next"
  );

};


// -------------------------
// SETTINGS
// -------------------------

$("#saveSettings").onclick = () => {

  const settings = {

    name:
      $("#builderName").value,

    headline:
      $("#headline").value

  };


  localStorage.setItem(
    "mido-builder-settings",
    JSON.stringify(settings)
  );


  $("#title").textContent =
    settings.headline;


  toast(
    "Settings saved"
  );

};


// -------------------------
// START
// -------------------------

render();