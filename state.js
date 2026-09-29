(() => {

  const state = {};


  window.MidoState = {

    get(key) {

      return state[key];

    },


    set(key, value) {

      state[key] =
        value;

      document.dispatchEvent(
        new CustomEvent(
          "mido:state",
          {
            detail: {
              key,
              value
            }
          }
        )
      );

    },


    all() {

      return {
        ...state
      };

    }

  };

})();