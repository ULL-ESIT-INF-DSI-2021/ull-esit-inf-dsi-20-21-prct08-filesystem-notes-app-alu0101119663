# Informe práctica 8 - Aplicación de procesamiento de notas de texto

[![Coveralls](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101119663/actions/workflows/coveralls.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101119663/actions/workflows/coveralls.yml)


## Introducción
Durante esta práctica implementaremos una aplicación de pro	cesamiento de notas de texto. Permitirá añadir, modificar, eliminar, lista y leer notas de un usuario que nosotros indiquemos. Las notas se almacenarán como ficheros JSON y interactuaremos con la aplicación desde la línea de comandos.

## Antes de empezar
Antes de empezar, hemos de crear la estructura. Para ello nos haremos los mismos pasos que llevamos haciendo durante el transcurso del tiempo, en bibliografía estarán los enlaces que hemos estado siguiendo.

## Guion de la práctica 
Pulse [aquí](https://ull-esit-inf-dsi-2021.github.io/prct08-filesystem-notes-app/) para ver el enunciado.

## notas.ts

```
import * as fs from 'fs';
import * as chalk from 'chalk';

export enum colores {
  rojo = 'red',
  verde = 'green',
  azul = 'blue',
  amarillo = 'yellow'
}

export class Notas {

  private static notas: Notas;

  private constructor() { }

  public static getNotas(): Notas {
    if (!fs.existsSync(`./ficheros`)) {
      fs.mkdirSync(`./ficheros`, {recursive: true});       
    }

    if (!Notas.notas) {
      Notas.notas = new Notas();
    }

    return Notas.notas;
  }

  anadirNota(nombre: string, titulo: string, contenido: string, color: colores): string {
    const nota: string = `{"titulo": "${titulo}", "contenido": "${contenido}", "color": "${color}"}`;
    const estiloJSON: string = titulo.split(' ').join('');
    const mensajeOK: string = `Nota anadida`;
    const mensajeError: string = `Existe una nota con dicho nombre`;

    if(fs.existsSync(`./ficheros/${nombre}`)) {
      if(fs.existsSync(`./ficheros/${nombre}/${estiloJSON}.json`)) {
        console.log(chalk.red(mensajeError));
        return mensajeError;
      } else {
        fs.writeFileSync(`./ficheros/${nombre}/${estiloJSON}.json`, nota);
        console.log(chalk.green(mensajeOK));
        return mensajeOK;
      }
    } else {
      fs.mkdirSync(`./ficheros/${nombre}`, {recursive: true});
      fs.writeFileSync(`./ficheros/${nombre}/${estiloJSON}.json`, nota);
      console.log(chalk.green(mensajeOK));
      return mensajeOK;
    }
  }

  leerNota(nombre: string, titulo: string) {
    const estiloJSON: string = titulo.split(' ').join('');

    if(fs.existsSync(`./ficheros/${nombre}/${estiloJSON}.json`)) {
      const contenidoNota = fs.readFileSync(`./ficheros/${nombre}/${estiloJSON}.json`);
      const contenidoJSON = JSON.parse(contenidoNota.toString());

      console.log(chalk.keyword(contenidoJSON.color)(contenidoJSON.titulo + '\n\n'));
      console.log(chalk.keyword(contenidoJSON.color)(contenidoJSON.contenido));

      const nota: string = (contenidoJSON.titulo + '\n\n' + contenidoJSON.contenido);
      return nota; 
    } else {
      const mensajeError: string = `Nota no encontrada`;                                  
      console.log(chalk.red(mensajeError));
      return mensajeError;
    }
  }

  modificarNota(nombre: string, titulo: string, contenido: string, color: colores): string {
    const nota: string = `{"titulo": "${titulo}", "contenido": "${contenido}", "color": "${color}"}`;
    const estiloJSON: string = titulo.split(' ').join('');
    const mensajeOK: string = `La nota se ha sobrescrito`;
    const mensajeError1: string = `No existe ninguna nota con ese nombre`;
    const mensajeError2: string = `Usuario no encontrado`;

    if(fs.existsSync(`./ficheros/${nombre}`)) {
      if(fs.existsSync(`./ficheros/${nombre}/${estiloJSON}.json`)) {
        fs.writeFileSync(`./ficheros/${nombre}/${estiloJSON}.json`, nota);

        console.log(chalk.green(mensajeOK));
        return mensajeOK;
      } else {
        console.log(chalk.red(mensajeError1));
        return mensajeError1;
      }
    } else {
      console.log(chalk.red(mensajeError2));
      return mensajeError2;
    }
  }

  listarNotas(nombre: string): string {
    if (fs.existsSync(`./ficheros/${nombre}`)) {
      console.log(`Tienes las siguientes notas: `);
      let notas: string = '';

      fs.readdirSync(`./ficheros/${nombre}/`).forEach((nota) => {
        const contenido = fs.readFileSync(`./ficheros/${nombre}/${nota}`);
        const contenidoJSON = JSON.parse(contenido.toString());

        console.log(chalk.keyword(contenidoJSON.color)(contenidoJSON.titulo));
        notas = notas + contenidoJSON.titulo + '\n';
      });
      return notas;
    } else {
      const mensajeError: string = 'Usuario no encontrado';
      console.log(chalk.red(mensajeError));
      return mensajeError;
    }
  }

  eliminarNota(nombre: string, titulo: string) {
    const estiloJSON: string = titulo.split(' ').join('');

    if(fs.existsSync(`./ficheros/${nombre}/${estiloJSON}.json`)) {
      fs.rmSync(`./ficheros/${nombre}/${estiloJSON}.json`);

      const mensajeEliminado: string = 'Nota eliminada con exito';
      console.log(chalk.green(mensajeEliminado));
      return mensajeEliminado;
    } else {
      const mensajeNoEliminado: string = 'Nota no eliminada, posible error en la ruta o en el nombre';
      console.log(chalk.red(mensajeNoEliminado));
      return mensajeNoEliminado;
    }
  }
}
```
En primer lugar en este fichero, hemos creado un **enum** que contendrá los colores que se nos indicaban que se podían usar en el enunciado. Tras esto tenemos una clase denominada *Notas*. En esta clase usaremos las funciones de la **API síncrona**, para que se ejecute por línea de comando lo que nosotros queramos, ya sea añadir,  modificar, eliminar, lista o leer.
La primera función *getNotas* nos indica que si no existe la carpeta que hemos denominado **ficheros** para alojar los *.json*, la cree. Por último instanciamos un objeto de tipo Notas. Tras esto vienen los metodos para  añadir, modificar, eliminar, lista y leer. Como son muy parecidos, trataré de explicar los dos primeros de manera breve. Para añadir comprobamos que exista el usuario, y si existe comprobamos que no exista un fichero con el nombre que le habíamos pasado. Si esto no ocurre envía un mensaje de error. Para leer una nota, tratamos de buscar el usuario y el nombre del título de la correspondiente nota y en caso de que no se encuentre, se lo indicamos al usuario. Todas las peticiones son del tipo que hemos indicado.

[Código](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101119663/blob/master/src/notas.ts)
[Pruebas unitarias](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101119663/blob/master/tests/notas.spec.ts)

## notasApp.ts

```
import {colores} from './notas';
import {Notas} from './notas';
import * as yargs from 'yargs';

const notas: Notas = Notas.getNotas();

yargs.command({
  command: 'add',
  describe: 'Añade una nueva nota',
  builder: {
    user: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Contenido',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color (rojo, verde, azul, amarillo)',
      demandOption: true,
      type: 'string',
      default: 'blue',
    },
  },
  handler(argv) {
    let colorActual: colores = colores.azul;

    if(typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
      Object.values(colores).forEach((elemento) => {
        if (elemento === argv.color) {
          colorActual = elemento;
        }
      });
      notas.anadirNota(argv.user, argv.title, argv.body, colorActual);
    }
  },
});

yargs.command({
  command: 'read',
  describe: 'Lee una nota',
  builder: {
    user: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      notas.leerNota(argv.user, argv.title);
    }
  },
});

yargs.command({
  command: 'modify',
  describe: 'Modifica una nota',
  builder: {
    user: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Contenido',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    let nuevoColor: colores = colores.azul;
    if(typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
      Object.values(colores).forEach((elemento) => {
        if (elemento === argv.color) {
          nuevoColor = elemento;
        }
      });
      notas.modificarNota(argv.user, argv.title, argv.body, nuevoColor);
    }
  },
});

yargs.command({
  command: 'list',
  describe: 'Lista las notas de un usuario',
  builder: {
    user: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if(typeof argv.user === 'string') {
      notas.listarNotas(argv.user);
    }
  },
});

yargs.command({
  command: 'delete',
  describe: 'Elimina una nota',
  builder: {
    user: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Titulo',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if(typeof argv.user === 'string' && typeof argv.title === 'string') {
      notas.eliminarNota(argv.user, argv.title);
    }
  },
});

yargs.parse();


```
[Código](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101119663/blob/master/src/notasApp.ts)

En este fichero vamos a crear los comandos a través de la herramienta **yargs**. En estos comandos usaremos las funciones que anteriormente creamos en *notas.ts*. Los comandos se crean de una manera muy similar. Con el método *command* de yargs, y dentro de este le pasamos sus respectivas opciones. *Describe* será el bloque donde describimos que acción va a realizar el comando. *Builder* se le indican las opciones que tendrá la acción que vamos a utilizar que son: describe (nombre del argumento), demandOption (se le indica si el argumento es obligatorio), type (indicamos el tipo del argumento que se recibe) y en caso que queramos poner un valor a un valor por defecto, usaremos default. Finalmente con handler, pasandole *argv* como parámetro obtenemos los argumentos y sus valores que anteriormente hemos especificado dentro del builder. Dentro de handler, comprobamos que los argumentos son del tipo que queremos y podremos realizar algunas determinadas operaciones para cambiar los valores de los parámetros que usaremos al llamar la correspondiente función de la clase **Notas**.


## Resultados de las pruebas unitarias

## Conclusión
Durante el desarrollo de esta práctica he aprendido bastante ya que me ha parecido muy interesantes estas dos herramientas, me ha servido mucho para enfrentarme a una práctica de sistemas de ficheros, casi por primera vez. Ya que en las otras veces que he realizado algo similar no se nos ha exigido demasiado y por tanto el resultado fue un poco abstracto. Tanto la API de sincronía de Node.js como Yargs me han parecido, como ya dije, interesantes, quizás se me ha dificultado un poco más el uso de Yargas que el uso de la API. También me ha resultado interesante la herramienta Chalk ya que es útil en caso de que queramos hacer nuestro proyecto un poco más vistoso. Por último mencionar que SonarCloud me parece muy útil y trataré de usarla en todos mis futuros proyectos para mejorar mi código y su cubrimiento de pruebas. 

Para concluir, decir que todas estas herramientas nos ayudan a mejorar y a crecer tanto como programadores en TypeScript, como en programadores en sí para tener una mejor y más eficaz resolución de problemas y poder plantear ideas para afrontar un enunciado o requisito de una forma rápida, fiable y eficaz.

He tenido una pequeña incidencia con la GitHub Action que se dedica para pasar los test. Se lo he añadido en una Issue.

## Bibliografía
Enunciado práctica 8 - 

Yargs - https://www.npmjs.com/package/yargs

API síncrona de Node.js - https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_synchronous_api

Chalk - https://www.npmjs.com/package/chalk

SonarCloud - https://sonarcloud.io/
