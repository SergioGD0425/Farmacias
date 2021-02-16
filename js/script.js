//@ts-check
import {
    farmacias
} from './datos.js';

/**
 * @author Sergio García Delgado
 */

crearNavFiltros();
document.getElementById("buscarButton").addEventListener("click", busqueda);
document.getElementById("cancelarButton").addEventListener("click", cancelar);
const DIRECTORIO = document.body.firstElementChild.nextElementSibling.nextElementSibling;
todasLasFarmacias();

/**
 * 
 * Funcion que borra todos los nodoso , muestra todas las farmacias y limpia los inputs
 * 
 * @function cancelar
 */
function cancelar() {
    borrarHijos(DIRECTORIO);
    todasLasFarmacias();
    //@ts-ignore
    document.getElementById("distritoid").value = "";
    //@ts-ignore
    document.getElementById("barrioid").value = "";
}
/**
 * Funcion que recibe un nodo y borra todos los hijos y nietos.
 * 
 * @function borrarHijos
 * 
 * @param {*} node nodo para borrar hijos
 */
function borrarHijos(node) {
    while (node.lastElementChild) {
        borrarHijos(node.lastElementChild);
        node.removeChild(node.lastElementChild);
    }
}

/**
 * Funcion que limpia las farmacias ya mostradas y según si ha decidido buscar por distrito , por barrios o por ambos, hace una búsqueda.
 *
 * @function busqueda
 */
function busqueda() {
    borrarHijos(DIRECTORIO);
    // @ts-ignore
    if (document.getElementById("distritoid").value.length >= 5 || document.getElementById("barrioid").value.length  >= 5 ) {
        if (document.getElementById("distritoid").value != "" && document.getElementById("barrioid").value != "") {
            busquedaDistritos(document.getElementById("distritoid").value);
            busquedaBarrios(document.getElementById("barrioid").value);
        } else {
            if (document.getElementById("distritoid").value != "") {
                // @ts-ignore
                busquedaDistritos(document.getElementById("distritoid").value);
            } else if (document.getElementById("barrioid").value != "") {
                // @ts-ignore
                busquedaBarrios(document.getElementById("barrioid").value);
            }
        }
    }
}

/**
 *  Función a la que le pasas un barrio y hace una búsqueda de las farmacias de ese barrio y te las muestra.
 * 
 * @function busquedaBarrios
 * @param {*} barrio barrio del cual buscar las farmacias
 */
function busquedaBarrios(barrio) {

    let main = DIRECTORIO;
    let farmaciasBarrio = farmacias.docs.filter(elemento => elemento.BARRIO == barrio.toUpperCase());
    if (farmaciasBarrio.length != 0) {

        main.appendChild(crearNodo("article",undefined,undefined));
        main = main.lastElementChild;
        main.appendChild(crearNodo("h2", farmaciasBarrio[0].DISTRITO, "subrayado"));

        main.appendChild(crearNodo("section",undefined,undefined));
        main = main.lastElementChild;
        main.appendChild(crearNodo("h4", barrio.toUpperCase(),undefined));

        main.appendChild(crearNodo("div", undefined, "farmacias"));
        main = main.lastElementChild;
        farmaciasBarrio.filter(elemento => elemento.BARRIO == barrio.toUpperCase()).forEach(element => {
            imprimirFarmacia(main, element);
        });
    }
}


/**
 * Hace una búsqueda por distritos y busca todos los barrios de ese distrito para poder encontrar todas las farmacias de ese distrito y mostrarlas.
 * 
 * @function busquedaDistritos
 *
 * @param {*} distrito distrito del cual buscar barrios y farmacias
 */
