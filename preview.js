(() => {

  window.MidoPreview = {

    render(components, target) {

      if (!target) return;

      target.innerHTML = "";


      (components || [])
        .forEach(component => {

          const element =
            document.createElement(
              "div"
            );

          element.style.marginBottom =
            "12px";


          if (
            component.type ===
            "button"
          ) {

            const button =
              document.createElement(
                "button"
              );

            button.textContent =
              component.text ||
              "Button";

            button.style.fontSize =
              (
                component.size ||
                18
              ) + "px";

            element.appendChild(
              button
            );

          }

          else if (
            component.type ===
            "image"
          ) {

            element.textContent =
              "▧ " +
              (
                component.text ||
                "Image"
              );

            element.style.padding =
              "50px";

            element.style.textAlign =
              "center";

            element.style.background =
              "#e8ebf0";

            element.style.borderRadius =
              "12px";

          }

          else {

            element.textContent =
              component.text ||
              "";

            element.style.fontSize =
              (
                component.size ||
                18
              ) + "px";

          }


          target.appendChild(
            element
          );

        });

    }

  };

})();