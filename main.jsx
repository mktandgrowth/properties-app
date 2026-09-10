import React from "react";
import ReactDOM from "react-dom/client";
import App from "./properties-app.jsx";

// ── Gate temporal pre-lanzamiento — filtro simple del lado del cliente ──
// No es seguridad real (la clave queda visible en el código fuente),
// solo evita que alguien se tope con el sitio antes del lanzamiento.
// Quitar este bloque completo cuando el sitio salga al público.
(function () {
  var GATE_PASS = "4321";
  var GATE_KEY = "c2c_gate_ok";
  if (sessionStorage.getItem(GATE_KEY) === "1") return;
  document.documentElement.style.visibility = "hidden";
  var overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;inset:0;z-index:999999;background:#0a0a0b;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:24px;";
  overlay.innerHTML = '<div style="font-size:20px;color:#f5f0e6;font-weight:500;">C2C</div>' +
    '<div style="font-size:13px;color:#b8b3a7;margin-bottom:6px;">Sitio en preparación — ingresá la clave</div>' +
    '<input id="c2cGatePass" type="password" placeholder="Clave" style="padding:12px 14px;border-radius:10px;border:1px solid rgba(245,240,230,0.2);background:#131316;color:#fff;font-size:15px;width:220px;text-align:center;" />' +
    '<div id="c2cGateErr" style="color:#e57676;font-size:12px;min-height:16px;"></div>' +
    '<button id="c2cGateBtn" style="padding:11px 22px;border-radius:10px;border:none;background:#c9a86a;color:#0a0a0b;font-weight:600;cursor:pointer;">Entrar</button>';
  document.body.appendChild(overlay);
  document.documentElement.style.visibility = "visible";
  var input = document.getElementById("c2cGatePass");
  var btn = document.getElementById("c2cGateBtn");
  var err = document.getElementById("c2cGateErr");
  function tryEnter() {
    if (input.value === GATE_PASS) {
      sessionStorage.setItem(GATE_KEY, "1");
      overlay.remove();
    } else {
      err.textContent = "Clave incorrecta";
      input.value = "";
    }
  }
  btn.addEventListener("click", tryEnter);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") tryEnter(); });
  input.focus();
})();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
