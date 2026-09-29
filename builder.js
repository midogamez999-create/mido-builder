// ============================================================
// MIDO BUILDER — MAIN EDITOR
// ============================================================

(() => {
  "use strict";

  // ----------------------------------------------------------
  // PROJECT LOADING
  // ----------------------------------------------------------

  const STORAGE_KEY = "mido-builder-projects";

  const params = new URLSearchParams(
    window.location.search
  );

  let projectIndex = Number(
    params.get("project")
  );

  if (!Number.isInteger(projectIndex) || projectIndex < 0) {
    projectIndex = 0;
  }

  let projects =
    window.MidoStorage?.get(
      STORAGE_KEY,
      []
    ) || [];

  if (!Array.isArray(projects)) {
    projects = [];
  }

  let project = projects[projectIndex];

  // ----------------------------------------------------------
  // CREATE FALLBACK PROJECT
  // ----------------------------------------------------------

  if (!project) {
    project = {
      version: 1,
      name: "My Project",
      components: [],
      pages: [],
      created: Date.now(),
      updated: Date.now()
    };

    projects.push(project);
    projectIndex = projects.length - 1;
  }

  // Make sure old projects have the fields we need.
  project.components =
    Array.isArray(project.components)
      ? project.components
      : [];

  project.pages =
    Array.isArray(project.pages)
      ? project.pages
      : [];

  // ----------------------------------------------------------
  // ELEMENTS
  // ----------------------------------------------------------

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

  const runModal =
    document.querySelector("#runModal");

  const previewCanvas =
    document.querySelector("#previewCanvas");

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  let selectedIndex = null;

  // ----------------------------------------------------------
  // TOAST
  // ----------------------------------------------------------

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

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
      showToast.timer
    );

    showToast.timer =
      setTimeout(() => {
        toast.classList.remove("show");
      }, 1600);
  }

  // ----------------------------------------------------------
  // SAVE PROJECT
  // ----------------------------------------------------------

  function saveProject(showMessage = true) {

    project.updated = Date.now();

    // Normalize through the project system if available.
    if (
      window.MidoProjectFormat?.normalize
    ) {
      project =
        window.MidoProjectFormat.normalize(
          project
        );
    }

    projects[projectIndex] =
      project;

    if (window.MidoStorage) {

      window.MidoStorage.set(
        STORAGE_KEY,
        projects
      );

    } else {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(projects)
      );

    }

    if (showMessage) {
      showToast("Project saved");
    }
  }

  // ----------------------------------------------------------
  // PROJECT TITLE
  // ----------------------------------------------------------

  function updateProjectTitle() {

    if (!projectTitle) return;

    projectTitle.textContent =
      project.name ||
      "Untitled Project";
  }

  // ----------------------------------------------------------
  // COMPONENT CREATION
  // ----------------------------------------------------------

  function createComponent(type) {

    // Use the central component system.
    if (
      window.MidoComponents?.create
    ) {
      return window.MidoComponents.create(
        type
      );
    }

    // Fallback for safety.
    const defaults = {

      text: {
        text: "Hello from Mido Builder",
        size: 20
      },

      button: {
        text: "Click Me",
        size: 18
      },

      image: {
        text: "Image",
        size: 18
      },

      card: {
        text: "Card content",
        size: 18
      },

      input: {
        text: "Enter text...",
        size: 16
      },

      heading: {
        text: "Heading",
        size: 28
      }

    };

    return {
      id:
        String(
          Date.now() +
          Math.random()
        ),

      type,

      ...(defaults[type] ||
        defaults.text)
    };
  }

  // ----------------------------------------------------------
  // ADD COMPONENT
  // ----------------------------------------------------------

  function addComponent(type) {

    const component =
      createComponent(type);

    project.components.push(
      component
    );

    selectedIndex =
      project.components.length - 1;

    saveProject(false);

    render();

    showToast(
      type.charAt(0).toUpperCase() +
      type.slice(1) +
      " added"
    );
  }

  // ----------------------------------------------------------
  // CREATE CANVAS ELEMENT
  // ----------------------------------------------------------

  function createElement(
    component,
    index,
    interactive = true
  ) {

    const wrapper =
      document.createElement("div");

    wrapper.className =
      "canvas-component";

    if (
      selectedIndex === index &&
      interactive
    ) {
      wrapper.classList.add(
        "selected"
      );
    }

    wrapper.dataset.index =
      index;

    // --------------------------------------------------------
    // TEXT
    // --------------------------------------------------------

    if (
      component.type === "text" ||
      component.type === "heading"
    ) {

      const text =
        document.createElement("div");

      text.textContent =
        component.text ||
        "";

      text.style.fontSize =
        (
          component.size ||
          (
            component.type === "heading"
              ? 28
              : 18
          )
        ) + "px";

      text.style.fontWeight =
        component.type === "heading"
          ? "800"
          : "700";

      if (component.color) {
        text.style.color =
          component.color;
      }

      wrapper.appendChild(text);
    }

    // --------------------------------------------------------
    // BUTTON
    // --------------------------------------------------------

    else if (
      component.type === "button"
    ) {

      const button =
        document.createElement("button");

      button.className =
        "canvas-button";

      button.textContent =
        component.text ||
        "Click Me";

      button.style.fontSize =
        (
          component.size ||
          18
        ) + "px";

      if (component.color) {
        button.style.background =
          component.color;
      }

      // Don't trigger editor selection
      // when clicking the actual button.
      if (interactive) {

        button.onclick =
          event => {

            event.stopPropagation();

            if (
              component.action
            ) {

              window.MidoActions?.run(
                component.action,
                {
                  project,
                  component
                }
              );

              return;
            }

            showToast(
              "Button clicked"
            );

          };
      }
    }

    // --------------------------------------------------------
    // IMAGE
    // --------------------------------------------------------

    else if (
      component.type === "image"
    ) {

      if (component.src) {

        const image =
          document.createElement("img");

        image.src =
          component.src;

        image.alt =
          component.text ||
          "Image";

        image.style.width =
          "100%";

        image.style.maxHeight =
          "220px";

        image.style.objectFit =
          "cover";

        image.style.borderRadius =
          "12px";

        wrapper.appendChild(
          image
        );

      } else {

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
    }

    // --------------------------------------------------------
    // CARD
    // --------------------------------------------------------

    else if (
      component.type === "card"
    ) {

      const card =
        document.createElement("div");

      card.className =
        "canvas-card";

      card.textContent =
        component.text ||
        "Card content";

      card.style.fontSize =
        (
          component.size ||
          18
        ) + "px";

      if (component.color) {
        card.style.borderColor =
          component.color;
      }

      wrapper.appendChild(
        card
      );
    }

    // --------------------------------------------------------
    // INPUT
    // --------------------------------------------------------

    else if (
      component.type === "input"
    ) {

      const input =
        document.createElement("input");

      input.type =
        "text";

      input.placeholder =
        component.text ||
        "Enter text...";

      input.style.width =
        "100%";

      input.style.padding =
        "12px";

      input.style.fontSize =
        (
          component.size ||
          16
        ) + "px";

      input.style.border =
        "1px solid #ccd1d9";

      input.style.borderRadius =
        "8px";

      wrapper.appendChild(
        input
      );
    }

    // --------------------------------------------------------
    // UNKNOWN COMPONENT
    // --------------------------------------------------------

    else {

      const element =
        document.createElement("div");

      element.textContent =
        component.text ||
        component.type ||
        "Component";

      element.style.fontSize =
        (
          component.size ||
          18
        ) + "px";

      wrapper.appendChild(
        element
      );
    }

    // --------------------------------------------------------
    // SELECT COMPONENT
    // --------------------------------------------------------

    if (interactive) {

      wrapper.onclick =
        event => {

          event.stopPropagation();

          selectedIndex =
            index;

          render();

        };
    }

    return wrapper;
  }

  // ----------------------------------------------------------
  // RENDER CANVAS
  // ----------------------------------------------------------

  function render() {

    if (!canvas) return;

    canvas
      .querySelectorAll(
        ".canvas-component"
      )
      .forEach(element => {
        element.remove();
      });

    if (emptyCanvas) {

      emptyCanvas.style.display =
        project.components.length
          ? "none"
          : "grid";
    }

    project.components.forEach(
      (component, index) => {

        const element =
          createElement(
            component,
            index,
            true
          );

        canvas.appendChild(
          element
        );
      }
    );

    updateProperties();

    // Enable drag-and-drop after
    // every canvas rebuild.
    if (
      window.MidoDragDrop?.enable
    ) {
      window.MidoDragDrop.enable();
    }

    // Let other builder systems know
    // the canvas changed.
    document.dispatchEvent(
      new CustomEvent(
        "mido:render",
        {
          detail: {
            project
          }
        }
      )
    );
  }

  // ----------------------------------------------------------
  // PROPERTIES
  // ----------------------------------------------------------

  function updateProperties() {

    if (
      selectedIndex === null ||
      !project.components[
        selectedIndex
      ]
    ) {

      propertyPanel?.classList.add(
        "hidden"
      );

      return;
    }

    const component =
      project.components[
        selectedIndex
      ];

    propertyPanel?.classList.remove(
      "hidden"
    );

    if (propertyText) {

      propertyText.value =
        component.text ||
        "";
    }

    if (propertySize) {

      propertySize.value =
        component.size ||
        18;
    }
  }

  // ----------------------------------------------------------
  // PROPERTY TEXT
  // ----------------------------------------------------------

  if (propertyText) {

    propertyText.oninput =
      () => {

        if (
          selectedIndex === null
        ) {
          return;
        }

        const component =
          project.components[
            selectedIndex
          ];

        if (!component) return;

        component.text =
          propertyText.value;

        saveProject(false);

        render();
      };
  }

  // ----------------------------------------------------------
  // PROPERTY SIZE
  // ----------------------------------------------------------

  if (propertySize) {

    propertySize.oninput =
      () => {

        if (
          selectedIndex === null
        ) {
          return;
        }

        const component =
          project.components[
            selectedIndex
          ];

        if (!component) return;

        component.size =
          Number(
            propertySize.value
          ) || 18;

        saveProject(false);

        render();
      };
  }

  // ----------------------------------------------------------
  // DELETE COMPONENT
  // ----------------------------------------------------------

  const deleteButton =
    document.querySelector(
      "#deleteComponent"
    );

  if (deleteButton) {

    deleteButton.onclick =
      () => {

        if (
          selectedIndex === null
        ) {
          return;
        }

        project.components.splice(
          selectedIndex,
          1
        );

        selectedIndex =
          null;

        saveProject(false);

        render();

        showToast(
          "Component deleted"
        );
      };
  }

  // ----------------------------------------------------------
  // ADD COMPONENT BUTTONS
  // ----------------------------------------------------------

  document
    .querySelectorAll(
      "[data-add]"
    )
    .forEach(button => {

      button.onclick =
        () => {

          const type =
            button.dataset.add;

          if (!type) return;

          addComponent(type);
        };
    });

  // ----------------------------------------------------------
  // SAVE BUTTON
  // ----------------------------------------------------------

  const saveButton =
    document.querySelector(
      "#saveProject"
    );

  if (saveButton) {

    saveButton.onclick =
      () => {

        saveProject(true);
      };
  }

  // ----------------------------------------------------------
  // BACK BUTTON
  // ----------------------------------------------------------

  const backButton =
    document.querySelector(
      "#back"
    );

  if (backButton) {

    backButton.onclick =
      () => {

        window.location.href =
          "index.html";
      };
  }

  // ----------------------------------------------------------
  // RUN PROJECT
  // ----------------------------------------------------------

  const runButton =
    document.querySelector(
      "#runProject"
    );

  if (runButton) {

    runButton.onclick =
      () => {

        if (!previewCanvas) {
          return;
        }

        // Prefer the shared preview system.
        if (
          window.MidoRuntime?.mount
        ) {

          window.MidoRuntime.mount(
            project,
            previewCanvas
          );

        } else if (
          window.MidoPreview?.render
        ) {

          window.MidoPreview.render(
            project.components,
            previewCanvas
          );

        } else {

          previewCanvas.innerHTML =
            "";

          project.components.forEach(
            component => {

              const element =
                createElement(
                  component,
                  -1,
                  false
                );

              element.classList.remove(
                "selected"
              );

              previewCanvas.appendChild(
                element
              );
            }
          );
        }

        runModal?.classList.remove(
          "hidden"
        );
      };
  }

  // ----------------------------------------------------------
  // CLOSE RUN PREVIEW
  // ----------------------------------------------------------

  const closeRun =
    document.querySelector(
      "#closeRun"
    );

  if (closeRun) {

    closeRun.onclick =
      () => {

        runModal?.classList.add(
          "hidden"
        );
      };
  }

  // ----------------------------------------------------------
  // CLOSE MODAL WHEN CLICKING OUTSIDE
  // ----------------------------------------------------------

  if (runModal) {

    runModal.onclick =
      event => {

        if (
          event.target ===
          runModal
        ) {

          runModal.classList.add(
            "hidden"
          );
        }
      };
  }

  // ----------------------------------------------------------
  // ESCAPE CLOSES PREVIEW
  // ----------------------------------------------------------

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        runModal &&
        !runModal.classList.contains(
          "hidden"
        )
      ) {

        runModal.classList.add(
          "hidden"
        );
      }
    }
  );

  // ----------------------------------------------------------
  // IMAGE UPLOAD
  // ----------------------------------------------------------

  document.addEventListener(
    "mido:image-upload",
    event => {

      const data =
        event.detail;

      if (
        selectedIndex === null ||
        !data
      ) {
        return;
      }

      const component =
        project.components[
          selectedIndex
        ];

      if (!component) return;

      if (data.data) {

        component.src =
          data.data;
      }

      if (data.file?.name) {

        component.text =
          data.file.name;
      }

      saveProject(false);

      render();

      showToast(
        "Image added"
      );
    }
  );

  // ----------------------------------------------------------
  // DRAG REORDER
  // ----------------------------------------------------------

  document.addEventListener(
    "mido:reorder",
    event => {

      const from =
        event.detail?.from;

      const to =
        event.detail?.to;

      if (
        !Number.isInteger(from) ||
        !Number.isInteger(to)
      ) {
        return;
      }

      if (
        from < 0 ||
        to < 0 ||
        from >= project.components.length ||
        to >= project.components.length
      ) {
        return;
      }

      const moved =
        project.components.splice(
          from,
          1
        )[0];

      project.components.splice(
        to,
        0,
        moved
      );

      selectedIndex =
        to;

      saveProject(false);

      render();
    }
  );

  // ----------------------------------------------------------
  // EXTERNAL SELECTION
  // ----------------------------------------------------------

  document.addEventListener(
    "mido:select",
    event => {

      const index =
        event.detail?.index;

      if (
        Number.isInteger(index) &&
        project.components[index]
      ) {

        selectedIndex =
          index;

        render();
      }
    }
  );

  // ----------------------------------------------------------
  // NAVIGATION EVENTS
  // ----------------------------------------------------------

  document.addEventListener(
    "mido:navigate",
    event => {

      const page =
        event.detail?.page;

      if (!page) return;

      showToast(
        "Navigate → " + page
      );
    }
  );

  // ----------------------------------------------------------
  // IMAGE TOOL BUTTON
  // ----------------------------------------------------------

  document
    .querySelectorAll(
      '[data-add="image"]'
    )
    .forEach(button => {

      button.addEventListener(
        "dblclick",
        () => {

          if (
            selectedIndex === null
          ) {
            showToast(
              "Select an image first"
            );

            return;
          }

          if (
            window.MidoImageUpload?.open
          ) {

            window.MidoImageUpload.open(
              data => {

                const component =
                  project.components[
                    selectedIndex
                  ];

                if (!component) {
                  return;
                }

                component.src =
                  data.data;

                component.text =
                  data.file?.name ||
                  "Image";

                saveProject(false);

                render();

                showToast(
                  "Image uploaded"
                );
              }
            );
          }
        }
      );
    });

  // ----------------------------------------------------------
  // EXPORT PROJECT
  // ----------------------------------------------------------

  document.addEventListener(
    "mido:export",
    event => {

      const format =
        event.detail?.format ||
        "json";

      if (
        format === "html" &&
        window.MidoExport?.html
      ) {

        window.MidoExport.html(
          project
        );

        showToast(
          "HTML exported"
        );

        return;
      }

      if (
        window.MidoExport?.json
      ) {

        window.MidoExport.json(
          project
        );

        showToast(
          "Project exported"
        );
      }
    }
  );

  // ----------------------------------------------------------
  // PROJECT CHANGE EVENT
  // ----------------------------------------------------------

  document.addEventListener(
    "mido:state",
    () => {

      project.updated =
        Date.now();
    }
  );

  // ----------------------------------------------------------
  // SAVE BEFORE LEAVING
  // ----------------------------------------------------------

  window.addEventListener(
    "beforeunload",
    () => {

      saveProject(false);
    }
  );

  // ----------------------------------------------------------
  // GLOBAL API
  // ----------------------------------------------------------

  window.MidoBuilder = {

    getProject() {
      return project;
    },

    getProjects() {
      return projects;
    },

    save() {
      saveProject(true);
    },

    render() {
      render();
    },

    add(type) {
      addComponent(type);
    },

    select(index) {

      if (
        Number.isInteger(index) &&
        project.components[index]
      ) {

        selectedIndex =
          index;

        render();
      }
    },

    deleteSelected() {

      if (
        selectedIndex === null
      ) {
        return;
      }

      project.components.splice(
        selectedIndex,
        1
      );

      selectedIndex =
        null;

      saveProject(false);

      render();

      showToast(
        "Component deleted"
      );
    },

    exportJSON() {

      window.MidoExport?.json(
        project
      );
    },

    exportHTML() {

      window.MidoExport?.html(
        project
      );
    }

  };

  // ----------------------------------------------------------
  // INITIALIZE
  // ----------------------------------------------------------

  updateProjectTitle();

  render();

  // Save the initial project if
  // it was newly created.
  saveProject(false);

  console.log(
    "Mido Builder initialized:",
    project
  );

})();

After pasting it into GitHub, commit the change. Then open "builder.html" from your GitHub Pages/site and test:

1. Add Text
2. Add Button
3. Add Image
4. Add Card
5. Tap a component → edit its text/size
6. Delete a component
7. Drag components around
8. Press Save
9. Press Run

Don't create another JS file yet.