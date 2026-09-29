(() => {

  window.MidoExport = {

    json(
      project,
      filename =
        "mido-project.json"
    ) {

      const blob =
        new Blob(
          [
            JSON.stringify(
              project,
              null,
              2
            )
          ],
          {
            type:
              "application/json"
          }
        );


      const link =
        document.createElement(
          "a"
        );

      link.href =
        URL.createObjectURL(
          blob
        );

      link.download =
        filename;

      link.click();

      URL.revokeObjectURL(
        link.href
      );

    },


    html(
      project,
      filename =
        "mido-app.html"
    ) {

      const body =
        (
          project.components ||
          []
        )
          .map(
            component =>
              `<div>${String(
                component.text || ""
              ).replace(
                /[&<>]/g,
                character =>
                  ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;"
                  })[character]
              )}</div>`
          )
          .join("");


      const html = `
<!doctype html>

<html>

<head>

<meta
  name="viewport"
  content="width=device-width,initial-scale=1"
>

<title>
${project.name || "Mido App"}
</title>

</head>

<body>

${body}

</body>

</html>
`;


      const blob =
        new Blob(
          [html],
          {
            type:
              "text/html"
          }
        );


      const link =
        document.createElement(
          "a"
        );

      link.href =
        URL.createObjectURL(
          blob
        );

      link.download =
        filename;

      link.click();

      URL.revokeObjectURL(
        link.href
      );

    }

  };

})();