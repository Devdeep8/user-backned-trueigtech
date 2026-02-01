const user = { balance: 1000 };

const secureUser = new Proxy(user, {
    set(target, prop, value, receiver) {
        console.log("Data")
        if (prop === "balance" && value < 0) {
            console.error("Negative balance blocked!");
            return false; // Signifies assignment failure
        }
        
        // Reflect.set returns true if it worked, false if not
        return Reflect.set(target, prop, value, receiver);
    }
});
secureUser.balance = -1

console.log(secureUser)