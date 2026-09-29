(() => {

  window.MidoProjectFormat = {

    normalize(project) {

      return {

        version: 1,

        name:
          project?.name ||
          "Untitled Project",

        components:
          Array.isArray(
            project?.components
          )
            ? project.components
            : [],

        pages:
          Array.isArray(
            project?.pages
          )
            ? project.pages
            : [],

        created:
          project?.created ||
          Date.now(),

        updated:
          Date.now()

      };

    }

  };

})();