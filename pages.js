(() => {

  window.MidoPages = {

    create(name = "Page") {

      return {

        id:
          crypto.randomUUID
            ? crypto.randomUUID()
            : String(
                Date.now() +
                Math.random()
              ),

        name,

        components: []

      };

    },


    add(project, name) {

      if (!project.pages) {

        project.pages = [];

      }

      const page =
        this.create(
          name
        );

      project.pages.push(
        page
      );

      return page;

    },


    remove(project, index) {

      if (
        project.pages &&
        project.pages.length > 1
      ) {

        project.pages.splice(
          index,
          1
        );

      }

    },


    current(
      project,
      index = 0
    ) {

      return (
        project.pages?.[index] ||
        project
      );

    }

  };

})();