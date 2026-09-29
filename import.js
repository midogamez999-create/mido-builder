(() => {

  window.MidoImport = {

    file(file, callback) {

      const reader =
        new FileReader();


      reader.onload = () => {

        try {

          callback(
            null,
            JSON.parse(
              reader.result
            )
          );

        } catch (error) {

          callback(
            error
          );

        }

      };


      reader.onerror = () => {

        callback(
          reader.error
        );

      };


      reader.readAsText(
        file
      );

    }

  };

})();