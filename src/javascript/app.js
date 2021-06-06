const contenedor = document.querySelector(".contenido-principal");
const divBienvenida = document.querySelector(".bienvenida");
const body = document.querySelector("body");
const contenedorFiltro = document.querySelector(".aside-filtro");
const filtro = document.querySelector(".div-filtro");
const iconoMenu = document.querySelector(".menu");
const inputSearch = document.querySelector(".buscar");
const formulario = document.querySelector(".formulario-buscar");
const btnFiltro = document.querySelector(".filtrar");
const btnBrillo = document.querySelector(".brillo");
const formularioFiltro = document.querySelector(".formulario");
const mq = matchMedia("(min-width:768px)");

//DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  mq.addEventListener("change", () => {
    if (mq.matches) {
      const enlaces = document.querySelector(".enlaces");
      const formulario = document.querySelector(".div-buscador");
      enlaces.style.display = "flex";
      formulario.style.display = "flex";
      iconoMenu.classList.remove("inactivo");
    }
  });
  //CONSULTO EL TEMA O BRILLO
  if (localStorage.getItem("tema")) {
    claro();
    if (!formulario) {
      const parrafosInicio = document.querySelectorAll(".texto p");
      parrafosInicio.forEach((parrafo) => {
        parrafo.style.color = "black";
      });
    }
  } else {
    oscuro();
  }
  iconoMenu.addEventListener("click", desplegarMenu);
  document.addEventListener("click", cerrarFiltro);
  if (formularioFiltro) {
    formularioFiltro.addEventListener("submit", filtroAPI);
  }
  if (formulario) {
    consultarAPI();
    formulario.addEventListener("submit", buscadorGames);
    btnFiltro.addEventListener("click", abrirFiltro);
    detectaScroll();
  }
  btnBrillo.addEventListener("click", cambiarTema);
});
//FUNCION PARA DESPLEGAR EL MENU ,CUANDO DOY CLICK EN EL ICONO
function desplegarMenu() {
  //mostrar menu desplegable
  const enlaces = document.querySelector(".enlaces");
  const formulario = document.querySelector(".div-buscador");

  if (document.querySelector(".inactivo")) {
    enlaces.style.display = "flex";
    if (formulario) {
      formulario.style.display = "flex";
    }
    iconoMenu.classList.remove("inactivo");
  } else {
    enlaces.style.display = "none";
    // enlaces.style.visibility = "hidden";
    // enlaces.style.opacity = "0";
    if (formulario) {
      formulario.style.display = "none";
    }
    iconoMenu.classList.add("inactivo");
  }
}
let urlList = "https://www.freetogame.com/api/games";
//CONSULTO A LA API
async function consultarAPI() {
  // console.log(urlList);
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(
    urlList
  )}`;
  const respuesta = await fetch(url);
  const resolve = await respuesta.json();
  const resultado = JSON.parse(resolve.contents);
  crearHtml(resultado);
}

let inicial = 0;
//CREA EL HTML,LO SUBE AL DOCUMENTO
function crearHtml(resultado) {
  //VARIABLE PARA LLEVAR LA CUENTA TOTAL DEL ARRAY ORIGINAL
  let fin = 30 + inicial;
  //CONTENEDOR PRINCIPAL
  const contenidoPrincipal = document.querySelector(".contenido-gameList");
  //SEPARO EL ARRAY EN 30
  let arrayGames;
  if (resultado.length >= 30) {
    arrayGames = resultado.slice(inicial, fin);
  } else {
    arrayGames = [...resultado];
  }

  //ITERO EL ARRAY QUE SEPARE
  arrayGames.forEach((game, index) => {
    inicial++;

    const contenedorJuegos = crearHtmlGame(game);
    //CONDICIONAL PARA CUANDO SE ACABE EL ARRAY
    if (inicial === resultado.length) {
      const aviso = document.querySelector(".aviso-contenido");
      // console.log("no hay mas");
      let noMore = document.createElement("h3");
      noMore.classList.add("aviso");
      noMore.textContent = "No Hay Mas Contenido";
      contenidoPrincipal.appendChild(contenedorJuegos);
      aviso.appendChild(noMore);
      return;
    }
    //CONDICIONAL PARA CUANDO TERMINE DE ITERAR
    if (index === 29) {
      // console.log(contenedorJuegos);
      setObserver();
    }
    contenidoPrincipal.appendChild(contenedorJuegos);
  });
}
//EL CALLBACK DEL OBSERVER , ME PERMITE CARGAR MAS IMGS
function cargarMas(entry) {
  // console.log(entry);
  if (entry[0].isIntersecting) {
    consultarAPI();
  }
}
//FUNCION DEL OBSERVER
function setObserver() {
  const contenidoPrincipal = document.querySelector(".contenido-gameList");

  const options = {
    treshold: 0.5,
  };
  const observador = new IntersectionObserver(cargarMas, options);
  observador.observe(contenidoPrincipal.lastChild);
}
//FUNCION QUE CREA EL HTML
function crearHtmlGame(game) {
  const { title, id, thumbnail, short_description, game_url } = game;

  const fragment = document.createDocumentFragment();

  const divGame = document.createElement("div");
  divGame.classList.add("game");
  divGame.id = id;

  const divImg = document.createElement("div");
  divImg.classList.add("game-imagen");
  const img = document.createElement("img");
  img.src = thumbnail;
  img.loading = "lazy";
  divImg.appendChild(img);
  const divInfo = document.createElement("div");
  divInfo.classList.add("game-info");

  const titulo = document.createElement("h3");
  titulo.textContent = title;

  const informacion = document.createElement("p");
  informacion.innerHTML = `<strong>Informacion:</strong> ${short_description}`;

  const boton = document.createElement("a");
  boton.href = game_url;
  boton.target = "_blank";
  boton.textContent = "JUEGA AHORA!";

  divInfo.append(titulo, informacion, boton);
  divGame.append(divImg, divInfo);
  fragment.appendChild(divGame);
  return fragment;
}

//////////////////////////////////////////////////////////
function detectaScroll() {
  document.addEventListener("scroll", () => {
    // console.log(pageYOffset);
    let scrollY = pageYOffset;
    const btnScroll = document.querySelector(".btn-scroll");
    if (scrollY < 1000) {
      btnScroll.style.display = "none";
    } else {
      btnScroll.style.display = "block";
      btnScroll.addEventListener("click", () => {
        scroll({
          behavior: "smooth",
          top: 0,
        });
      });
    }
  });
}
/////////////////////////////////////////////////////
function buscadorGames(e) {
  e.preventDefault();
  // const inputBuscador = e.target;
  // console.log("si estoy aqui");
  // console.log(e.target);
  if (!inputSearch.value) {
    return;
  } else {
    limpiarHtml();
    // console.log(inputSearch.value);
    filtrarRespuesta(inputSearch.value);
  }
  // filtrarRespuesta(e.target.value);
}
async function filtrarRespuesta(filtro) {
  const urlList = "https://www.freetogame.com/api/games";
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(
    urlList
  )}`;
  const respuesta = await fetch(url);
  const resolve = await respuesta.json();
  const resultado = JSON.parse(resolve.contents);
  let filtrado = filtro.trim();
  let expresionReg = new RegExp(filtrado, "i");
  if (filtrado === "") {
    inputSearch.value = "";
    location.href = "gameList.html";
    return;
  }
  if (resultado.some((juego) => expresionReg.test(juego.title))) {
    const arrayFiltrado = resultado.filter((juego) =>
      expresionReg.test(juego.title)
    );
    crearHtml(arrayFiltrado);
  } else {
    alert("No tenemos resultados");
    inputSearch.value = "";
    location.href = "gameList.html";
    // crearHtml(resultado);
  }
}
function limpiarHtml() {
  const contenidoPrincipal = document.querySelector(".contenido-gameList");
  const aviso = document.querySelector(".aviso-contenido");

  while (contenidoPrincipal.firstChild) {
    contenidoPrincipal.removeChild(contenidoPrincipal.firstChild);
  }
  while (aviso.firstChild) {
    aviso.removeChild(aviso.firstChild);
  }
}
//////////////////////////////////////////////////////////////
//APARECER ASIDE DANDO CLICK EN FILTRAR
function abrirFiltro(e) {
  e.preventDefault();

  contenedorFiltro.style.visibility = "visible";

  filtro.classList.add("transicion");
  body.classList.add("scroll-body");
}
function cerrarFiltro(e) {
  if (
    e.target.id === "contenido-filtro" ||
    e.target.classList.contains("far") ||
    e.target.id === "submit-filtro"
  ) {
    // console.log("estoy awui");
    filtro.classList.remove("transicion");
    body.classList.remove("scroll-body");
    contenedorFiltro.style.visibility = "hidden";
  }
}
////////////////////////////////////////////////////
//FUNCIONALIDAD AL BOTON DE BRILLO
function cambiarTema() {
  if (!localStorage.getItem("tema")) {
    localStorage.setItem("tema", "claro");
    claro();
  } else {
    localStorage.removeItem("tema");
    oscuro();
  }
}
function claro() {
  contenedor.classList.add("cambio-tema");
  divBienvenida.classList.add("cambio-tema");
  if (!formulario) {
    const parrafosInicio = document.querySelectorAll(".texto p");
    parrafosInicio.forEach((parrafo) => {
      parrafo.style.color = "black";
    });
  }
}
function oscuro() {
  contenedor.classList.remove("cambio-tema");
  divBienvenida.classList.remove("cambio-tema");
  if (!formulario) {
    const parrafosInicio = document.querySelectorAll(".texto p");
    parrafosInicio.forEach((parrafo) => {
      parrafo.style.color = "#a7a7a7";
    });
  }
}
///////////////////////////////////////////////////////////////////
//CONSULTA API DEL FILTRO

