export class Food{
  constructor(
    public name: string,
    public carbs: number,
    public protein: number,
    public fats: number,
    public image: string,
    public cant_servicio : number,
    public id?: number
    
  ){}

  getData() {
    return {
      name: this.name,
      carbs: this.carbs,
      protein: this.protein,
      fats: this.fats,
      image: this.image,
      id: this.id,
      cant_servicio : this.cant_servicio,
    };
  }
}