function busquedaDistritos(distrito) {
    let main = DIRECTORIO;

    let farmaciasDistrito = farmacias.docs.filter(elemento => elemento.DISTRITO == distrito.toUpperCase());
    if (farmaciasDistrito.length != 0) {
        main.appendChild(crearNodo("article",undefined,undefined));
        main = main.lastElementChild;
        main.appendChild(crearNodo("h2", farmaciasDistrito[0].DISTRITO.toUpperCase(), "subrayado"));

        let barrios = new Array();
        farmaciasDistrito.forEach(element => {
            if (!barrios.includes(element.BARRIO))
                barrios.push(element.BARRIO);
        });
        farmaciasDistrito.forEach(element => {
            while (barrios.length != 0) {
                main.appendChild(crearNodo("section",undefined,undefined));
                main = main.lastElementChild;
                main.appendChild(crearNodo("h4", barrios[0],undefined));

                main.appendChild(crearNodo("div", undefined, "farmacias"));
                main = main.lastElementChild;

                farmaciasDistrito.filter(elemento => elemento.BARRIO == barrios[0]).forEach(element => {
                    imprimirFarmacia(main, element);
                });
                main = main.parentElement.parentElement;
                barrios.splice(barrios.indexOf(barrios[0]), 1);
            }
        });
    }
}


/**
 * Recoge todos los distritos disponibles, luego de ese distrito todos los barrios y hace una búsqueda por cada distrito y barrio para sacar todas las farmacias disponibles. y mostrarlas.
 * 
 * @function todasLasFarmacias
 */
function todasLasFarmacias() {
    let distritos = new Array();
    //RECOJO NOMBRES DE DISTRITOS
    distritos = obtenerDistritos();
    //CONDICION MIENTRAS ME QUEDEN DISTRITOS QUE MOSTRAR
    while (distritos.length != 0) {
        let main = DIRECTORIO;
        //CABECERA CON EL DISTRITO
        main.appendChild(crearNodo("article",undefined,undefined));
        main = main.lastElementChild;
        main.appendChild(crearNodo("h2", distritos[0], "subrayado"));

        //RECOJO UN ARRAY DISTRITOS
        let farmaciasDistrito = farmacias.docs.filter(elemento => elemento.DISTRITO == distritos[0]);
        let barrios = new Array();
        //RECOJO TODAS LOS NOMBRES DE BARRIOS DE UN DISTRITO
        farmaciasDistrito.forEach(element => {
            if (!barrios.includes(element.BARRIO))
                barrios.push(element.BARRIO);
        });
        //POR CADA FARMACIA
        farmaciasDistrito.forEach(element => {
            //MIENTRAS HAYAN BARRIOS QUE MOSTRAR , PINTA FARMACIAS
            while (barrios.length != 0) {
                main.appendChild(crearNodo("section",undefined,undefined));
                main = main.lastElementChild;
                main.appendChild(crearNodo("h4", barrios[0],undefined));

                main.appendChild(crearNodo("div", undefined, "farmacias"));
                main = main.lastElementChild;
                farmaciasDistrito.filter(elemento => elemento.BARRIO == barrios[0]).forEach(element => {
                    imprimirFarmacia(main, element);
                });
                main = main.parentElement.parentElement;
                barrios.splice(barrios.indexOf(barrios[0]), 1);
            }
        });
        distritos.splice(distritos.indexOf(distritos[0]), 1);
    }
    /*
        obtener los distritos y por cada distrito mostrar sus barrios
    */
}


/**
 * Genera la pantalla de filtros y búsqueda en el html.
 *
 * @function crearNavFiltros
 */
function crearNavFiltros() {
    let localization = document.body.firstElementChild.nextElementSibling;
    let newNode;

    localization.appendChild(crearNodo("div", undefined, "filtrosInput"));
    localization = localization.lastElementChild;

    localization.appendChild(crearNodo("span", "Distrito",undefined));

    newNode = crearNodo("input",undefined,undefined);
    newNode.setAttribute("type", "text");
    newNode.setAttribute("minlength", "5");
    newNode.id = "distritoid";
    localization.appendChild(newNode);

    localization.appendChild(crearNodo("span", "Barrio",undefined));

    newNode = crearNodo("input",undefined,undefined);
    newNode.setAttribute("type", "text");
    newNode.setAttribute("minlength", "5");
    newNode.id = "barrioid";
    localization.appendChild(newNode);

    localization = localization.parentElement;

    localization.appendChild(crearNodo("div", undefined, "botones"));
    localization = localization.lastElementChild;

    newNode = crearNodo("button", "Buscar",undefined);
    newNode.setAttribute("type", "button");
    newNode.id = "buscarButton";
    localization.appendChild(newNode);

    newNode = crearNodo("button", "Cancelar",undefined);
    newNode.setAttribute("type", "button");
    newNode.id = "cancelarButton";
    localization.appendChild(newNode);
}


