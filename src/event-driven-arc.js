

const user = { name: "Devdeep", balance: 1000 };

const secureUser = new Proxy(user, {
    // Intercept 'get' (reading)
    get(target, prop) {
        console.log(`Property ${prop} was accessed.`);
        return target[prop];
    },
    // Intercept 'set' (writing)
    set(target, prop, value) {
        if (prop === "balance" && value < 0) {
            throw new Error("Balance cannot be negative!");
        }
        console.log(`this is the new balance: ${value}`)
        target[prop] = value;
        return true;
    }
}); 

// secureUser.balance = 500; // Works
console.log(secureUser.balance = 100)

