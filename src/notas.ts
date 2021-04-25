import * as fs from 'fs';
import * as chalk from 'chalk';

/**
 * enum con los posibles colores que pueden asociarse a las notas
 */
export enum colores {
  rojo = 'red',
  verde = 'green',
  azul = 'blue',
  amarillo = 'yellow'
}

/**
 * En esta clase notas implementamos los metodos añadir, leer, modificar, listar y borrar
 */
export class Notas {

  /**
   * Atributo privado notas
   */
  private static notas: Notas;

  /**
   * Constructor
   */
  private constructor() { }

  /**
   * 
   * @returns 
   */
  public static getNotas(): Notas {
    if (!fs.existsSync(`./ficheros`)) {
      fs.mkdirSync(`./ficheros`, {recursive: true});       
    }

    if (!Notas.notas) {
      Notas.notas = new Notas();
    }

    return Notas.notas;
  }

  /**
   * Añade una nota en la ruta correspondiente del autor
   * @param nombre Nombre del autor de la nota
   * @param titulo Titulo de la nota
   * @param contenido Contenido de nota
   * @param color Color de la nota
   * @returns Un mensaje dependiendo si va todo bien o no
   */
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

  /**
   * lee una nota de un determinado autor
   * @param nombre Nombre del autor de la nota
   * @param titulo Titulo de la nota
   * @returns La nota o en caso de que no se encuentre un mensaje de error
   */
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

  /**
   * Modifica una nota en concreto
   * @param nombre Nombre del autor de la nota
   * @param titulo Titulo de la nota
   * @param contenido Contenido de la nota
   * @param color Color de la nota
   * @returns Un mensaje confirmando si ha ido todo de forma correcta, o no
   */
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

  /**
   * Lista todas las notas de un determinado autor
   * @param nombre Nombre del autor de la nota
   * @returns Una lista con las notas del autor o un mensaje en caso de que no se haya encontrado el autor
   */
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

  /**
   * Elimina una nota en concreto de un autor
   * @param nombre Nombre del autor de la nota
   * @param titulo Titulo de la nota a eliminar
   * @returns Un mensaje indicando si ha ido todo bien o no
   */
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