/**
 * Obtiene todos los distritos
 * @function obtenerDistritos
 * @return {*} distritos retorna distritos
 */
function obtenerDistritos() {
    let aux = new Array();
    farmacias.docs.forEach(element => {
        if (!aux.includes(element.DISTRITO))
            aux.push(element.DISTRITO);
    });
    return aux;
}


/**
 * Crea un nodo del tipo que le pasen y si se añaden más parámetros a la función , se le pude insertar texto y dar un tipo de clase.
 *
 * @function crearNodo
 * @param {*} tipoElemento tipo de elemento a crear
 * @param {*} texto texto que contendrá el elemento
 * @param {*} clase clase a la que pertenecerá el elemento
 * @return {*} 
 */

function crearNodo(tipoElemento, texto, clase) {
    let nodo = document.createElement(tipoElemento);
    if (texto != undefined) {
        let text = document.createTextNode(texto);
        nodo.appendChild(text);
    }
    if (clase != undefined)
        nodo.className = clase;
    return nodo;
}
/**
 * Función a la que se le pasa un forario en formatdo ", , , ," y la descompone para devolverla formateada.
 * 
 * @function formatearHorario
 * @param {*} horario horario a formatear
 * @return {*} 
 */
function formatearHorario(horario) {
    let horarioPartido = horario.split(",").filter(word => word != "" && word != " ");
    var retornoHorario = "";
    if (horarioPartido.length == 2) {
        retornoHorario = `${horarioPartido[0]} - ${horarioPartido[1]}`;
    } else if (horarioPartido.length == 4) {
        retornoHorario = `${horarioPartido[0]} - ${horarioPartido[1]} y ${horarioPartido[2]} - ${horarioPartido[3]}`;
    } else if (horarioPartido.length == 0) {
        retornoHorario = "Cerrado";
    }
    return retornoHorario;
}
/**
 * Recibe el nodo donde queire ser introducido y la farmacia e inserta toda la información en el html mediante DOM.
 *
 * @function imprimirFarmacia
 * @param {*} main localización donde se creará la farmacia
 * @param {*} element elemento farmacia
 */
function imprimirFarmacia(main, element) {
    main.appendChild(crearNodo("div",undefined,undefined));
    main = main.lastElementChild;

    main.appendChild(crearNodo("h4", "Nombre", "subrayado"));
    main.appendChild(crearNodo("p", element.NOMBRE,undefined));


    main.appendChild(crearNodo("h4", "Dirección", "subrayado"));
    main.appendChild(crearNodo("p", element.DIRECCION,undefined));

    if (element.WEB != undefined) {
        main.appendChild(crearNodo("h4", "Web", "subrayado"));
        main.appendChild(crearNodo("p", element.WEB,undefined));
    }

    main.appendChild(crearNodo("h4", "Horario", "subrayado"));
    main.appendChild(crearNodo("p", "Lunes : " + formatearHorario(element.LUNES),undefined));
    main.appendChild(crearNodo("p", "Martes : " + formatearHorario(element.MARTES),undefined));
    main.appendChild(crearNodo("p", "Miércoles : " + formatearHorario(element.MIERCOLES),undefined));
    main.appendChild(crearNodo("p", "Jueves : " + formatearHorario(element.JUEVES),undefined));
    main.appendChild(crearNodo("p", "Viernes : " + formatearHorario(element.VIERNES),undefined));
    main.appendChild(crearNodo("p", "Sábado : " + formatearHorario(element.SABADO),undefined));
    main.appendChild(crearNodo("p", "Domingo : " + formatearHorario(element.DOMINGO),undefined));

    main.appendChild(crearNodo("h4", "Teléfono", "subrayado"));
    main.appendChild(crearNodo("p", element.TELEFONO,undefined));
}