(function () {
  var COLORS = { 1: "#d3e3f3", 2: "#a9cce8", 3: "#4f93c9", 4: "#0b4a8f" };
  var SEL = "#f59e0b";
  var CITY = "#8a6a12";
  var SMALL_HH = 800;
  // Landmarks: yellow dots, name shown on hover, keyboard focus, or tap. Coordinates from the Census geocoder.
  var LANDMARKS = [
    { name: "Gente Youth Center", addr: "638 W Holt Ave", ll: [34.06208, -117.75990] },
    { name: "Gente Community Garden", addr: "1191 S Buena Vista Ave", ll: [34.04839, -117.76735] },
    { name: "Pomona City Hall", addr: "505 S Garey Ave", ll: [34.05502, -117.75011] },
    { name: "Pomona Valley Hospital Medical Center", addr: "1798 N Garey Ave", ll: [34.07784, -117.75228] }
  ];
  var TOUCH = window.matchMedia && window.matchMedia("(hover: none)").matches;

  // ---------- Text (English / Spanish) ----------
  // Spanish is a draft: have a fluent Gente reviewer check it before publishing.
  var T = {
    en: {
      htmlTitle: "Pomona Digital Access Map",
      mapLabel: "Map of Pomona census tracts",
      households: "Households",
      measureGroup: "Choose what to show",
      what: { no_internet: "without internet", no_computer: "without a computer" },
      none: { no_internet: "has no internet at home", no_computer: "has no computer at home" },
      long: function (m) { return "households " + T.en.what[m]; },
      legendTitle: function (m) { return "% of households<br>" + T.en.what[m]; },
      legendNote: function (m) { return "Darker blue = more households " + T.en.what[m]; },
      most: "most", fewest: "fewest", fewer: "Fewer", more: "More",
      pickLabel: "Choose a census tract",
      pickNone: "All of Pomona",
      tract: "Tract", censusTract: "Census tract",
      hhCount: function (n) { return n + " households"; },
      title: "Digital Access in Pomona",
      explain: "All numbers on this page count households that <b>do not</b> have internet or a computer at home.",
      hint: TOUCH ? "Tap a census tract on the map, or choose one from the list above." : "Click a census tract on the map, or choose one from the list above.",
      back: "Citywide",
      dirs: { N: "North", S: "South", E: "East", W: "West" },
      ofHH: "of households",
      xOfY: function (a, b) { return a + " of " + b + " households"; },
      oneIn: function (x, m, here) { return "About <b>1 in " + x + "</b> households " + (here ? "here" : "in Pomona") + " " + T.en.none[m] + "."; },
      zero: function (m, here) { return "No households " + (here ? "here" : "in Pomona") + " reported being " + T.en.what[m] + "."; },
      whereStands: "Where Pomona stands",
      cmpTitle: function (m) { return "Households " + T.en.what[m]; },
      cmpValue: function (v, m) { return v + " " + T.en.what[m]; },
      thisTract: "This tract", pomona: "Pomona", county: "LA County",
      chartTitleCity: "How do Pomona’s tracts compare to each other?",
      chartTitleTract: "How does this tract compare to other tracts in Pomona?",
      chartSub: function (m, n) { return "Percentage of households " + T.en.what[m] + " in each of Pomona’s " + n + " tracts"; },
      chartMarker: function (v, m) { return "This tract: " + v + " " + T.en.what[m]; },
      chartAria: function (m, q) { return "Dot plot of the percentage of households " + T.en.what[m] + " in all Pomona tracts" + (q ? ". This tract: " + q.v + ", ranked " + q.r + " of " + q.n + "." : "."); },
      chartCap: function (m, avg) { return "Each dot is one tract. Shading shows quartiles: the darkest blue is the quarter of tracts with the most households " + T.en.what[m] + ". Dashed line = Pomona overall (" + avg + " " + T.en.what[m] + ")."; },
      topTitle: function (m) { return "Most households " + T.en.what[m]; },
      topSub: function (m, s) { return "The 5 tracts with the largest <b>number</b> of households " + T.en.what[m] + ". Together they account for " + s + "% of the city’s total."; },
      topItem: function (n, m, v) { return "<b>" + n + "</b> households " + T.en.what[m] + " (" + v + ")"; },
      rankTitle: function (m) { return "How this tract ranks: households " + T.en.what[m]; },
      rank: function (r, n, m) { return "Out of Pomona’s " + n + " census tracts, this tract ranks <b>" + ord(r) + "</b> for the share of households " + T.en.what[m] + "."; },
      rankKey: function (n, m) { return "1st = the largest share of households " + T.en.what[m] + "; " + ord(n) + " = the smallest."; },
      cmpHeading: "Compared with Pomona and LA County",
      notes: "Notes",
      noteCount: function (n, m, sh, tot) { return "There are <b>" + n + "</b> households " + T.en.what[m] + " here, which is <b>" + sh + "</b> of all Pomona households " + T.en.what[m] + " (" + tot + ")."; },
      noteBoth: function (d, m, a, c, l) { return "A <b>" + (d === "more" ? "larger" : "smaller") + " share</b> of households here are " + T.en.what[m] + " (" + a + ") than in Pomona overall (" + c + ") or LA County (" + l + ")."; },
      noteMixed: function (dc, dl, m, a, c, l) {
        var w = function (d) { return d === "more" ? "<b>larger</b> than" : d === "fewer" ? "<b>smaller</b> than" : "about the same as"; };
        return "The share of households " + T.en.what[m] + " here (" + a + ") is " + w(dc) + " Pomona overall (" + c + ") and " + w(dl) + " LA County (" + l + ").";
      },
      noteTop: "It is in the quarter of Pomona tracts with the most households without internet <b>and</b> the quarter with the most without a computer.",
      noteSmall: function (n) { return "With fewer than " + n + " households, small survey errors can move these percentages noticeably. Treat the rank as approximate."; },
      source: "<b>About these numbers.</b> Share of households in each census tract, from the LA County GIS Hub layer “Internet and Computer Access (census tract),” which is based on U.S. Census Bureau American Community Survey estimates. These are survey estimates with a margin of error, larger in tracts with fewer households. Quartiles split Pomona’s 31 tracts into groups of about 8 and say nothing about statistical significance. One nearly empty tract in unincorporated Pomona (4 households) is left out.",
      download: "Download the data (CSV)",
      loading: "Loading Pomona tract data…",
      slow: "Still loading. This can take a moment on a slow connection.",
      mapLoading: "Loading map…",
      cityLimits: "Pomona city limits",
      landmarks: TOUCH ? "Landmarks (tap a dot for its name)" : "Landmarks (point to a dot for its name)",
      errTitle: "We couldn’t load the map",
      errBody: "Check your internet connection, then try again.",
      reload: "Reload",
      liveTract: function (t, v, m) { return "Tract " + t + " selected: " + v + " " + T.en.what[m] + "."; },
      liveCity: "Showing all of Pomona.",
      tip: function (t, v, m) { return "Tract " + t + ": <b>" + v + " " + T.en.what[m] + "</b>"; }
    },
    es: {
      htmlTitle: "Mapa de acceso digital de Pomona",
      mapLabel: "Mapa de los sectores censales de Pomona",
      households: "Hogares",
      measureGroup: "Elija qué mostrar",
      what: { no_internet: "sin internet", no_computer: "sin computadora" },
      none: { no_internet: "no tiene internet en casa", no_computer: "no tiene computadora en casa" },
      long: function (m) { return "hogares " + T.es.what[m]; },
      legendTitle: function (m) { return "% de hogares<br>" + T.es.what[m]; },
      legendNote: function (m) { return "Azul más oscuro = más hogares " + T.es.what[m]; },
      most: "más", fewest: "menos", fewer: "Menos", more: "Más",
      pickLabel: "Elija un sector censal",
      pickNone: "Todo Pomona",
      tract: "Sector", censusTract: "Sector censal",
      hhCount: function (n) { return n + " hogares"; },
      title: "Acceso digital en Pomona",
      explain: "Todas las cifras de esta página cuentan los hogares que <b>no</b> tienen internet o computadora en casa.",
      hint: TOUCH ? "Toque un sector censal en el mapa o elija uno de la lista de arriba." : "Haga clic en un sector censal del mapa o elija uno de la lista de arriba.",
      back: "Toda la ciudad",
      dirs: { N: "Norte", S: "Sur", E: "Este", W: "Oeste" },
      ofHH: "de los hogares",
      xOfY: function (a, b) { return a + " de " + b + " hogares"; },
      oneIn: function (x, m, here) { return "Aproximadamente <b>1 de cada " + x + "</b> hogares " + (here ? "aquí" : "en Pomona") + " " + T.es.none[m] + "."; },
      zero: function (m, here) { return "Ningún hogar " + (here ? "aquí" : "en Pomona") + " reportó estar " + T.es.what[m] + "."; },
      whereStands: "Cómo se compara Pomona",
      cmpTitle: function (m) { return "Hogares " + T.es.what[m]; },
      cmpValue: function (v, m) { return v + " " + T.es.what[m]; },
      thisTract: "Este sector", pomona: "Pomona", county: "Condado de L.A.",
      chartTitleCity: "¿Cómo se comparan los sectores de Pomona entre sí?",
      chartTitleTract: "¿Cómo se compara este sector con los demás sectores de Pomona?",
      chartSub: function (m, n) { return "Porcentaje de hogares " + T.es.what[m] + " en cada uno de los " + n + " sectores de Pomona"; },
      chartMarker: function (v, m) { return "Este sector: " + v + " " + T.es.what[m]; },
      chartAria: function (m, q) { return "Gráfico de puntos del porcentaje de hogares " + T.es.what[m] + " en todos los sectores de Pomona" + (q ? ". Este sector: " + q.v + ", lugar " + q.r + " de " + q.n + "." : "."); },
      chartCap: function (m, avg) { return "Cada punto es un sector. El sombreado muestra cuartiles: el azul más oscuro es la cuarta parte de los sectores con más hogares " + T.es.what[m] + ". Línea punteada = Pomona en total (" + avg + " " + T.es.what[m] + ")."; },
      topTitle: function (m) { return "Más hogares " + T.es.what[m]; },
      topSub: function (m, s) { return "Los 5 sectores con el mayor <b>número</b> de hogares " + T.es.what[m] + ". Juntos suman el " + s + "% del total de la ciudad."; },
      topItem: function (n, m, v) { return "<b>" + n + "</b> hogares " + T.es.what[m] + " (" + v + ")"; },
      rankTitle: function (m) { return "Posición de este sector: hogares " + T.es.what[m]; },
      rank: function (r, n, m) { return "De los " + n + " sectores censales de Pomona, este sector ocupa el <b>lugar " + r + "</b> en porcentaje de hogares " + T.es.what[m] + "."; },
      rankKey: function (n, m) { return "Lugar 1 = el mayor porcentaje de hogares " + T.es.what[m] + "; lugar " + n + " = el menor."; },
      cmpHeading: "Comparado con Pomona y el condado de Los Ángeles",
      notes: "Notas",
      noteCount: function (n, m, sh, tot) { return "Hay <b>" + n + "</b> hogares " + T.es.what[m] + " aquí, lo que representa el <b>" + sh + "</b> de todos los hogares " + T.es.what[m] + " en Pomona (" + tot + ")."; },
      noteBoth: function (d, m, a, c, l) { return "Aquí, un <b>" + (d === "more" ? "mayor" : "menor") + " porcentaje</b> de hogares está " + T.es.what[m] + " (" + a + ") que en Pomona en total (" + c + ") o en el condado de Los Ángeles (" + l + ")."; },
      noteMixed: function (dc, dl, m, a, c, l) {
        var w = function (d) { return d === "more" ? "<b>mayor</b> que" : d === "fewer" ? "<b>menor</b> que" : "aproximadamente igual que"; };
        return "El porcentaje de hogares " + T.es.what[m] + " aquí (" + a + ") es " + w(dc) + " el de Pomona en total (" + c + ") y " + w(dl) + " el del condado de Los Ángeles (" + l + ").";
      },
      noteTop: "Está entre la cuarta parte de los sectores de Pomona con más hogares sin internet <b>y</b> entre la cuarta parte con más hogares sin computadora.",
      noteSmall: function (n) { return "Con menos de " + n + " hogares, pequeños errores de la encuesta pueden cambiar notablemente estos porcentajes. Tome la posición como aproximada."; },
      source: "<b>Acerca de estas cifras.</b> Porcentaje de hogares en cada sector censal, según la capa “Internet and Computer Access (census tract)” del LA County GIS Hub, basada en estimaciones de la Encuesta sobre la Comunidad Estadounidense (ACS) de la Oficina del Censo de EE. UU. Son estimaciones de encuesta con margen de error, mayor en los sectores con menos hogares. Los cuartiles dividen los 31 sectores de Pomona en grupos de unos 8 y no indican significancia estadística. Se excluye un sector casi vacío en la zona no incorporada de Pomona (4 hogares).",
      download: "Descargar los datos (CSV)",
      loading: "Cargando los datos de los sectores de Pomona…",
      slow: "Todavía está cargando. Puede tardar un poco con una conexión lenta.",
      mapLoading: "Cargando el mapa…",
      cityLimits: "Límites de la ciudad de Pomona",
      landmarks: TOUCH ? "Lugares de referencia (toque un punto para ver su nombre)" : "Lugares de referencia (pase el cursor sobre un punto)",
      errTitle: "No pudimos cargar el mapa",
      errBody: "Revise su conexión a internet e inténtelo de nuevo.",
      reload: "Volver a cargar",
      liveTract: function (t, v, m) { return "Sector " + t + " seleccionado: " + v + " " + T.es.what[m] + "."; },
      liveCity: "Mostrando todo Pomona.",
      tip: function (t, v, m) { return "Sector " + t + ": <b>" + v + " " + T.es.what[m] + "</b>"; }
    }
  };

  var lang = "en";
  try { lang = localStorage.getItem("pomona-lang") || ((navigator.language || "").slice(0, 2) === "es" ? "es" : "en"); } catch (e) {}
  if (!T[lang]) lang = "en";
  function t() { return T[lang]; }

  var measure = "no_internet", selectedId = null, data, summary, feats, layerById = {}, geoLayer, bounds = {}, selLayer = null;
  var body = document.getElementById("panel-body");
  var panelEl = document.getElementById("panel");
  var live = document.getElementById("live");
  var picker = document.getElementById("tract-pick");

  function pct(v) { return v.toFixed(1) + "%"; }
  function num(v) { return v.toLocaleString("en-US"); }
  function ord(n) { var s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
  function p(f) { return f.properties; }
  var ICON_BACK = "<svg viewBox='0 0 16 16' width='14' height='14' aria-hidden='true'><path d='M10 3L5 8l5 5' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/></svg>";

  function showError() {
    if (typeof doneLoading === "function") doneLoading();
    body.innerHTML = "<div class='state'><h1 tabindex='-1'>" + t().errTitle + "</h1><p>" + t().errBody + "</p><button class='btn' id='reload'>" + t().reload + "</button></div>";
    document.getElementById("reload").onclick = function () { location.reload(); };
  }

  applyStaticText();
  // Loading: a skeleton shaped like the panel, a status line, and a chip over the map
  body.innerHTML = "<div class='loading-status' role='status'><span class='spinner' aria-hidden='true'></span><span id='load-msg'>" + t().loading + "</span></div>" +
    "<div class='sk-wrap' aria-hidden='true'><div class='sk sk-h1'></div><div class='sk sk-explain'></div><div class='sk-row'><div class='sk sk-card'></div><div class='sk sk-card'></div></div><div class='sk sk-label'></div><div class='sk sk-bars'></div><div class='sk sk-chart'></div></div>";
  var mapLoad = document.createElement("div");
  mapLoad.className = "map-loading"; mapLoad.setAttribute("aria-hidden", "true");
  mapLoad.innerHTML = "<span class='spinner'></span>" + t().mapLoading;
  document.querySelector(".map-wrap").appendChild(mapLoad);
  var slowTimer = setTimeout(function () { var el = document.getElementById("load-msg"); if (el) el.textContent = t().slow; }, 8000);
  function doneLoading() { clearTimeout(slowTimer); mapLoad.classList.add("gone"); setTimeout(function () { mapLoad.remove(); }, 400); }
  if (typeof L === "undefined") { doneLoading(); showError(); return; }

  var map = L.map("map", { zoomSnap: 0.25, zoomControl: false, attributionControl: true });
  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, OpenStreetMap contributors",
    maxNativeZoom: 16, maxZoom: 18
  }).addTo(map);
  [["city", 445], ["streets", 450], ["sel", 455], ["streetLabels", 460], ["landmarks", 470]].forEach(function (pn) {
    map.createPane(pn[0]).style.zIndex = pn[1];
    if (pn[0] !== "landmarks") map.getPane(pn[0]).style.pointerEvents = "none";
  });

  function getJSON(u) {
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = ctl && setTimeout(function () { ctl.abort(); }, 20000);
    return fetch(u, ctl ? { signal: ctl.signal } : {}).then(function (r) { clearTimeout(timer); if (!r.ok) throw new Error(u); return r.json(); });
  }
  Promise.all(["data/pomona-tracts.geojson", "data/tract-bounds.json", "data/streets.geojson", "data/pomona-city.geojson"].map(getJSON)).then(function (all) {
    data = all[0]; bounds = all[1]; summary = data.summary; feats = data.features;
    geoLayer = L.geoJSON(data, { style: styleFor, onEachFeature: onEach }).addTo(map);
    var b = geoLayer.getBounds();
    fitCity();
    map.setMinZoom(map.getZoom() - 0.5);
    map.setMaxBounds(b.pad(0.15));
    map.options.maxBoundsViscosity = 1;
    addCity(all[3]); addStreets(all[2]); addLandmarks();
    buildPicker(); renderLegend(); renderPanel(); a11yPaths();
    doneLoading(); body.classList.add("reveal");
    map.on("zoomend moveend resize", declutter);
    setTimeout(declutter, 50);
  }).catch(showError);

  // ---------- Map layers ----------
  // Official city limits: dark gold outline on a white casing
  function addCity(cg) {
    L.geoJSON(cg, { pane: "city", interactive: false, style: { color: "#fff", weight: 5, opacity: 0.9, fill: false, lineJoin: "round" } }).addTo(map);
    L.geoJSON(cg, { pane: "city", interactive: false, style: { color: CITY, weight: 2.6, opacity: 1, fill: false, lineJoin: "round" } }).addTo(map);
  }
  function addStreets(sg) {
    var canvas = L.canvas({ pane: "streets" });
    var lines = sg.features.filter(function (f) { return !f.properties.isLabel; });
    // white casing first so lines stay visible on dark blue tracts
    [{ w: 3.6, c: "#fff", o: 0.85 }, { w: 1.1, c: null }].forEach(function (pass) {
      L.geoJSON({ type: "FeatureCollection", features: lines }, {
        renderer: canvas, interactive: false,
        style: function (f) {
          var fw = f.properties.kind === "freeway";
          return { color: pass.c || (fw ? "#7a2e8e" : "#2b3140"), weight: pass.w + (fw ? (pass.c ? 1.2 : 1.1) : 0), opacity: pass.o || 1, lineCap: "round" };
        }
      }).addTo(map);
    });
    // labels are added in priority order (freeways, the Holt label by the Youth Center, then streets) for decluttering
    function prio(f) { return f.properties.kind === "freeway" ? 3 : f.properties.above ? 2 : 1; }
    sg.features.filter(function (f) { return f.properties.isLabel; }).sort(function (a, c) { return prio(c) - prio(a); }).forEach(function (f) {
      var q = f.properties, fw = q.kind === "freeway";
      L.marker([f.geometry.coordinates[1], f.geometry.coordinates[0]], {
        pane: "streetLabels", interactive: false, keyboard: false,
        icon: L.divIcon({ className: "street-label-wrap", iconSize: [0, 0],
          html: "<span class='street-label" + (fw ? " fwy" : "") + "' aria-hidden='true' style='transform:translate(-50%,-50%) rotate(" + (fw ? 0 : q.angle) + "deg)" + (q.above ? " translateY(-19px)" : "") + "'>" + q.label + "</span>" })
      }).addTo(map);
    });
  }

  function addLandmarks() {
    LANDMARKS.forEach(function (lm) {
      var mk = L.marker(lm.ll, {
        pane: "landmarks", keyboard: true, riseOnHover: true,
        icon: L.divIcon({ className: "landmark", iconSize: [14, 14], iconAnchor: [7, 7], html: "<span class='landmark-dot'></span>" })
      }).bindTooltip("<b>" + lm.name + "</b><br>" + lm.addr + ", Pomona", { direction: "top", offset: [0, -8], className: "landmark-tip" }).addTo(map);
      var el = mk.getElement();
      el.setAttribute("role", "img");
      el.setAttribute("aria-label", lm.name + ", " + lm.addr + ", Pomona");
      el.removeAttribute("title");
      // Leaflet opens the tooltip on hover, keyboard focus, and tap
    });
  }

  // Hide street labels that collide with higher-priority labels, the Youth Center, or the map controls
  function declutter() {
    var obstacles = [];
    document.querySelectorAll(".map-ui > *, .landmark-dot").forEach(function (el) {
      if (el.getClientRects().length) obstacles.push(el.getBoundingClientRect());
    });
    var mapRect = document.getElementById("map").getBoundingClientRect();
    function hit(a, c) { return !(a.right + 3 < c.left || a.left - 3 > c.right || a.bottom + 2 < c.top || a.top - 2 > c.bottom); }
    document.querySelectorAll(".street-label").forEach(function (el) {
      el.style.visibility = "";
      var r = el.getBoundingClientRect();
      var off = r.left < mapRect.left || r.right > mapRect.right || r.top < mapRect.top || r.bottom > mapRect.bottom;
      if (off || obstacles.some(function (o) { return hit(r, o); })) el.style.visibility = "hidden";
      else obstacles.push(r);
    });
  }

  function styleFor(f) {
    var sel = p(f).geoid === selectedId;
    return { fillColor: COLORS[p(f)[measure + "_quartile"]], fillOpacity: 0.8, color: "#fff", weight: sel ? 2 : 1.2 };
  }
  function restyle() {
    geoLayer.setStyle(styleFor);
    if (selLayer) { map.removeLayer(selLayer); selLayer = null; }
    if (selectedId && layerById[selectedId]) {
      selLayer = L.geoJSON(layerById[selectedId].feature, { pane: "sel", interactive: false, style: { fill: false, color: SEL, weight: 5, lineJoin: "round" } }).addTo(map);
    }
  }
  function onEach(f, layer) {
    var q = p(f);
    layerById[q.geoid] = layer;
    layer.on("click", function () { layer.closeTooltip(); select(q.geoid); });
    if (!TOUCH) layer.bindTooltip(function () { return t().tip(q.tract, pct(q[measure + "_pct"]), measure); }, { sticky: true });
  }
  // Keyboard and screen reader access to the tract shapes
  function a11yPaths() {
    Object.keys(layerById).forEach(function (id) {
      var el = layerById[id].getElement(); if (!el) return;
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(id, true); } });
    });
    labelPaths();
  }
  function labelPaths() {
    Object.keys(layerById).forEach(function (id) {
      var el = layerById[id].getElement(), q = p(layerById[id].feature); if (!el) return;
      el.setAttribute("aria-label", t().tract + " " + q.tract + ": " + pct(q[measure + "_pct"]) + " " + t().what[measure]);
      el.setAttribute("aria-pressed", id === selectedId ? "true" : "false");
    });
  }

  function fitCity() { map.fitBounds(geoLayer.getBounds(), { paddingTopLeft: [2, 2], paddingBottomRight: [2, 2] }); }

  function select(id, moveFocus) {
    selectedId = id || null;
    picker.value = selectedId || "";
    restyle(); renderPanel(); labelPaths();
    if (selectedId) {
      var l = layerById[selectedId], q = p(l.feature);
      map.fitBounds(l.getBounds(), { padding: [50, 50], maxZoom: 14.5 });
      announce(t().liveTract(q.tract, pct(q[measure + "_pct"]), measure));
    } else {
      fitCity(); announce(t().liveCity);
    }
    panelEl.scrollTop = 0;
    if (moveFocus) { var h = body.querySelector("h1"); if (h) h.focus({ preventScroll: true }); }
  }
  function announce(msg) { live.textContent = ""; setTimeout(function () { live.textContent = msg; }, 30); }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && selectedId) select(null, true); });

  // ---------- Controls ----------
  function buildPicker() {
    var opts = "<option value=''>" + t().pickNone + "</option>";
    feats.slice().sort(function (a, c) { return parseFloat(p(a).tract) - parseFloat(p(c).tract); }).forEach(function (f) {
      var q = p(f), b = bounds[q.geoid] || {}, names = [];
      ["N", "S", "E", "W"].forEach(function (d) { var n = (b[d] || [])[0]; if (n && names.indexOf(n) < 0) names.push(n); });
      opts += "<option value='" + q.geoid + "'>" + t().tract + " " + q.tract + (names.length ? ", " + names.slice(0, 2).join(" & ") : "") + "</option>";
    });
    picker.innerHTML = opts;
    picker.value = selectedId || "";
  }
  picker.onchange = function () { select(picker.value || null, true); };

  function setMeasure(m) {
    measure = m;
    ["no_internet", "no_computer"].forEach(function (k) {
      var btn = document.getElementById(k === "no_internet" ? "btn-internet" : "btn-computer");
      btn.classList.toggle("on", k === m); btn.setAttribute("aria-pressed", k === m);
    });
    if (geoLayer) { restyle(); renderLegend(); renderPanel(); labelPaths(); }
  }
  document.getElementById("btn-internet").onclick = function () { setMeasure("no_internet"); };
  document.getElementById("btn-computer").onclick = function () { setMeasure("no_computer"); };

  function setLang(l) {
    lang = l;
    try { localStorage.setItem("pomona-lang", l); } catch (e) {}
    applyStaticText();
    if (geoLayer) { buildPicker(); renderLegend(); renderPanel(); labelPaths(); }
  }
  Array.prototype.forEach.call(document.querySelectorAll("[data-lang]"), function (b) { b.onclick = function () { setLang(b.getAttribute("data-lang")); }; });

  function applyStaticText() {
    var tx = t();
    document.documentElement.lang = lang;
    document.title = tx.htmlTitle;
    document.getElementById("map").setAttribute("aria-label", tx.mapLabel);
    document.getElementById("seg-lbl").textContent = tx.households;
    document.getElementById("seg").setAttribute("aria-label", tx.measureGroup);
    document.getElementById("btn-internet").textContent = tx.what.no_internet;
    document.getElementById("btn-computer").textContent = tx.what.no_computer;
    document.getElementById("pick-lbl").textContent = tx.pickLabel;
    Array.prototype.forEach.call(document.querySelectorAll("[data-lang]"), function (b) {
      var on = b.getAttribute("data-lang") === lang; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on);
    });
  }

  // Quartile cut points (in %) for the current measure, from rank-based quartiles
  function bands(m) {
    var out = {};
    feats.forEach(function (f) {
      var q = p(f)[m + "_quartile"], v = p(f)[m + "_pct"];
      if (!out[q]) out[q] = { min: v, max: v };
      out[q].min = Math.min(out[q].min, v); out[q].max = Math.max(out[q].max, v);
    });
    return out;
  }

  function renderLegend() {
    var b = bands(measure), tx = t();
    var h = "<div class='lg-full'><b>" + tx.legendTitle(measure) + "</b><span class='lg-note'>" + tx.legendNote(measure) + "</span>";
    [4, 3, 2, 1].forEach(function (q) {
      h += "<div class='lg-row'><i style='background:" + COLORS[q] + "'></i>" + b[q].min.toFixed(1) + "–" + b[q].max.toFixed(1) + "%" + (q === 4 ? " (" + tx.most + ")" : q === 1 ? " (" + tx.fewest + ")" : "") + "</div>";
    });
    h += "<div class='lg-row lg-city'><i></i>" + tx.cityLimits + "</div>";
    h += "<div class='lg-row lg-landmark'><i></i>" + tx.landmarks + "</div></div>";
    // compact one-line legend for phones
    h += "<div class='lg-mini'><span>" + tx.fewer + "</span>" + [1, 2, 3, 4].map(function (q) { return "<i style='background:" + COLORS[q] + "'></i>"; }).join("") + "<span>" + tx.more + " " + tx.long(measure) + "</span></div>";
    document.getElementById("legend").innerHTML = h;
    setTimeout(declutter, 0);
  }

  // ---------- Rank strip plot ----------
  function strip(sel) {
    var tx = t(), m = measure;
    var W = 350, H = 160, L0 = 14, R0 = 14, top = 26, axisY = 102;
    var vals = feats.map(function (f) { return p(f)[m + "_pct"]; });
    var max = Math.ceil(Math.max.apply(null, vals) / 5) * 5;
    function x(v) { return L0 + (v / max) * (W - L0 - R0); }
    var b = bands(m);
    var aria = tx.chartAria(m, sel ? { v: pct(sel[m + "_pct"]), r: sel[m + "_rank"], n: sel.n } : null);
    var s = "<h3 class='chart-title'>" + (sel ? tx.chartTitleTract : tx.chartTitleCity) + "</h3><p class='chart-sub'>" + tx.chartSub(m, feats.length) + "</p><svg class='strip' viewBox='0 0 " + W + " " + H + "' role='img' aria-label='" + aria.replace(/'/g, "&#39;") + "'>";
    // quartile background bands: boundaries midway between adjacent quartiles
    var cuts = [0, (b[1].max + b[2].min) / 2, (b[2].max + b[3].min) / 2, (b[3].max + b[4].min) / 2, max];
    for (var i = 0; i < 4; i++) {
      s += "<rect x='" + x(cuts[i]) + "' y='" + top + "' width='" + (x(cuts[i + 1]) - x(cuts[i])) + "' height='" + (axisY - top) + "' fill='" + COLORS[i + 1] + "' opacity='.55'/>";
    }
    // dots, stacked where values are close
    var placed = [];
    feats.slice().sort(function (a, c) { return p(a)[m + "_pct"] - p(c)[m + "_pct"]; }).forEach(function (f) {
      var cx = x(p(f)[m + "_pct"]), row = 0;
      while (placed.some(function (o) { return o.row === row && Math.abs(o.cx - cx) < 9; })) row++;
      placed.push({ f: f, cx: cx, row: row });
    });
    placed.forEach(function (o) {
      if (sel && p(o.f).geoid === sel.geoid) return;
      s += "<circle cx='" + o.cx + "' cy='" + (axisY - 9 - o.row * 11) + "' r='4.5' fill='#fff' stroke='#5d6472' stroke-width='1.2'/>";
    });
    placed.forEach(function (o) {
      if (!sel || p(o.f).geoid !== sel.geoid) return;
      var cy = axisY - 9 - o.row * 11, lx = Math.min(Math.max(o.cx, 128), W - 128);
      s += "<circle cx='" + o.cx + "' cy='" + cy + "' r='7' fill='" + SEL + "' stroke='#1f2430' stroke-width='2'/>";
      s += "<line x1='" + o.cx + "' x2='" + o.cx + "' y1='" + (top - 2) + "' y2='" + (cy - 8) + "' stroke='#1f2430' stroke-width='1'/>";
      s += "<text x='" + lx + "' y='" + (top - 5) + "' font-size='13' font-weight='700' text-anchor='middle' fill='#1f2430'>" + tx.chartMarker(pct(sel[m + "_pct"]), m) + "</text>";
    });
    var avg = summary.pomona[m + "_pct"];
    s += "<line x1='" + x(avg) + "' x2='" + x(avg) + "' y1='" + top + "' y2='" + axisY + "' stroke='#1f2430' stroke-width='1' stroke-dasharray='3 3'/>";
    s += "<line x1='" + L0 + "' x2='" + (W - R0) + "' y1='" + axisY + "' y2='" + axisY + "' stroke='#5d6472'/>";
    for (var tk = 0; tk <= max; tk += 5) s += "<text x='" + x(tk) + "' y='" + (axisY + 15) + "' font-size='12' text-anchor='middle' fill='#545c6b'>" + tk + "%</text>";
    // two-line phrases: the arrow hangs outside, both lines share one edge
    var padX = 16, l1 = axisY + 35, l2 = axisY + 51, mid = (l1 + l2) / 2 - 4, what = tx.what[m], hh = tx.households.toLowerCase();
    var chev = function (x0, dirn) { return "<path d='M" + (x0 + 3 * dirn) + " " + (mid - 4) + " L" + (x0 - 3 * dirn) + " " + mid + " L" + (x0 + 3 * dirn) + " " + (mid + 4) + "' fill='none' stroke='#1f2430' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/>"; };
    s += chev(L0 + 6, 1);
    s += "<text x='" + (L0 + padX) + "' y='" + l1 + "' font-size='13' font-weight='600' fill='#1f2430'>" + tx.fewer + " " + hh + "</text>";
    s += "<text x='" + (L0 + padX) + "' y='" + l2 + "' font-size='13' font-weight='600' fill='#1f2430'>" + what + "</text>";
    s += chev(W - R0 - 6, -1);
    s += "<text x='" + (W - R0 - padX) + "' y='" + l1 + "' font-size='13' font-weight='600' text-anchor='end' fill='#1f2430'>" + tx.more + " " + hh + "</text>";
    s += "<text x='" + (W - R0 - padX) + "' y='" + l2 + "' font-size='13' font-weight='600' text-anchor='end' fill='#1f2430'>" + what + "</text>";
    return s + "</svg><p class='cap'>" + tx.chartCap(m, pct(avg)) + "</p>";
  }

  function compareBars(vals) {
    var tx = t(), max = Math.max.apply(null, vals.map(function (v) { return v.v; })) * 1.05;
    return "<div class='cmp'><div class='cmp-title'>" + tx.cmpTitle(measure) + "</div>" + vals.map(function (v) {
      return "<div class='row'><div class='row-top'><span>" + v.name + "</span><span class='v'>" + tx.cmpValue(pct(v.v), measure) + "</span></div><div class='bar'><span class='" + (v.me ? "me" : "") + "' style='width:" + (v.v / max * 100) + "%'></span></div></div>";
    }).join("") + "</div>";
  }

  function sourceBlock() {
    return "<div class='src'>" + t().source + " <button class='dl' id='dl'>" + t().download + "</button></div>";
  }
  function bindDl() {
    var el = document.getElementById("dl"); if (!el) return;
    el.onclick = function () {
      var rows = ["tract,geoid,households,no_internet,no_internet_pct,no_internet_rank,no_computer,no_computer_pct,no_computer_rank"];
      feats.forEach(function (f) { var q = p(f); rows.push([q.tract, q.geoid, q.households, q.no_internet, q.no_internet_pct, q.no_internet_rank, q.no_computer, q.no_computer_pct, q.no_computer_rank].join(",")); });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" }));
      a.download = "pomona-digital-access-by-tract.csv"; a.click();
    };
  }

  // ---------- Panels ----------
  function renderPanel() {
    if (!data) return;
    var f = selectedId && layerById[selectedId] ? layerById[selectedId].feature : null;
    body.innerHTML = f ? tractView(p(f)) : cityView();
    bindDl();
    var c = document.getElementById("clear"); if (c) c.onclick = function () { select(null, true); };
    Array.prototype.forEach.call(body.querySelectorAll("[data-id]"), function (b) { b.onclick = function () { select(b.getAttribute("data-id"), true); }; });
  }

  function stat(m, pc, n, hh, here) {
    var tx = t();
    return "<div class='stat" + (m === measure ? " active" : "") + "'><div class='pct'>" + pct(pc) + "</div><div class='lbl'>" + tx.ofHH + " <b>" + tx.what[m] + "</b></div><div class='n'>" + tx.xOfY(num(n), num(hh)) + "</div><div class='onein'>" + (pc > 0 ? tx.oneIn(Math.max(1, Math.round(100 / pc)), m, here) : tx.zero(m, here)) + "</div></div>";
  }

  function cityView() {
    var tx = t(), s = summary.pomona, la = summary.la_county, k = measure;
    var top = feats.slice().sort(function (a, c) { return p(c)[k] - p(a)[k]; }).slice(0, 5);
    var share5 = top.reduce(function (sum, f) { return sum + p(f)[k]; }, 0) / s[k] * 100;
    return "<h1 tabindex='-1'>" + tx.title + "</h1><p class='explain'>" + tx.explain + "</p><p class='sub'>" + tx.hint + "</p>" +
      "<div class='big'>" + stat("no_internet", s.no_internet_pct, s.no_internet, s.households, false) + stat("no_computer", s.no_computer_pct, s.no_computer, s.households, false) + "</div>" +
      "<h2>" + tx.whereStands + "</h2>" + compareBars([{ name: tx.pomona, v: s[k + "_pct"], me: true }, { name: tx.county, v: la[k + "_pct"] }]) +
      strip(null) +
      "<h2>" + tx.topTitle(k) + "</h2><p class='sub'>" + tx.topSub(k, Math.round(share5)) + "</p>" +
      "<ol class='top'>" + top.map(function (f) { var q = p(f); return "<li><button data-id='" + q.geoid + "'><span>" + tx.tract + " " + q.tract + "</span><span class='top-v'>" + tx.topItem(num(q[k]), k, pct(q[k + "_pct"])) + "</span></button></li>"; }).join("") + "</ol>" +
      sourceBlock();
  }

  function boundsBlock(geoid) {
    var b = bounds[geoid] || {}, names = t().dirs;
    var rows = ["N", "S", "E", "W"].filter(function (d) { return b[d] && b[d].length; }).map(function (d) { return "<div><dt>" + names[d] + "</dt><dd>" + b[d].join(" &amp; ") + "</dd></div>"; });
    return rows.length ? "<dl class='bounds'>" + rows.join("") + "</dl>" : "";
  }

  function tractView(q) {
    var tx = t(), k = measure, city = summary.pomona, la = summary.la_county;
    var both = q.no_internet_quartile === 4 && q.no_computer_quartile === 4;
    function dir(a, c) { var d = Math.round((a - c) * 10) / 10; return d > 0 ? "more" : d < 0 ? "fewer" : "same"; }
    var a = q[k + "_pct"], c = city[k + "_pct"], l = la[k + "_pct"], dc = dir(a, c), dl = dir(a, l);
    var h = "<button class='back' id='clear'>" + ICON_BACK + tx.back + "</button><h1 tabindex='-1'>" + tx.censusTract + " " + q.tract + "</h1>" + boundsBlock(q.geoid) + "<p class='sub'>" + tx.hhCount(num(q.households)) + "</p>";
    h += "<div class='big'>" + stat("no_internet", q.no_internet_pct, q.no_internet, q.households, true) + stat("no_computer", q.no_computer_pct, q.no_computer, q.households, true) + "</div>";
    h += "<h2>" + tx.rankTitle(k) + "</h2>";
    h += "<p class='rankline'>" + tx.rank(q[k + "_rank"], q.n, k) + "<span class='rank-key'>" + tx.rankKey(q.n, k) + "</span></p>";
    h += strip(q);
    h += "<h2>" + tx.cmpHeading + "</h2>" + compareBars([{ name: tx.thisTract, v: a, me: true }, { name: tx.pomona, v: c }, { name: tx.county, v: l }]);
    h += "<h2>" + tx.notes + "</h2><ul class='notes'>";
    h += "<li>" + tx.noteCount(num(q[k]), k, pct(q[k + "_share"]), num(city[k])) + "</li>";
    h += "<li>" + (dc === dl && dc !== "same" ? tx.noteBoth(dc, k, pct(a), pct(c), pct(l)) : tx.noteMixed(dc, dl, k, pct(a), pct(c), pct(l))) + "</li>";
    if (both) h += "<li>" + tx.noteTop + "</li>";
    if (q.households < SMALL_HH) h += "<li>" + tx.noteSmall(SMALL_HH) + "</li>";
    h += "</ul>" + sourceBlock();
    return h;
  }
})();
