const iconoMenu = document.querySelector(".menu");
const inputSearch = document.querySelector(".buscar");
const formulario = document.querySelector(".formulario-buscar");
//DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  iconoMenu.addEventListener("click", desplegarMenu);
  consultarAPI();
  detectaScroll();
  formulario.addEventListener("submit", buscadorGames);
});
//FUNCION PARA DESPLEGAR EL MENU ,CUANDO DOY CLICK EN EL ICONO
function desplegarMenu() {
  //mostrar menu desplegable
  const enlaces = document.querySelector(".enlaces");
  const formulario = document.querySelector(".div-buscador");

  if (document.querySelector(".inactivo")) {
    enlaces.style.display = "flex";
    formulario.style.display = "flex";
    iconoMenu.classList.remove("inactivo");
  } else {
    enlaces.style.display = "none";
    formulario.style.display = "none";
    iconoMenu.classList.add("inactivo");
  }
}
//CONSULTO A LA API
async function consultarAPI() {
  const urlList = "https://www.freetogame.com/api/games";
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(
    urlList
  )}`;
  const respuesta = await fetch(url);
  const resolve = await respuesta.json();
  const resultado = JSON.parse(resolve.contents);
  // console.log(resultado);
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
    arrayGames = resultado;
  }

  //ITERO EL ARRAY QUE SEPARE
  arrayGames.forEach((game, index) => {
    inicial++;

    const contenedorJuegos = crearHtmlGame(game);
    //CONDICIONAL PARA CUANDO SE ACABE EL ARRAY
    if (inicial === resultado.length) {
      const aviso = document.querySelector(".aviso-contenido");
      console.log("no hay mas");
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

  const strong = document.createElement("strong");

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
  console.log("si estoy aqui");
  console.log(e.target);
  if (!inputSearch.value) {
    return;
  } else {
    limpiarHtml();
    console.log(inputSearch.value);
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
  let re = new RegExp(filtrado, "i");
  if (filtrado === "") {
    inputSearch.value = "";
    location.href = "gameList.html";
    return;
  }
  if (resultado.some((juego) => re.test(juego.title))) {
    const arrayFiltrado = resultado.filter((juego) => re.test(juego.title));
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

  while (contenidoPrincipal.firstChild) {
    contenidoPrincipal.removeChild(contenidoPrincipal.firstChild);
  }
}
//////////////////////////////////////////////////////////////
//APARECER ASIDE DANDO CLICK EN FILTRAR
