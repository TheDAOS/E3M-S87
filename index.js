// Project : Dynamic Pricing System for E-commerce

// 1. Product Catalog
class Products {
    #demand;
    #competitor_prices;

    constructor() {
        this.productDetails = {};
        this.productID = 1000;
        this.#demand = {};
        this.#competitor_prices = {};
        this.calculateDemand();
    }

    addProduct(name, price, inventoryLevel, demand) {
        if (name && price && inventoryLevel 
            && (demand === "Low" || demand === "Normal" || demand === "High")
        ){
            this.productDetails[this.productID] = {
                name,
                price,
                inventoryLevel,
                demand,
                salesData: [],
            };
            this.#demand[this.productID] = 0;
            this.productID++;
            console.log(`${name} inventory added.`);
        } else {
            console.log(`Enter Valid Data.`);
        }
    }

    sellingProduct(id, sold) {
        if (this.productDetails[id] && this.productDetails[id].inventoryLevel >= sold) {
            this.productDetails[id].inventoryLevel -= sold ;
            this.productDetails[id].salesData.push((this.productDetails[id].price * sold));
            console.log(`Sold ${sold} ${this.productDetails[id].name}`);
            
        } else {
            console.log(`Enter Valid Data.`);
        }
    }

    async calculateDemand() {
        setInterval(() => {
            for (const key in this.productDetails) {
                const currentProductDetails = this.productDetails[key];

                let temp = 0
                if (currentProductDetails.salesData.length > 0){
                    temp = currentProductDetails.salesData.reduce((accumulator, element) => accumulator+=Math.floor(element/currentProductDetails.price), 0);
                }
                
                if (temp - this.#demand[key] > 5) {
                    currentProductDetails.demand = "High";
                } else if (temp - this.#demand[key] > 3) {
                    currentProductDetails.demand = "Normal";
                } else {
                    currentProductDetails.demand = "Low";
                }
                this.#demand[key] = temp;
                this.priceAdjustmentAlgorithm(key);
                // console.log(this.productDetails[key].demand, this.productDetails[key].price);
            }
            console.log(this.#demand);
        // }, 30000);
        }, 1000);
    }

    priceAdjustmentAlgorithm(key) {
        if (this.productDetails[key].demand === "High" && this.productDetails[key].inventoryLevel < 10){
            this.productDetails[key].price = Math.floor(this.productDetails[key].price * 1.10);
        } else if (this.productDetails[key].demand === "Low" && this.productDetails[key].inventoryLevel > 30){
            this.productDetails[key].price = Math.ceil(this.productDetails[key].price * 0.90);
        }

        let CpAvg = this.competitorPricesAverage(key);
        if (CpAvg !== -1) {
            if (CpAvg > this.productDetails[key].price) {
                this.productDetails[key].price = Math.floor(this.productDetails[key].price * 1.05);
            } else if (CpAvg < this.productDetails[key].price) {
                this.productDetails[key].price = Math.floor(this.productDetails[key].price * 0.95);
            }
        }
    }

    competitorPricesAverage(key) {
        if (!this.#competitor_prices[key]){
            return -1;
        } else {
            let avg = 0;
            for (let i = 0; i<this.#competitor_prices[key].length; i++){
                avg += this.#competitor_prices[key][i];
            }
            return Math.floor(avg/this.#competitor_prices[key].length);
        }
    }

    addCompetitorPrices(id, arr) {
        if (this.productDetails[id]) {
            this.#competitor_prices[id] = arr;
        } else {
            console.log(`Enter Valid Data.`);
        }
    }

}



const ec = new Products();

ec.addProduct("Noodle", 70, 10, "Normal");
ec.addProduct("Soap", 40, 20, "Low");

// console.log(ec);

ec.sellingProduct(1001, 15);

ec.addCompetitorPrices(1001, [40, 44, 47, 50]);
// console.log(ec);