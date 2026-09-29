(() => {

  window.MidoCanvas = {

    get() {

      return document.querySelector(
        "#canvas"
      );

    },


    clear() {

      const canvas =
        this.get();

      if (!canvas) return;

      canvas
        .querySelectorAll(
          ".canvas-component"
        )
        .forEach(element => {

          element.remove();

        });

    },


    select(index) {

      document.dispatchEvent(
        new CustomEvent(
          "mido:select",
          {
            detail: { index }
          }
        )
      );

    }

  };

})();