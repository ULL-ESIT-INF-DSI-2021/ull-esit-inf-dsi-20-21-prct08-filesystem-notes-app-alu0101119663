import {colores} from './notas';
import {Notas} from './notas';
import * as yargs from 'yargs';
import { title } from 'node:process';

const notas: Notas = Notas.getNotas();

/**
 * Comando para añadir una nueva nota
 */
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

/**
 * Comando para leer una determinada nota
 */
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

/**
 * Comando para modificar una determinada nota
 */
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

/**
 * Comando para listar las notas de un determinado usuario
 */
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

