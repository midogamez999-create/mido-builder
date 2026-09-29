(() => {
  window.MidoDragDrop = {
    enable() {
      const canvas = document.querySelector("#canvas");
      if (!canvas) return;

      let dragged = null;

      canvas.querySelectorAll(".canvas-component").forEach(el => {
        el.draggable = true;

        el.addEventListener("dragstart", () => {
          dragged = el;
        });

        el.addEventListener("dragover", e => {
          e.preventDefault();
        });

        el.addEventListener("drop", e => {
          e.preventDefault();

          if (!dragged || dragged === el) return;

          const items = [
            ...canvas.querySelectorAll(".canvas-component")
          ];

          const from = items.indexOf(dragged);
          const to = items.indexOf(el);

          if (from < to) {
            el.after(dragged);
          } else {
            el.before(dragged);
          }

          document.dispatchEvent(
            new CustomEvent("mido:reorder", {
              detail: { from, to }
            })
          );
        });
      });
    }
  };
})();