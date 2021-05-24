const iconoMenu = document.querySelector(".menu");
//DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  iconoMenu.addEventListener("click", desplegarMenu);
  consultarAPI();
  detectaScroll();
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
  const resultado = await respuesta.json();

  crearHtml(resultado);
}

let inicial = 0;
//CREA EL HTML
function crearHtml(resultado) {
  //VARIABLE PARA LLEVAR LA CUENTA TOTAL DEL ARRAY ORIGINAL
  let fin = 30 + inicial;
  //CONTENEDOR PRINCIPAL
  const contenidoPrincipal = document.querySelector(".contenido-gameList");
  const array = JSON.parse(resultado.contents);
  //SEPARO EL ARRAY EN 30
  let arrayGames = array.slice(inicial, fin);

  //ITERO EL ARRAY QUE SEPARE
  arrayGames.forEach((game, index) => {
    inicial++;

    const contenedorJuegos = crearHtmlGame(game);
    //CONDICIONAL PARA CUANDO SE ACABE EL ARRAY
    if (inicial === array.length) {
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
      console.log(contenedorJuegos);
      setObserver();
    }
    contenidoPrincipal.appendChild(contenedorJuegos);
  });
}
//EL CALLBACK DEL OBSERVER , ME PERMITE CARGAR MAS IMGS
function cargarMas(entry) {
  console.log(entry);
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
    console.log(pageYOffset);
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
