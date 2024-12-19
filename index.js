// Project : Dynamic Pricing System for E-commerce

// 1. Product Catalog
class Products {
    constructor() {
        this.productDetails = {};
        this.productID = 1000;
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
            }
            console.log(`${name} inventory added.`);
        } else {
            console.log(`Enter Valid Data.`);
        }
    }

    

}

// 2. Demand Tracking

//     Use arrays to store historical sales data for each product.
//     Track product sales over time to calculate real-time demand.


const ec = new Products();

ec.addProduct("Noodle", 70, 10, "Normal");
ec.addProduct("Soap", 40, 20, "Low");

console.log(ec);
