class User {
  constructor(name, email, role) {
    this.name = name;
    this.email = email;
    this.role = role;
  }

  greetUserAccodingToRole(role) {
    if (role === "admin") {
      return `hello ${this.name}`;
    }
    else {
        return `hello ${this.role}`
    }
  }

  can(action) {
    return false; // default user has no permissions
  }

  getInfo() {
    return { name: this.name, email: this.email, role: this.role };
  }
}

class SuperAdmin extends User {
    constructor(name , email){
        super(name , email )
        this.role = "superadmin"
    }

    can(action) {
        return true;
    }
}

class StaffMember extends User {
  constructor(name, email, permissions = []) {
    super(name, email);
    this.role = "staff";
    this.permissions = permissions; // e.g., ['updateUser', 'updateGame', 'readUser']
  }

  can(action) {
    // Check if action is in allowed permissions
    return this.permissions.includes(action);
  }
}


const user = new User("Devdeep" , "patidardevdeep8@gmail.com" , "admin")
const ansh = new User("Ansh" , "ansh@gmail.com" , "staff")
const superAdmin = new SuperAdmin("Alice", "alice@company.com");
const staff = new StaffMember("Bob", "bob@company.com", ["updateUser", "readUser"]);
console.log(superAdmin.can("deleteGame")); // true

console.log(staff.can("deleteGame"));      // false
