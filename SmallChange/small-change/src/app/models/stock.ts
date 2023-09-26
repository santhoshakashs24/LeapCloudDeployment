export  class Stock{
    constructor(
        public id:String,
        public instrumentId:string,
        public instrument:string,
        public quantity:number,
        public value:number,
        public price:number,
        public change:number
    )
    {}

}
