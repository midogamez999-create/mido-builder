(() => {

  window.MidoProperties = {

    bind(component, inputs, onChange) {

      if (!component) return;


      if (inputs.text) {

        inputs.text.value =
          component.text || "";

        inputs.text.oninput = () => {

          onChange({
            text:
              inputs.text.value
          });

        };

      }


      if (inputs.size) {

        inputs.size.value =
          component.size || 18;

        inputs.size.oninput = () => {

          onChange({
            size:
              Number(
                inputs.size.value
              ) || 18
          });

        };

      }


      if (inputs.color) {

        inputs.color.value =
          component.color ||
          "#111111";

        inputs.color.oninput = () => {

          onChange({
            color:
              inputs.color.value
          });

        };

      }

    }

  };

})();