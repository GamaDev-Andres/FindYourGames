const iconoMenu = document.querySelector(".menu");
document.addEventListener("DOMContentLoaded", () => {
  iconoMenu.addEventListener("click", desplegarMenu);
  consultarAPI();
});

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
async function consultarAPI() {
  const urlList = "https://www.freetogame.com/api/games";
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(
    urlList
  )}`;
  const respuesta = await fetch(url);
  const resultado = await respuesta.json();

  crearHtml(resultado);
}

let inicial = 0;

function crearHtml(resultado) {
  let fin = 30 + inicial;
  const contenidoPrincipal = document.querySelector(".contenido-gameList");
  const array = JSON.parse(resultado.contents);
  //   console.log(arrayGames);
  let arrayGames = array.slice(inicial, fin);
  console.log(arrayGames);
  arrayGames.forEach((game, index) => {
    inicial++;
    const contenedorJuegos = crearHtmlGame(game);
    // console.log(contenedorJuegos);
    if (inicial === array.length) {
      console.log("no hay mas");
      // console.log("SI ENTRE A ESTA PARTE");
      let noMore = document.createElement("h3");
      noMore.textContent = "No Hay Mas Contenido";
      contenidoPrincipal.appendChild(noMore);
      contenidoPrincipal.appendChild(contenedorJuegos);
      return;
    }
    if (index === 29) {
      console.log(contenedorJuegos);
      setObserver();
    }
    contenidoPrincipal.appendChild(contenedorJuegos);
  });
}
function cargarMas(entry) {
  console.log(entry);
  if (entry[0].isIntersecting) {
    consultarAPI();
  }
}
function setObserver() {
  const contenidoPrincipal = document.querySelector(".contenido-gameList");

  const options = {
    treshold: 0.5,
  };
  const observador = new IntersectionObserver(cargarMas, options);
  observador.observe(contenidoPrincipal.lastChild);
}
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

  informacion.prepend(strong);
  divInfo.append(titulo, informacion, boton);
  divGame.append(divImg, divInfo);
  fragment.appendChild(divGame);
  return fragment;
}
