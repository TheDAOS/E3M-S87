// Project : Dynamic Pricing System for E-commerce

class Products {
    #demand;
    #competitor_prices;
    #dashboardAlert;

    constructor() {
        this.productDetails = {};
        this.productID = 1000;
        this.#demand = {};
        this.#competitor_prices = {};
        this.#dashboardAlert = [];
        this.calculateDemand();
        this.uiProductDetails()
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
            this.uiPriceAdjustment(`<strong>${name}</strong> added to inventory.`, "alert-success");
        } else {
            this.uiPriceAdjustment(`Enter Valid Data.`, "alert-danger");
        }
        this.uiProductDetails()
    }

    sellingProduct(id, sold) {
        if (this.productDetails[id] && this.productDetails[id].inventoryLevel >= sold) {
            this.productDetails[id].inventoryLevel -= sold ;
            this.productDetails[id].salesData.push((this.productDetails[id].price * sold));

            this.uiPriceAdjustment(`Sold <strong>${sold}</strong> of <strong>${this.productDetails[id].name}</strong> for <strong>Rs.${this.productDetails[id].price}</strong>`, "alert-info");
        } else {
            this.uiPriceAdjustment(`Enter Valid Data.`, "alert-danger");
        }
        this.uiProductDetails()
    }

    addingInventory(id, more) {
        if (this.productDetails[id] && more > 0) {
            this.productDetails[id].inventoryLevel += more ;
            this.uiPriceAdjustment(`Added <strong>${more}</strong> more to inventory of <strong>${this.productDetails[id].name}</strong> total inventory: <strong>${this.productDetails[id].inventoryLevel}</strong>`, "alert-info");
        } else {
            this.uiPriceAdjustment(`Enter Valid Data.`, "alert-danger");
        }
        this.uiProductDetails()
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
                this.uiPriceAdjustment(`<strong>${currentProductDetails.name}'s</strong> demand is <strong>${currentProductDetails.demand}</strong>`, "alert-warning");
                this.priceAdjustmentAlgorithm(key);
                // console.log(this.productDetails[key].demand, this.productDetails[key].price);
            }
            // console.log(this.#demand);
            this.uiProductDetails()
        }, 10000);
        // }, 1000);
    }

    priceAdjustmentAlgorithm(key) {
        let isPriceChanged = false;

        if (this.productDetails[key].demand === "High" && this.productDetails[key].inventoryLevel < 10){
            this.productDetails[key].price = Math.floor(this.productDetails[key].price * 1.10);
            isPriceChanged = true;
        } else if (this.productDetails[key].demand === "Low" && this.productDetails[key].inventoryLevel > 30){
            this.productDetails[key].price = Math.ceil(this.productDetails[key].price * 0.90);
            isPriceChanged = true;
        }

        let CpAvg = this.competitorPricesAverage(key);
        if (CpAvg !== -1) {
            if (CpAvg > this.productDetails[key].price) {
                this.productDetails[key].price = Math.floor(this.productDetails[key].price * 1.05);
                isPriceChanged = true;
            } else if (CpAvg < this.productDetails[key].price) {
                this.productDetails[key].price = Math.floor(this.productDetails[key].price * 0.95);
                isPriceChanged = true;
            }
        }

        if (isPriceChanged){
            this.uiPriceAdjustment(`<strong>${this.productDetails[key].name}'s</strong> price adjusted to <strong>${this.productDetails[key].price}</strong>`);
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
            this.uiPriceAdjustment(`Enter Valid Data.`, "alert-danger");
        }
    }

    uiProductDetails() {
        const productDetailsTable = document.getElementById('productDetails');
        productDetailsTable.innerHTML = '';
        
        let tableHTML = `
        <table class="m-0 table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Product ID</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Inventory</th>
              <th scope="col">Demand</th>
            </tr>
          </thead>
          <tbody>
        `;
        
        for (const id in this.productDetails) {
            const product = this.productDetails[id];
            // const salesAmount = product.salesData.reduce((acc, sale) => acc + sale, 0);
            // <td>Rs.${salesAmount}</td>
            // <th scope="col">Sales</th>

            tableHTML += `
              <tr>
                <th scope="row">${id}</th>
                <td>${product.name}</td>
                <td>Rs.${product.price}</td>
                <td>${product.inventoryLevel}</td>
                <td>${product.demand}</td>
              </tr>
            `;
        }
    
        tableHTML += `
          </tbody>
        </table>
        `;
        
        productDetailsTable.innerHTML = tableHTML;
    }

    uiPriceAdjustment(message, type="alert-primary") {

        if (!message)
            return;

        const timestamp = new Date().toLocaleString();
        this.#dashboardAlert.unshift([message, type, timestamp]);

        if (this.#dashboardAlert.length > 5){
            this.#dashboardAlert.pop()
        }


        const alertMessage = document.getElementById('priceAdjustment');
        alertMessage.innerHTML = '';
        
        /*
        <div class="alert alert-primary" role="alert">
            A simple primary alert—check it out!
        </div>
        */
        
        let alertHTML = ` 
        <div class="card-header">
            Alerts
        </div>
        `;
        
        for (let i = 0; i<this.#dashboardAlert.length; i++) {

            alertHTML += `
            <div class="m-2 alert ${this.#dashboardAlert[i][1]} alert-dismissible fade show" role="alert">
                ${this.#dashboardAlert[i][0]}
                <p class="fw-lighter fs-6">${this.#dashboardAlert[i][2]}</p>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `;
        }
        
        alertMessage.innerHTML = alertHTML;
    }
    

}



const ec = new Products();

ec.addProduct("Noodle", 70, 10, "Normal");
ec.addProduct("Soap", 40, 20, "Low");
ec.addProduct();

// console.log(ec);

ec.sellingProduct(1001, 15);

ec.addCompetitorPrices(1001, [40, 44, 47, 50]);
// console.log(ec);

setTimeout(() => {
    ec.addingInventory(1000, 50);
}, 5000);