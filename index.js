// Project : Dynamic Pricing System for E-commerce

// 1. Product Catalog
class Products {
    constructor() {
        this.productDetails = {};
        this.productID = 1000;
        this.salesData = [];
    }

    addProduct(name, price, inventoryLevel, demand) {
        if (name && price && inventoryLevel 
            && (demand === "Low" || demand === "Normal" || demand === "High")
        ){
            this.productDetails[this.productID++] = {
                name,
                price,
                inventoryLevel,
                demand,
            };
            console.log(`${name} inventory added.`);
        } else {
            console.log(`Enter Valid Data.`);
        }
    }

    sellingProduct(id, sold) {
        if (this.productDetails[id] && this.productDetails[id].inventoryLevel >= sold) {
            this.productDetails[id].inventoryLevel -= sold ;
            this.salesData.push({
                name: this.productDetails[id].name,
                price: this.productDetails[id].price,
                quantity: sold,
                totalPrice: this.productDetails[id].price * sold,
                demand: this.productDetails[id].demand,
            });
            console.log(`Sold ${sold} ${this.productDetails[id].name}`);
            
        } else {
            console.log(`Enter Valid Data.`);
        }
    }

    // calculateDemand() {
    //     setInterval(() => {
    //         if ()
    //     }, 30000);
    // }

}

// 2. Demand Tracking

//     Track product sales over time to calculate real-time demand.


const ec = new Products();

ec.addProduct("Noodle", 70, 10, "Normal");
ec.addProduct("Soap", 40, 20, "Low");

console.log(ec);

ec.sellingProduct(1001, 2);
console.log(ec);