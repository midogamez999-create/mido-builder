(() => {

  window.MidoImageUpload = {

    open(callback) {

      const input =
        document.createElement(
          "input"
        );


      input.type =
        "file";

      input.accept =
        "image/*";


      input.onchange =
        async () => {

          const file =
            input.files?.[0];

          if (!file) return;


          const data =
            await
            window.MidoMedia
              .dataURL(file);


          if (callback) {

            callback({

              file,

              data

            });

          }

        };


      input.click();

    }

  };

})();