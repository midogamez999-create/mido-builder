(() => {

  window.MidoRuntime = {

    mount(
      project,
      target
    ) {

      if (!target) return;


      target.innerHTML =
        "";


      (
        project?.components ||
        []
      ).forEach(
        component => {

          const element =
            document.createElement(
              component.type ===
              "button"
                ? "button"
                : "div"
            );


          element.textContent =
            component.text ||
            "";


          element.style.fontSize =
            (
              component.size ||
              18
            ) + "px";


          element.style.margin =
            "10px 0";


          if (
            component.action
          ) {

            element.onclick =
              () => {

                window.MidoActions?.run(
                  component.action
                );

              };

          }


          target.appendChild(
            element
          );

        }
      );

    }

  };

})();