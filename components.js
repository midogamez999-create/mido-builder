(() => {

  const defaults = {

    text: {
      text: "Hello from Mido Builder",
      size: 20
    },

    button: {
      text: "Click Me",
      size: 18
    },

    image: {
      text: "Image",
      size: 18
    },

    card: {
      text: "Card content",
      size: 18
    },

    input: {
      text: "Enter text...",
      size: 16
    },

    heading: {
      text: "Heading",
      size: 28
    }

  };


  window.MidoComponents = {

    defaults,

    create(type) {

      return {

        id:
          crypto.randomUUID
            ? crypto.randomUUID()
            : String(
                Date.now() +
                Math.random()
              ),

        type,

        ...(defaults[type] ||
          defaults.text)

      };

    }

  };

})();