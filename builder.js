const params = new URLSearchParams(
  window.location.search
);

const projectIndex =
  Number(params.get("project"));

const STORAGE_KEY =
  "mido-builder-projects";

let projects = JSON.parse(
  localStorage.getItem(STORAGE_KEY) || "[]"
);

let project =
  projects[projectIndex];

let selectedIndex = null;


// -------------------------
// ELEMENTS
// -------------------------

const canvas =
  document.querySelector("#canvas");

const emptyCanvas =
  document.querySelector("#emptyCanvas");

const propertyPanel =
  document.querySelector("#propertyPanel");

const propertyText =
  document.querySelector("#propertyText");

const propertySize =
  document.querySelector("#propertySize");

const projectTitle =
  document.querySelector("#projectTitle");


// -------------------------
// FALLBACK PROJECT
// -------------------------

if (!project) {

  project = {
    name: "My Project",
    components: []
  };

  projectIndex = 0;

  projects.push(project);

}


// -------------------------
// PROJECT TITLE
// -------------------------

projectTitle.textContent =
  project.name;


// -------------------------
// SAVE
// -------------------------

function saveProject() {

  projects[projectIndex] =
    project;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(projects)
  );

  showToast("Project saved");

}


// -------------------------
// TOAST
// -------------------------

function showToast(message) {

  let toast =
    document.querySelector("#toast");

  if (!toast) {

    toast =
      document.createElement("div");

    toast.id = "toast";
    toast.className = "toast";

    document.body.appendChild(toast);

  }

  toast.textContent =
    message;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove("show");

  }, 1600);

}


// -------------------------
// ADD COMPONENT
// -------------------------

function addComponent(type) {

  const component = {

    type: type,

    text:
      type === "text"
        ? "Hello from Mido Builder"
        : type === "button"
        ? "Click Me"
        : type === "image"
        ? "Image"
        : "Card",

    size:
      type === "text"
        ? 20
        : 18

  };


  project.components.push(
    component
  );


  selectedIndex =
    project.components.length - 1;


  render();

  saveProject();

}


// -------------------------
// RENDER
// -------------------------

function render() {

  canvas
    .querySelectorAll(".canvas-component")
    .forEach(element => {

      element.remove();

    });


  emptyCanvas.style.display =
    project.components.length
      ? "none"
      : "grid";


  project.components.forEach(
    (component, index) => {

      const element =
        createElement(
          component,
          index
        );

      canvas.appendChild(
        element
      );

    }
  );


  updateProperties();

}


// -------------------------
// CREATE CANVAS ELEMENT
// -------------------------

function createElement(
  component,
  index
) {

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "canvas-component";


  if (selectedIndex === index) {

    wrapper.classList.add(
      "selected"
    );

  }


  wrapper.dataset.index =
    index;


  if (component.type === "text") {

    const text =
      document.createElement("div");

    text.textContent =
      component.text;

    text.style.fontSize =
      component.size + "px";

    text.style.fontWeight =
      "700";

    wrapper.appendChild(
      text
    );

  }


  else if (
    component.type === "button"
  ) {

    const button =
      document.createElement("button");

    button.className =
      "canvas-button";

    button.textContent =
      component.text;

    button.style.fontSize =
      component.size + "px";

    wrapper.appendChild(
      button
    );

  }


  else if (
    component.type === "image"
  ) {

    const image =
      document.createElement("div");

    image.style.height =
      "160px";

    image.style.borderRadius =
      "12px";

    image.style.background =
      "linear-gradient(135deg,#d9dde5,#f5f6f8)";

    image.style.display =
      "grid";

    image.style.placeItems =
      "center";

    image.style.fontSize =
      "40px";

    image.textContent =
      "▧";

    wrapper.appendChild(
      image
    );

  }


  else if (
    component.type === "card"
  ) {

    const card =
      document.createElement("div");

    card.className =
      "canvas-card";

    card.textContent =
      component.text;

    card.style.fontSize =
      component.size + "px";

    wrapper.appendChild(
      card
    );

  }


  wrapper.onclick =
    event => {

      event.stopPropagation();

      selectedIndex =
        index;

      render();

    };


  return wrapper;

}


// -------------------------
// PROPERTIES
// -------------------------

function updateProperties() {

  if (
    selectedIndex === null ||
    !project.components[
      selectedIndex
    ]
  ) {

    propertyPanel
      .classList.add(
        "hidden"
      );

    return;

  }


  const component =
    project.components[
      selectedIndex
    ];


  propertyPanel
    .classList.remove(
      "hidden"
    );


  propertyText.value =
    component.text || "";


  propertySize.value =
    component.size || 18;

}


// -------------------------
// EDIT TEXT
// -------------------------

propertyText.oninput =
  () => {

    if (
      selectedIndex === null
    ) return;


    project.components[
      selectedIndex
    ].text =
      propertyText.value;


    render();

};


// -------------------------
// EDIT SIZE
// -------------------------

propertySize.oninput =
  () => {

    if (
      selectedIndex === null
    ) return;


    project.components[
      selectedIndex
    ].size =
      Number(
        propertySize.value
      ) || 18;


    render();

};


// -------------------------
// DELETE
// -------------------------

document
  .querySelector(
    "#deleteComponent"
  )
  .onclick = () => {

    if (
      selectedIndex === null
    ) return;


    project.components.splice(
      selectedIndex,
      1
    );


    selectedIndex =
      null;


    saveProject();

    render();

    showToast(
      "Component deleted"
    );

};


// -------------------------
// COMPONENT BUTTONS
// -------------------------

document
  .querySelectorAll(
    "[data-add]"
  )
  .forEach(button => {

    button.onclick = () => {

      addComponent(
        button.dataset.add
      );

    };

  });


// -------------------------
// SAVE BUTTON
// -------------------------

document
  .querySelector(
    "#saveProject"
  )
  .onclick = () => {

    saveProject();

};


// -------------------------
// BACK BUTTON
// -------------------------

document
  .querySelector(
    "#back"
  )
  .onclick = () => {

    window.location.href =
      "index.html";

};


// -------------------------
// RUN PREVIEW
// -------------------------

document
  .querySelector(
    "#runProject"
  )
  .onclick = () => {

    const preview =
      document.querySelector(
        "#previewCanvas"
      );


    preview.innerHTML = "";


    project.components.forEach(
      component => {

        const element =
          createElement(
            component,
            -1
          );


        element.classList.remove(
          "selected"
        );


        preview.appendChild(
          element
        );

      }
    );


    document
      .querySelector(
        "#runModal"
      )
      .classList.remove(
        "hidden"
      );

};


// -------------------------
// CLOSE PREVIEW
// -------------------------

document
  .querySelector(
    "#closeRun"
  )
  .onclick = () => {

    document
      .querySelector(
        "#runModal"
      )
      .classList.add(
        "hidden"
      );

};


// -------------------------
// CANVAS CLICK
// -------------------------

canvas.onclick = () => {

  selectedIndex =
    null;

  render();

};


// -------------------------
// FIRST RENDER
// -------------------------

render();