function filtroAPI(e) {
  e.preventDefault();
  const inputGenero = document.querySelector("input[name='genero']:checked");
  const inputOrdenar = document.querySelector("select[name='ordenar']");
  const inputPlataforma = document.querySelector(
    "input[name='plataforma']:checked"
  );

  let arregloURL = [inputGenero, inputPlataforma, inputOrdenar];

  arregloURL = arregloURL
    .filter((input) => input !== null)
    .map((input) => input.name);
  let categorias = {
    plataforma: "platform",
    ordenar: "sort-by",
    genero: "category",
  };
  arregloURL = arregloURL.map((categoria) => categorias[categoria]);
  // console.log(arregloURL);

  switch (arregloURL.length) {
    case 1:
      if (inputOrdenar.value === "todos") {
        urlList = "https://www.freetogame.com/api/games";
      } else {
        urlList = `https://www.freetogame.com/api/games?sort-by=${inputOrdenar.value}`;
      }

      break;
    case 2:
      if (inputOrdenar.value !== "todos") {
        if (arregloURL.includes("platform")) {
          urlList = `https://www.freetogame.com/api/games?platform=${inputPlataforma.value}&sort-by=${inputOrdenar.value}`;
        } else {
          urlList = `https://www.freetogame.com/api/games?category=${inputGenero.value.toLowerCase()}&sort-by=${
            inputOrdenar.value
          }`;
        }
      } else {
        if (arregloURL.includes("platform")) {
          urlList = `https://www.freetogame.com/api/games?platform=${inputPlataforma.value}`;
        } else {
          urlList = `https://www.freetogame.com/api/games?category=${inputGenero.value.toLowerCase()}`;
        }
      }

      break;
    case 3:
      urlList = `https://www.freetogame.com/api/games?platform=${
        inputPlataforma.value
      }&category=${inputGenero.value.toLowerCase()}&sort-by=${
        inputOrdenar.value
      }`;

      break;

    default:
      break;
  }

  // console.log(urlList);
  inicial = 0;
  limpiarHtml();
  consultarAPI();
  e.target.reset();
}
