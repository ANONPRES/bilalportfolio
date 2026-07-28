(() => {
  const form = document.getElementById("waitlist");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = new FormData(form).get("email");
    const key = "reportbrief_waitlist";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    if (typeof email === "string" && email && !existing.includes(email)) {
      existing.push(email);
      localStorage.setItem(key, JSON.stringify(existing));
    }
    status.hidden = false;
    status.textContent =
      "Заявка сохранена локально. Для реального waitlist подключите Formspree/Buttondown и замените этот обработчик.";
    form.reset();
  });
})();
