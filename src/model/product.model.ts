export class Product {

  id: number;
  name: string = '';
  pathName: string = '';
  subProducts:
    {
      id: number,
      name: string,
      pathName: string,
      startTime: string,
      endTime: string,
      step: number,
      ext: string
    }[];

  /* constructor() {
   }*/
  constructor(id: number, name: string, pathName: string) {
    this.id = id;
    this.name = name;
    this.pathName = pathName;
  }

}
