(() => {

  window.MidoActions = {

    run(action, context = {}) {

      if (!action) return;


      if (
        action.type ===
        "navigate"
      ) {

        window.MidoNavigation?.go(
          action.page
        );

      }


      if (
        action.type ===
        "alert"
      ) {

        alert(
          action.message ||
          "Mido Builder"
        );

      }


      if (
        action.type ===
        "url" &&
        action.url
      ) {

        window.open(
          action.url,
          "_blank",
          "noopener"
        );

      }


      if (
        action.type ===
        "set"
      ) {

        context[action.key] =
          action.value;

      }

    }

  };

})();