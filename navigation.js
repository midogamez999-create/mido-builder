(() => {

  window.MidoNavigation = {

    go(page) {

      document.dispatchEvent(
        new CustomEvent(
          "mido:navigate",
          {
            detail: { page }
          }
        )
      );

    },


    link(component, page) {

      component.action = {

        type: "navigate",

        page

      };

    }

  };

})();